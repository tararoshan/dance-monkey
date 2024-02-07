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
		// document.getElementById("loop-div").style.display = ;

		// Wait until all of the boxes have some input
		// if (
		// 	minStartElem.value == null ||
		// 	secStartElem.value == null ||
		// 	minEndElem.value == null ||
		// 	secEndElem.value == null
		// ) {
			// 	debugMessage("some element is null...");
			// 	setTimeout(waitingWhileLoop, 5_000);
			// } else {
		// Check that the input is valid
		// var loopStart = minStartElem * SECONDS_PER_MIN + secStartElem;
		// var loopStop = minEndElem * SECONDS_PER_MIN + secEndElem;
		// var playbackSpeed = 5;

		var newSpeed = 0.5;
		// let speedCode = `var vid = document.querySelector('video');\n vid.playbackRate = ${newSpeed};`;
		// browser.tabs.executeScript({
		// 	code: speedCode,
		// });

		browser.scripting.executeScript({
			args: [ newSpeed ],
			func: (newSpeed) => {
				var vid = document.querySelector('video');
				vid.playbackRate = newSpeed;
				console.log("test")
			},
			target: {
				tabId: await getActiveTabId(),
				allFrames: true,
			},
		});
		
		// Set up the video section looping (browser script)
		// browser.scripting.executeScript({
		// 	func: () => {
		// 		console.log("test1")
		// 		var vid = document.querySelector("video");
		// 		vid.playbackRate = playbackSpeed;
		// 		console.log("test2")
		// 		if (!vid) {
		// 			debugMessage(
		// 				"couldn't find video in loopVideoListener function"
		// 			);
		// 		} else {
		// 			console.log("found video, adding timeupdate listener")
		// 			let vidDuration = vid.duration;
		// 			loopStop = loopStop < vidDuration ? loopStop : vidDuration;
		// 			console.log(`start time: ${loopStart}, stop time: ${loopStop}`)

		// 			vid.addEventListener(
		// 				"timeupdate",
		// 				loopVideoListener(vid.duration)
		// 			);
		// 		}
		// 	},
		// 	target: {
		// 		tabId: await getActiveTabId(),
		// 		allFrames: true,
		// 	},
		// });

		// can do messaging if this doesn't work
	} else {
		// if not checked, make the minute/seconds numbers hidden
		document.getElementById("loop-div").style.opacity = 0;
		// Remove the looping
		// vid.removeEventListener("timeupdate", loopVideoListener);
	}
}

/**
 * HELPER FUNCTIONS, CONTENT SCRIPTS
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
		debugMessage("couldn't find video in mirrorVideo function");
	}
	vid.style.transform = "scaleX(-1)";
}

function unmirrorVideoBrowserScript() {
	var vid = document.querySelector("video");
	if (!vid) {
		debugMessage("couldn't find video in unmirrorVideo function");
	}
	vid.style.transform = "";
}

function loopVideoBrowserScript() {
	var vid = document.querySelector("video");
	if (!vid) {
		debugMessage("couldn't find video in loopVideoListener function");
	} else {
		vid.addEventListener(
			"timeupdate",
			loopVideoListener(vid.duration)
		);
	}
}

// function loopVideoListener(vidDuration) {
// 	debugMessage("the this object: ", this);
// 	loopStop = loopStop < vidDuration ? loopStop : vidDuration;
// 	debugMessage(`loop start ${loopStart}, loop stop: ${loopStop}, duration: ${vidDuration}`)

// 	debugMessage(`max speed: ${MAX_SPEED}`)

// 	if (this.currentTime >= loopStop || this.currentTime < loopStart) {
// 		this.currentTime = loopStart;
// 		debugMessage(`updated time to ${this.currentTime}`);
// 	} else {
// 		debugMessage("no time update!");
// 	}
// }
