alert(window.location);
var vid = document.querySelector('video');

if (vid != null) {
    // found a video to mirror
    vid.style.transform = 'scaleX(-1)';
} else {
    // couldn't find a video, try to find iframes
    var myFrame = document.querySelector('iframe');
    myFrame.style.transform = 'scaleX(-1)';
}

/* TODO
 * -add reset & refresh instructions
 * -let ppl know about iframe-related issues
 *  
 * */