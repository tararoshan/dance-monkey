try {
    browser
} catch (e) {
    browser = chrome
}

const MAX_SPEED = 2;
const MIN_SPEED = 0.1;

const browserStorage = browser.storage.local
const executeScript = (browser.tabs.executeScript ?? browser.scripting.executeScript)

/* initialise variables */
var mirrorBox = document.getElementById('mirror');
var speedSlider = document.getElementById('speed-range');
var speedNum = document.getElementById('speed-num');
var loopBox = document.getElementById('loop');

/*  add event listeners to inputs */
mirrorBox.addEventListener('change', mirrorFunc);
speedSlider.addEventListener('change', onSpeedChange);
speedNum.addEventListener('change', onSpeedChange);
loopBox.addEventListener('change', loop);

/* generic error handler */
function onError(error) {
    console.log(error);
}

/* display previously-set options on startup */
initialize();

async function initialize() {
    const state = await browserStorage.get()
    // mirror
    mirrorBox.value = state.mirrorBox
    mirrorBox.checked = mirrorBox.value === 'on' ? true : false;
    // speed
    speedSlider.value = state.speed
    speedNum.value = state.speed
}

/* mirror button function */
async function mirrorFunc() {
    if (mirrorBox.value === 'on') {
        // if the video is mirrored, unmirror it
        mirrorBox.value = 'off';
        browserStorage.set({ mirrorBox: 'off' });
        alert('mirror now off');
        // run script
    } else if (mirrorBox.value === 'off') {
        // otherwise, mirror the video
        mirrorBox.value = 'on';
        browserStorage.set({ mirrorBox: 'on' });
        alert('mirror now on');
        executeScript({
            target: { tabId: await getActiveTabId(), allFrames: true },
            file: `/mirror.js`, allFrames: true
        });
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

// executes script assuming no iframes
async function changeSpeed(newSpeed) {
    browserStorage.set({ speed: newSpeed });
    console.log('new speed', newSpeed)

    let speedCode = (newSpeed) => {
        var vid = document.querySelector('video');
        if (vid) {
            vid.playbackRate = newSpeed;
            console.log('Changed video speed!', newSpeed)
        }
    }
    executeScript({
        target: { tabId: await getActiveTabId(), allFrames: true },
        func: speedCode,
        args: [newSpeed],
    })
}

async function getActiveTabId() {
    const tabs = await browser.tabs.query({ active: true })
    const tab = tabs[0]
    if (tab) {
        return tab.id
    }
    return undefined
}

/* loop */
// function loop() {
//     if (loopBox.value === 'on') {
//         // if the video is looped, unloop it
//         loopBox.value = 'off';
//         localStorage.setItem('loopBox', 'off');
//         alert('loop now off');
//     } else if (loopBox.value === 'off') {
//         // otherwise, loop the video
//         loopBox.value = 'on';
//         localStorage.setItem('loopBox', 'on');
//         alert('loop now on');
//     }
// }
// // if time goes over the ending min/sec, set it to starting time/sec
// // if below starting time/sec, set it to starting time/sec
// // set max time/sec values for input to corresponding max for video
// let durationCode = `var vid = document.querySelector('video');\n vid.duration;`

// browser.tabs.executeScript({
//     code: durationCode
// }, setMaxTime)

// function setMaxTime(resultsArray) {
//     alert(resultsArray[0]);
// }

// // delay
// function delay(timeout) {
//     // remove the hourglass button
//     // delayButton.style = 
//     let timeoutCode = `var vid = document.querySelector('video); vid.pause(); setTimeout(() => {vid.play()}, ${timeout} * 1000);`
// }