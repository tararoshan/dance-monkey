/* options.js
 *
 * KNOWN ERRORS
 * - if the playback rate is changed in the YouTube UI, the extension won't
 * pick up on the change (since the browser is a separate window!)
 *
 * DONE
 * - can change video speed in YouTube with extension (Chrome)
 *      * TODO check in Firefox
 *      * TODO add keyboard shortcuts for speed
 * - can mirror videos in YouTube with extension
 *      * TODO mirror in iframes (such as DuckDuckGo)
 * 
 * CURRENT GOAL
 *      * 
 */

if (!('browser' in window)) {
    window.browser = chrome
}

const MAX_SPEED = 2;
const MIN_SPEED = 0.1;

const browserStorage = browser.storage.local
console.log('tabs', Boolean(browser.tabs), 'scripting', Boolean(browser.scripting))
const executeScript = (browser.tabs.executeScript ?? browser.scripting.executeScript)


/* initialise variables */
var mirrorBox = document.getElementById('mirror');
var speedSlider = document.getElementById('speed-range');
var speedNum = document.getElementById('speed-num');
var loopBox = document.getElementById('loop');

/*  add event listeners to inputs */
mirrorBox.addEventListener('change', onMirrorChange);
speedSlider.addEventListener('change', onSpeedChange);
speedNum.addEventListener('change', onSpeedChange);
loopBox.addEventListener('change', loop);

/* generic error handler */
function onError(error) {
    console.log(error);
}

/* display previously-set options on open (startup) */
initialize();

async function initialize() {
    const state = await browserStorage.get()
    // mirror
    mirrorBox.value = state.mirrorBox;
    // alert(`${mirrorBox.value}`);  // debugging
    mirrorBox.checked = mirrorBox.value === 'on' ? true : false;
    // speed
    speedSlider.value = state.speed;
    speedNum.value = state.speed;
    // alert(`${speedSlider.value}`);  // debugging
}

/* mirror button function */
async function onMirrorChange() {
    // alert('mirror test');  // debugging
    // need to mirror the video if the option was checked
    if (mirrorBox.checked) {
        mirrorBox.value = 'on';
        browserStorage.set({ mirrorBox: 'on' });
        // alert('mirror test on');  // debugging

        let doMirrorVideo = () => {
            var vid = document.querySelector('video');
            if (vid) {
                // TODO wait until the video has finished loading
                // or consistently keep mirroring it on changes
                // var vid = document.querySelector('video');
                vid.style.transform = 'scaleX(-1)';
                // vid.addEventListener('loadeddata', function() {
                //     // Video is loaded and can be played
                //     vid.style.transform = 'scaleX(-1)';
                //     console.log("ran the event listener");
                // }, false);

                // console.log('mirrored video!');  // debugging
            }
        }
        // execute the script in the browser with executeScript
        executeScript({
            target: { tabId: await getActiveTabId(),
                allFrames: true },
                func: doMirrorVideo,
            })
            
    // otherwise, unmirror the video
    } else {    // mirrorBox.value === 'off'
        mirrorBox.value = 'off';
        browserStorage.set({ mirrorBox: 'off' });
        // alert('mirror now off');  // debugging
        
        let undoMirrorVideo = () => {
            var vid = document.querySelector('video');
            if (vid) {
                vid.style.transform = 'scaleX(1)';
                // console.log('unmirrored video!');  // debugging
            }
        }
        executeScript({
            target: { tabId: await getActiveTabId(),
            allFrames: true },
            func: undoMirrorVideo,
        })
    }
}

/* syncing the speed slider and number */
function onSpeedChange(event) {
    let newSpeed = event.target.value;

    if (newSpeed > MAX_SPEED) {
        newSpeed = MAX_SPEED;
    } else if (newSpeed < MIN_SPEED) {
        newSpeed = MIN_SPEED;
    }

    speedSlider.value = newSpeed;
    speedNum.value = newSpeed;
    changeSpeed(newSpeed);
}

/* executes script assuming no iframes */
async function changeSpeed(newSpeed) {
    browserStorage.set({ speed: newSpeed });

    let speedCode = (newSpeed) => {
        var vid = document.querySelector('video');
        if (vid) {
            vid.playbackRate = newSpeed;
            // console.log('Changed video speed!', newSpeed);  // debugging
        }
    }
    // execute the script in the browser with executeScript
    executeScript({
        target: { tabId: await getActiveTabId(),
        allFrames: true },
        func: speedCode,
        args: [newSpeed],
    })
}

/* to execute the scripts on the active tab only */
async function getActiveTabId() {
    const tabs = await browser.tabs.query({ active: true });
    const tab = tabs[0];
    if (tab) {
        return tab.id;
    }
    return undefined;
}
