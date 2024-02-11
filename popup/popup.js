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
 * ADD EVENT LISTENERS TO EXTENSION ELEMENTS
 */
var mirrorCheckbox = document.getElementById("mirror-checkbox");
mirrorCheckbox.addEventListener("click", mirrorHandler);

// var speedSlider = document.getElementById("speed-range");
// speedSlider.addEventListener("change", speedListener(0));
// var speedNum = document.getElementById("speed-written");
// speedNum.addEventListener("change", speedListener(1));

var loopIcon = document.getElementById("loop-icon");
loopIcon.addEventListener("click", loopHandler);
var loopStartMinsec = document.getElementById("loop-start-minsec");
var loopStopMinsec = document.getElementById("loop-stop-minsec");
var loopMessage = document.getElementById("loop-message-box");

var pasteLoopStart = document.getElementById("paste-loop-start");
pasteLoopStart.addEventListener("click", pasteLoopTimeHandler);
var pasteLoopStop = document.getElementById("paste-loop-stop");
pasteLoopStop.addEventListener("click", pasteLoopTimeHandler);

/**
 * MIRROR VIDEO HANDLER
 */
async function mirrorHandler() {
	debugMessage("the mirror checkbox was just changed");
	
	var isMirrorRequest = false;
	// Mirror or unmirror the video depending on checkbox status
	if (mirrorCheckbox.checked) {
		isMirrorRequest = true;
		debugMessage("going to run the mirror script");
	}

	browser.scripting.executeScript({
		args: [isMirrorRequest],
		func: mirrorContentScript,
		target: {
			tabId: await getActiveTabId(),
			allFrames: true,
		},
	});
}

/**
 * PLAYBACK SPEED HANDLER
 */
async function speedHandler(inputNum) {
	if (inputNum == SLIDER_INPUT) {
		// todo
	}
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
}

/**
 * LOOP VIDEO HANDLER
 */
async function loopHandler() {
	debugMessage("loop handler triggered");

	// Get the loop start & stop time
	let loopStartTime = parseInputTime(loopStartMinsec.value);
	let loopStopTime = parseInputTime(loopStopMinsec.value);

	// Check that loop stop is after loop start, show the message otherwise
	if (loopStartTime >= loopStopTime) {
		loopMessage.style.display = "inherit";
		return;
	} else {
		loopMessage.style.display = "none";
	}

	debugMessage(`START: ${loopStartTime}, STOP: ${loopStopTime}`)
	// Add event listener for the video time to loop
	browser.scripting.executeScript({
		args: [loopStartTime, loopStopTime],
		func: loopVideoContentScript,
		target: {
			tabId: await getActiveTabId(),
			allFrames: true,
		},
	});
}

function parseInputTime(inputTimeString) {
	let timeArray = inputTimeString.split(":");
	let timeInSeconds =
		timeArray.length > 1
			? Number(timeArray[0]) * 60 + Number(timeArray[1])
			: Number(timeArray[0]);

	return timeInSeconds;
}


/**
 * CLIPBOARD PASTE CURRENT TIME HANDLER
 */
async function pasteLoopTimeHandler(event) {
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

/**
 * DELAY HANDLER
 */
function delayHandler() {
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

function mirrorContentScript(isMirrorRequest) {
	var vid = document.querySelector("video");
	if (!vid) {
		console.log("[DM] Couldn't find video in mirrorContentScript function");
	} else if (isMirrorRequest) {
		vid.style.transform = "scaleX(-1)";
	} else {
		vid.style.transform = "";
	}
}

function loopVideoContentScript(loopStartTime, loopStopTime) {
	var vid = document.querySelector("video");
	if (!vid) {
		console.log("[DM] Couldn't find video in loopVideoContentScript function");
	} else {
		let vidDuration = vid.duration;
		loopStopTime = loopStopTime < vidDuration ? loopStopTime : vidDuration;
		vid.addEventListener("timeupdate", videoLoopHandler(loopStartTime, loopStopTime));
	}
}

function videoLoopHandler(loopStartTime, loopStopTime) {
	debugMessage("the this object: ", this);
	debugMessage(`loop start ${loopStartTime}, loop stop: ${loopStopTime}`);

	if (loopStopTime <= this.currentTime || this.currentTime < loopStartTime) {
		this.currentTime = loopStartTime;
		debugMessage(`updated time to ${this.currentTime}`);
	} else {
		debugMessage("no time update!");
	}
}
