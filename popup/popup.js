// popup.js

/**
 * CONSTANTS
 */
const MAX_SPEED = 10;
const MIN_SPEED = 0.1;
const SECONDS_PER_MIN = 60;

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
let minStartElem = document.getElementById("loop-minutes-start-num");
let secStartElem = document.getElementById("loop-seconds-start-num");
let minEndElem = document.getElementById("loop-minutes-end-num");
let secEndElem = document.getElementById("loop-seconds-end-num");

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

		// Wait until all of the boxes have some input
		function waitingWhileLoop() {
			if (minStartElem.value == null || secStartElem.value == null 
					|| minEndElem.value == null || secEndElem.value == null) {
				
				console.log("some element is null...")
				setTimeout(waitingWhileLoop, 5_000);
			}
		}

		// Check that the input is valid
		let loopStart = minStartElem * SECONDS_PER_MIN + secStartElem;
		let loopStop = minEndElem * SECONDS_PER_MIN + secEndElem;

		// Set up the video section looping (browser script)
		browser.scripting.executeScript({
			func: loopVideoBrowserScript(loopStart, loopStop),
			target: {
				tabId: await getActiveTabId(),
				allFrames: true
			}
		})
		
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

function loopVideoListener(loopStart, loopStop, vidDuration) {
	debugMessage("the this object: ", this)
	loopStop = loopStop < vidDuration ? loopStop : vidDuration;

	if (this.currentTime >= loopStop || this.currentTime < loopStart) {
		this.currentTime = loopStart;
		debugMessage(`updated time to ${this.currentTime}`)
	} else {
		debugMessage("no time update!")
	}
}

function loopVideoBrowserScript(loopStart, loopStop) {
	var vid = document.querySelector("video");
	if (!vid) {
		debugMessage("couldn't find video in loopVideoListener function");
	} else {
		vid.addEventListener("timeupdate", 
			loopVideoListener(loopStart, loopStop, vid.duration))
	}
}
