/* initialise variables */
var mirrorBox = document.getElementById('mirror');

/*  add event listeners to inputs */
mirrorBox.addEventListener('click', mirrorFunc);

/* generic error handler */
function onError(error) {
    console.log(error);
}

/* display previously-set options on startup */
initialize();

function initialize() {
    if (localStorage.length > 0 ) {
        mirrorBox.value = localStorage.getItem('mirrorBox');
        mirrorBox.checked = mirrorBox.value === 'on' ? true : false;
    }
}

function mirrorFunc() {
    if (mirrorBox.value === 'on') {
        // if the video is mirrored, unmirror it
        mirrorBox.value = 'off';
        localStorage.setItem('mirrorBox', 'off');
        alert('mirror now off');
    } else if (mirrorBox.value === 'off') {
        // otherwise, mirror the video
        mirrorBox.value = 'on';
        localStorage.setItem('mirrorBox', 'on');
        alert('mirror now on');
        // browser.tabs.executeScript({file: `/mirror.js`, allFrames: true});
    }
}
