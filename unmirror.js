alert('POG!! trying to unmirror right now!!')

var vid = document.querySelector('video')
if (vid != null) {
    vid.style.transform = 'scaleX(1)'
    console.log('video', vid, vid.style.transform)
} else {
    var frame = document.querySelector('iframe')
    frame.style.transform = 'scaleX(1)'
}

alert('finished unmirroring.')