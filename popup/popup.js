// popup.js

/**
 * CONSTANTS
 */
const MAX_SPEED = 10;
const MIN_SPEED = 0.1;

// Specifically for debugging, so I don't have to comment stuff out
const DEGUG = true;
function debugMessage(message) {
	if (DEGUG) {
		console.log(message);
	}
}

debugMessage("RUNNING EXTENSION CODE!!!!!!!!!");

/**
 * ADD LISTENERS TO EXTENSION ELEMENTS
 */
var mirrorCheckbox = document.getElementById("mirror-checkbox");
mirrorCheckbox.addEventListener("change", onMirrorChange);

var speedSlider = document.getElementById("speed-range");
// speedSlider.addEventListener('change', onSpeedChange);

// var speedNum = document.getElementById('speed-num');
// speedNum.addEventListener('change', onSpeedChange);

var loopCheckbox = document.getElementById("loop-checkbox");
loopCheckbox.addEventListener("change", onLoopChange);
var loopMinutesStart = document.getElementById("loop-minutes-start-num");
var loopSecondsStart = document.getElementById("loop-seconds-start-num");
var loopMinutesEnd = document.getElementById("loop-minutes-end-num");
var loopSecondsEnd = document.getElementById("loop-seconds-end-num");

/**
 * MIRROR VIDEO LISTENER
 */
async function onMirrorChange() {
	debugMessage("the mirror checkbox was just changed");
	var funcToExecute = null;

	// Mirror or unmirror the video depending on checkbox status
	if (mirrorCheckbox.checked) {
		funcToExecute = mirrorVideoBrowserScript;
		debugMessage("going to run the mirror script");
	} else {
		funcToExecute = unmirrorVideoBrowserScript;
	}

	browser.scripting.executeScript({
		func: funcToExecute,
		target: {
			tabId: await getActiveTabId(),
			allFrames: true,
		},
	});
}

/**
 * LOOP VIDEO LISTENER
 */
async function onLoopChange() {
	debugMessage("loop checkbox was just changed");

	if (loopCheckbox.checked) {
		document.getElementById("loop-div").style.opacity = 1;
		const SECONDS_PER_MIN = 60;
		debugMessage('number inputs:', 
			document.getElementById("loop-minutes-start-num"), 
			document.getElementById("loop-seconds-start-num"),
			document.getElementById("loop-minutes-end-num"), 
			document.getElementById("loop-seconds-end-num"))

		// TODO figure out the default input (or set it to something?)
		debugMessage(`is input null? ${document.getElementById("loop-minutes-start-num") == null}`)
		// Set up the looping (browser script)
		browser.scripting.executeScript({
			func: loopVideoBrowserScript,
			target: {
				tabId: await getActiveTabId(),
				allFrames: true
			}
		})
		
		let loopStart = document.getElementById("loop-minutes-start-num") 
						* SECONDS_PER_MIN
						+ document.getElementById("loop-seconds-start-num");
		// set to length of video or the loop stop, whichever is less
		let loopStop = document.getElementById("loop-minutes-end-num") 
						* SECONDS_PER_MIN 
						+ document.getElementById("loop-seconds-end-num");
		// change currentTime property
		function loopVideoListener() {
			debugMessage("the this object: ", this)
			if (this.currentTime >= loopStop || this.currentTime < loopStart) {
				vid.currentTime = loopStart;
			}
			debugMessage("updated time")
		}
		// can do messaging if this doesn't work
	} else{
		// if not checked, make the minute/seconds numbers hidden
		document.getElementById("loop-div").style.opacity = 0;
		// Remove the looping
		vid.removeEventListener("timeupdate", loopVideoListener)
	}
}

/**
 * HELPER FUNCTIONS
 */
async function getActiveTabId() {
	const tabs = await browser.tabs.query({ active: true });
	const tab = tabs[0];
	if (tab) {
		return tab.id;
	}
	return undefined;
}

function mirrorVideoBrowserScript() {
	var vid = document.querySelector("video");
	if (!vid) {
		debugMessage("couldn't find video in mirrorVideo function")
	}
	vid.style.transform = "scaleX(-1)";
}

function unmirrorVideoBrowserScript() {
	var vid = document.querySelector("video");
	if (!vid) {
		debugMessage("couldn't find video in unmirrorVideo function")
	}
	vid.style.transform = "";
}

function loopVideoBrowserScript() {
	var vid = document.querySelector("video");
	if (!vid) {
		debugMessage("couldn't find video in loopVideoListener function");
	} else {
		vid.addEventListener("timeupdate", loopVideoListener)
	}
}
