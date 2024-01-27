
# more listeners
// listen to tab URL changes
browser.tabs.onUpdated.addListener(updateActiveTab);

// listen to tab switching
browser.tabs.onActivated.addListener(updateActiveTab);

// listen for window switching
browser.windows.onFocusChanged.addListener(updateActiveTab);

# manifest.json
,

    "content_scripts": [{
        "matches": ["*://*.youtube.com/*", "*://*.duckduckgo.com/*", 
            "*://*.youtube-nocookie.com/*", "*://*.youtube-nocookie.com/*"],
        "all_frames": true,
        "js": ["mirror.js"]
    }]

# main.js

// later rename to mirror.js
console.log('main location: ', window.location);
// alert('starting the main.js script');

// alert('checking');
// var vid = document.querySelector('video');

// if (vid != null) {
//     alert('got video');
//     vid.currentTime = 9; // could be useful for rewinding, etc
//     setTimeout(() => {vid.style.transform = 'scaleX(-1)'}, 1300);
//     alert('currently mirroring');
// } else {
//     alert('couldn\'t find the video');
// }


# UNMIRROR.JS
```
// script for unmirroring a currently mirrored video
alert('POG!! trying to unmirror right now!!');

var vid = document.querySelector('video');
if (vid != null) {
    vid.style.transform = 'scaleX(1)';
    console.log('video', vid, vid.style.transform);
} else {
    var frame = document.querySelector('iframe');
    frame.style.transform = 'scaleX(1)';
}
alert('finished unmirroring.');
```

# for setting the time
```
document.getElementById("video").addEventListener('timeupdate', function() {
    document.getElementById("timer").innerHTML = this.currentTime;
    currentTime = this.currentTime;
});
```

# previous code
```
alert("trying to mirror right now!!")

var timer = undefined
const time = 500

// function debounce(callback) {
//     if (timer) {
//         clearTimeout(timer)
//         timer = setTimeout(() => {
//             callback()
//             timer = undefined
//         }, time)
//         return
//     }

//     callback()
//     timer = setTimeout(() => {
//         timer = undefined
//     }, time)
//     return
// }


// mirrors the video currently playing on the page
alert('gonna mirror')
const invertVideo = () => {
    alert('test run invert')
    console.log('test run invert')
    var vid = document.querySelector('video')
    console.log('video', vid, vid.style.transform)

    // first check to see if the video is playing
    // if it isn't then give an alert
    vid.style.transform = 'scaleX(-1)'
    console.log('video', vid, vid.style.transform)
}
// console.log('START!', document.location, debounce)
// debounce(invertVideo)

// var observer = new MutationObserver(() => {
//     console.log('call debounce on change');
//     debounce(invertVideo);
// });
// observer.observe(document, {
//     subtree: true,
//     childList: true,
// });

// setTimeout(() => {
//     console.log('disconnecting...')
//     observer.disconnect()
// }, 10 * 1000);
invertVideo();

alert("finished mirroring.");
```

# scrap?
```

// copied
// alert('trying to mirror right now!!');
// var vid = document.querySelector('video');

// alert('checking for video')
// if (vid != null && !vid.paused) {
//     // mirrors the video currently playing on the page
//     alert('gonna mirror')
//     const invertVideo = () => {
//         alert('test run invert');
//         console.log('video', vid, vid.style.transform);
        
//         // first check to see if the video is playing
//         // if it isn't then give an alert
//         vid.style.transform = 'scaleX(-1)';
//         console.log('video', vid, vid.style.transform);
//     }
//     invertVideo();
// } else {
//     alert('the dance monkey extension is having trouble finding a video. We\'ll try to mirror ' +
//         'what could be a video, but we can\'t tell. Feel free to turn off the extenstion if that ' +
//         'doesn\'t work and submit a bug report. :)');
//     var frame = document.querySelector('iframe');

//     if (frame != null) {
//         frame.style.transform = 'scaleX(-1)';
//     } else {
//         alert('dance monkey^(tm) can\'t find any video. Make sure you\'re playing the video ' +
//         'on the page or feel free to submit (detailed, please!) a bug report. Thanks!');
//     }
// }

// alert('finished mirroring.');
// // 
```

# TEST.JS
```
alert("got to this part of the if/else but isn't running the second script for some reason?");

// copied
alert("trying to mirror right now!!");

var timer = undefined;
const time = 500;

// function debounce(callback) {
//     if (timer) {
//         clearTimeout(timer)
//         timer = setTimeout(() => {
//             callback()
//             timer = undefined
//         }, time)
//         return
//     }

//     callback()
//     timer = setTimeout(() => {
//         timer = undefined
//     }, time)
//     return
// }


// mirrors the video currently playing on the page
alert('gonna mirror')
const invertVideo = () => {
    alert('test run invert')
    console.log('test run invert')
    var vid = document.querySelector('video')
    console.log('video', vid, vid.style.transform)

    // first check to see if the video is playing
    // if it isn't then give an alert
    vid.style.transform = 'scaleX(-1)'
    console.log('video', vid, vid.style.transform)
}
// console.log('START!', document.location, debounce)
// debounce(invertVideo)

// var observer = new MutationObserver(() => {
//     console.log('call debounce on change');
//     debounce(invertVideo);
// });
// observer.observe(document, {
//     subtree: true,
//     childList: true,
// });

// setTimeout(() => {
//     console.log('disconnecting...')
//     observer.disconnect()
// }, 10 * 1000);
invertVideo();

alert("finished mirroring.");
```

# Store in browser
// browserStorage.set({ mirrorCheckbox: 'on' });
// console.log("looking for video")
// var vid = document.querySelector('video');
// if (vid) {
//     console.log("found video")
//     // TODO wait until the video has finished loading
//     // or consistently keep mirroring it on changes

//     // var vid = document.querySelector('video');
//     vid.style.transform = 'scaleX(-1)';
//     console.log("video was mirrored")
//     // vid.addEventListener('loadeddata', function() {
//     //     // Video is loaded and can be played
//     //     vid.style.transform = 'scaleX(-1)';
//     //     console.log("ran the event listener");
//     // }, false);

//     // console.log('mirrored video!');  // debugging
// }
// execute the script in the browser with executeScript
// executeScript({
//     target: { tabId: await getActiveTabId(),
//         allFrames: true },
//         func: doMirrorVideo,
//     })




# More stuff I cut out
// if (!('browser' in window)) {
//     window.browser = chrome;
// }

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