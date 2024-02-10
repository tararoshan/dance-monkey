// popup.js - BACKGROUND SCRIPT

/**
 * CONSTANTS
 */
const MAX_SPEED = 10;
const MIN_SPEED = 0.1;
const SECONDS_PER_MIN = 60;

const SLIDER_INPUT = 0;

const DEGUG = true;
// Specifically for debugging, so I don't have to comment stuff out
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
mirrorCheckbox.addEventListener("click", mirrorListener);

// var speedSlider = document.getElementById("speed-range");
// speedSlider.addEventListener("change", speedListener(0));
// var speedNum = document.getElementById("speed-written");
// speedNum.addEventListener("change", speedListener(1));

var loopIcon = document.getElementById("loop-icon");
loopIcon.addEventListener("change", loopListner);
var loopStartMinsec = document.getElementById("loop-start-minsec");
var loopStopMinsec = document.getElementById("loop-stop-minsec");

var pasteLoopStart = document.getElementById("paste-loop-start");
pasteLoopStart.addEventListener("click", pasteLoopTimeListener);
var pasteLoopStop = document.getElementById("paste-loop-stop");
pasteLoopStop.addEventListener("click", pasteLoopTimeListener);

/**
 * MIRROR VIDEO LISTENER
 */
async function mirrorListener() {
	debugMessage("the mirror checkbox was just changed");
	var funcToExecute = null;

	// Mirror or unmirror the video depending on checkbox status
	if (mirrorCheckbox.checked) {
		funcToExecute = mirrorVideoContentScript;
		debugMessage("going to run the mirror script");
	} else {
		funcToExecute = unmirrorVideoContentScript;
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
 * PLAYBACK SPEED LISTENER
 */
function speedListener(inputNum) {
	if (inputNum == SLIDER_INPUT) {
		// todo
	}
}

/**
 * LOOP VIDEO LISTENER
 */
async function loopListner() {
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
			args: [newSpeed],
			func: (newSpeed) => {
				var vid = document.querySelector("video");
				vid.playbackRate = newSpeed;
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

async function pasteLoopTimeListener(event) {
	// Get current time of video
	let injectionResultFrames = await browser.scripting.executeScript({
		func: () => {
			var vid = document.querySelector("video");
			// alert(`current time: ${vid.currentTime}`)
			return vid.currentTime;
		},
		target: {
			tabId: await getActiveTabId(),
			allFrames: true,
		},
	});

	let currentTime = injectionResultFrames[0].result;
	if (currentTime == null || currentTime == NaN) {
		console.log(
			"[DM] The InjectionResult object didn't have the result in frame 0",
			injectionResultFrames
		);
		return;
	}
	// Change into min:sec format, assuming the video is less than an hour
	let sec = currentTime % 60;
	let min = (currentTime - sec) / 60;
	sec -= sec % 1;  // Get rid of the decimal digits

	if (event.target.id == "paste-loop-start") {
		loopStartMinsec.value = `${min}:${sec < 10 ? '0' + sec : sec}`;
		debugMessage(`ran on the start, ${min}, ${sec}`);
	} else {
		loopStopMinsec.value = `${min}:${sec < 10 ? '0' + sec : sec}`;
		debugMessage("ran on the stop");
	}
}

function delayListener() {
	// todo
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

function mirrorVideoContentScript() {
	var vid = document.querySelector("video");
	if (!vid) {
		debugMessage("couldn't find video in mirrorVideo function");
	}
	vid.style.transform = "scaleX(-1)";
}

function unmirrorVideoContentScript() {
	var vid = document.querySelector("video");
	if (!vid) {
		debugMessage("couldn't find video in unmirrorVideo function");
	}
	vid.style.transform = "";
}

function loopVideoContentScript() {
	var vid = document.querySelector("video");
	if (!vid) {
		debugMessage("couldn't find video in loopVideoListener function");
	} else {
		vid.addEventListener("timeupdate", loopVideoListener(vid.duration));
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
