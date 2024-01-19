var vid = document.querySelector('video');
if (vid) {
    console.log("found video")
    // TODO wait until the video has finished loading
    // or consistently keep mirroring it on changes

    // var vid = document.querySelector('video');
    vid.style.transform = 'scaleX(-1)';
    console.log("video was mirrored")
    // vid.addEventListener('loadeddata', function() {
    //     // Video is loaded and can be played
    //     vid.style.transform = 'scaleX(-1)';
    //     console.log("ran the event listener");
    // }, false);

    // console.log('mirrored video!');  // debugging
}


// } else {    // mirrorCheckbox.value === 'off'
//     mirrorCheckbox.value = 'off';
//     // browserStorage.set({ mirrorCheckbox: 'off' });
//     // alert('mirror now off');  // debugging
    
//     let undoMirrorVideo = () => {
//         var vid = document.querySelector('video');
//         if (vid) {
//             vid.style.transform = 'scaleX(1)';
//             // console.log('unmirrored video!');  // debugging
//         }
//     }
//     executeScript({
//         target: { tabId: await getActiveTabId(),
//         allFrames: true },
//         func: undoMirrorVideo,
//     })
// }