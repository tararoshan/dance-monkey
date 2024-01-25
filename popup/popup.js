/* popup.js 
TODO:
 - clear storage after changing the page
 - store values when the popup closes
 - create debugging log function controlled by global variable
*/

/** 
 * CONSTANTS
 */
const MAX_SPEED = 10;
const MIN_SPEED = 0.1;

console.log("RUNNING EXTENSION CODE!!!!!!!!!")
// Previously had these lines, not sure if the ex
// if (!('browser' in window)) {
//     window.browser = chrome;
// }

// Grab the input elements/items from the extension page
var mirrorCheckbox = document.getElementById('mirror-checkbox');
var speedSlider = document.getElementById('speed-range');
// var speedNum = document.getElementById('speed-num');
var loopCheckbox = document.getElementById('loop-checkbox');
// Check when inputs change using event listeners
mirrorCheckbox.addEventListener('change', onMirrorChange);
speedSlider.addEventListener('change', onSpeedChange);
// speedNum.addEventListener('change', onSpeedChange);
// loopCheckbox.addEventListener('change', onLoopChange);


// Const for local storage area
// const browserStorage = browser.storage.local;

/* display previously-set options on open (startup) */
// initialize();

/* Retrieves the values for each of the inputs using the
 * local storage (specific to the machine on which the extension
 * was installed).
 * */
// async function initialize() {
//     const storedValues = await browserStorage.get();

//     mirrorCheckbox.value = storedValues.mirrorCheckbox;
//     mirrorCheckbox.checked = mirrorCheckbox.value === 'on' ? true : false;
//     alert(`[storage] mirror checkbox value: ${mirrorCheckbox.value}`);  // debugging

//     speedSlider.value = storedValues.speed;
//     speedNum.value = storedValues.speed;
//     alert(`[storage] (video) speed value: ${speedSlider.value}`);  // debugging
// }

/**
 * HELPER FUNCTIONS
 */

function mirrorVideo() {
    var vid = document.querySelector('video');
    if (vid) {
        vid.style.transform = 'scaleX(-1)';
    }
}

function unmirrorVideo() {
    var vid = document.querySelector('video');
    if (vid) {
        vid.style.transform = '';
    }
}

/* mirror button function */
async function onMirrorChange() {
    console.log("the mirror checkbox was just changed")
    var funcToExecute = null;

    // Un/mirror the video depending on checkbox status
    if (mirrorCheckbox.checked) {
        mirrorCheckbox.value = 'on';
        funcToExecute = mirrorVideo;
        
        console.log("going to run the mirror script")
    } else {
        mirrorCheckbox.value = 'off';
        funcToExecute = unmirrorVideo;
    }

    browser.scripting.executeScript({
        func: funcToExecute,
        target: {
            tabId: await getActiveTabId(),
            allFrames: true
        },
    })
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
    // browserStorage.set({ speed: newSpeed });

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
