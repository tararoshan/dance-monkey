
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

// couldn't find a video, try to find iframes
var myFrame = document.querySelector('iframe');
myFrame.style.transform = 'scaleX(-1)';