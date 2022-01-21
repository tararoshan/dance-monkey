alert('trying to mirror right now!!');


alert('checking for video')
var vid = document.querySelector('video');

alert('got the video')
vid.currentTime = 9;
setTimeout(() => {vid.style.transform = 'scaleX(-1)'}, 1300)
alert('finished mirroring')

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