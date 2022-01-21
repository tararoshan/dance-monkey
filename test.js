alert("got to this part of the if/else but isn't running the second script for some reason?")

// copied
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
