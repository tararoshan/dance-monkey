
// mirroring the video/frame
var button = document.getElementById('mirror-button');
button.innerText = button.value;

button.addEventListener('click', function() {
    if (button.value === 'on') {
        // if the video is mirrored, unmirror it
        button.value = 'off';
        browser.tabs.executeScript({file: '/unmirror.js'});
    } else if (button.value === 'off') {
        // otherwise, mirror the video
        button.value = 'on';
        browser.tabs.executeScript({file: '/main.js'})
        browser.tabs.executeScript({file: '/main.js', allFrames: true});
    }
    
    button.innerText = button.value;
})

// document.getElementById("video").addEventListener('timeupdate', function() {
//     document.getElementById("timer").innerHTML = this.currentTime;
//     currentTime = this.currentTime;
// });