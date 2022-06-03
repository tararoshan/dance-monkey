/* initialise variables */
var mirrorBox = document.getElementById('mirror');
var speedSlider = document.getElementById('speed-range');
var speedNum = document.getElementById('speed-num');
var loopBox = document.getElementById('loop');

/*  add event listeners to inputs */
mirrorBox.addEventListener('change', mirrorFunc);
speedSlider.addEventListener('change', syncFromSlider);
speedNum.addEventListener('change', syncFromNum);
loopBox.addEventListener('change', loop);

/* generic error handler */
function onError(error) {
    console.log(error);
}

/* display previously-set options on startup */
initialize();

function initialize() {
    // mirror
    mirrorBox.value = localStorage.getItem('mirrorBox');
    mirrorBox.checked = mirrorBox.value === 'on' ? true : false;
    // speed
    speedSlider.value = localStorage.getItem('speed');
    speedNum.value = localStorage.getItem('speed');
}

/* mirror button function */
function mirrorFunc() {
    if (mirrorBox.value === 'on') {
        // if the video is mirrored, unmirror it
        mirrorBox.value = 'off';
        localStorage.setItem('mirrorBox', 'off');
        alert('mirror now off');
        // run script
    } else if (mirrorBox.value === 'off') {
        // otherwise, mirror the video
        mirrorBox.value = 'on';
        localStorage.setItem('mirrorBox', 'on');
        alert('mirror now on');
        browser.tabs.executeScript({file: `/mirror.js`, allFrames: true});
    }
}

/* syncing the speed slider and number */
function syncFromSlider() {
    let newSpeed = speedSlider.value;
    speedNum.value = newSpeed;
    changeSpeed(newSpeed);
}

function syncFromNum() {
    let newSpeed = speedNum.value;
    speedSlider.value = newSpeed;
    changeSpeed(newSpeed);
}

// executes script assuming no iframes
function changeSpeed(newSpeed) {
    localStorage.setItem('speed', newSpeed);
    
    let speedCode = `var vid = document.querySelector('video');\n vid.playbackRate = ${newSpeed};`
    browser.tabs.executeScript({
        code: speedCode
    })
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