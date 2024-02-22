// popup.js - BACKGROUND SCRIPT
// Note: chrome doesn't debug background scripts properly for manifest v3, see
// https://issues.chromium.org/issues/40805401#comment53

/**
 * CONSTANTS AND GLOBALS
 */
const MAX_SPEED = 10;
const MIN_SPEED = 0.1;
const SECONDS_PER_MIN = 60;
const SLIDER_INPUT = 0;
// Define browser (in case the extension is running in Chrome, not Firefox)
var browser = chrome || browser;
var loopIntervalId = 0;

/**
 * ADD EVENT LISTENERS TO EXTENSION ELEMENTS
 */
var mirrorCheckbox = document.getElementById("mirror-checkbox");
mirrorCheckbox.addEventListener("change", mirrorHandler);

var speedSlider = document.getElementById("speed-range");
speedSlider.addEventListener("change", speedHandler.bind(SLIDER_INPUT));
var speedNumInput = document.getElementById("speed-num");
speedNumInput.addEventListener("change", speedHandler.bind(!SLIDER_INPUT));

var loopIcon = document.getElementById("loop-icon");
loopIcon.addEventListener("click", loopHandler);
var loopStartMinsec = document.getElementById("loop-start-minsec");
var loopStopMinsec = document.getElementById("loop-stop-minsec");
var loopMessage = document.getElementById("loop-message-box");

var pasteLoopStart = document.getElementById("paste-loop-start");
pasteLoopStart.addEventListener("click", pasteLoopTimeHandler);
var pasteLoopStop = document.getElementById("paste-loop-stop");
pasteLoopStop.addEventListener("click", pasteLoopTimeHandler);

var delayIcon = document.getElementById("stopwatch-icon");
delayIcon.addEventListener("click", delayHandler);
var delayNumInput = document.getElementById("delay-num");

// Make the styles on the extension reflect those on the video
loadStylesFromStorage();

/**
 * MIRROR VIDEO HANDLER
 */
async function mirrorHandler() {
	var isMirrorRequest = false;
	var activeTabId = await getActiveTabId();
	// Mirror or unmirror the video depending on checkbox status
	if (mirrorCheckbox.checked) {
		isMirrorRequest = true;
	}

	browser.storage.session.set({ "isMirrorRequest": isMirrorRequest });
	browser.tabs.sendMessage(activeTabId, isMirrorRequest);
}

/**
 * PLAYBACK SPEED HANDLER
 */
async function speedHandler(event) {
	var newSpeed = 1;
	// Decide where to get the new speed from and where to update
	if (this == SLIDER_INPUT) {
		newSpeed = speedSlider.value;
		speedNumInput.value = newSpeed;
	} else {
		newSpeed = speedNumInput.value;
		speedSlider.value = newSpeed;
	}
	browser.storage.session.set({ "newSpeed": newSpeed });

	browser.scripting.executeScript({
		args: [newSpeed],
		func: (newSpeed) => {
			let vid = document.querySelector("video");
			if (vid) vid.playbackRate = newSpeed;
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
	// Save the raw values in storage 
	browser.storage.session.set({ "loopStartMinsec": loopStartMinsec.value });
	browser.storage.session.set({ "loopStopMinsec": loopStopMinsec.value });

	// Get the loop start & stop time in terms of seconds
	let loopStartTime = parseInputTime(loopStartMinsec.value);
	let loopStopTime = parseInputTime(loopStopMinsec.value);
	// Check that loop stop is after loop start, show the message otherwise
	if (loopStartTime >= loopStopTime) {
		loopMessage.style.display = "inherit";
		return;
	} else {
		loopMessage.style.display = "none";
	}

	console.log("about to run loop content script from handler")

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
			let vid = document.querySelector("video");
			if (vid) return vid.currentTime;
			return 0;
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
	sec -= sec % 1; // Get rid of the decimal digits

	if (event.target.id == "paste-loop-start") {
		loopStartMinsec.value = `${min}:${sec < 10 ? "0" + sec : sec}`;
	} else {
		loopStopMinsec.value = `${min}:${sec < 10 ? "0" + sec : sec}`;
	}
}

/**
 * DELAY HANDLER
 */
async function delayHandler() {
	browser.storage.session.set({ "delay": delayNumInput.value });
	if (delayNumInput.value == 0) return;

	browser.scripting.executeScript({
		args: [delayNumInput.value],
		func: (delay) => {
			let vid = document.querySelector("video");
			if (vid) {
				vid.pause();
				setTimeout(() => { vid.play(); }, delay * 1_000);
			}
		},
		target: {
			tabId: await getActiveTabId(),
			allFrames: true,
		},
	});
}

/**
 * HELPER FUNCTIONS, CONTENT SCRIPTS
 */

/**
 * Load values for input elements from session storage. Used to keep the UI
 * of the extension up to date with the scripts that are running on the page.
 * 
 * Related to issue #13.
 */
async function loadStylesFromStorage() {
	let sessionStorage = await browser.storage.session.get();
	// Mirror
	let isMirrorRequest = sessionStorage["isMirrorRequest"] || false;
	mirrorCheckbox.checked = isMirrorRequest;
	// Playback speed
	let newSpeed = sessionStorage["newSpeed"] || 1;
	if (newSpeed != 1) {
		speedNumInput.value = newSpeed;
		speedSlider.value = newSpeed;
	}
	// Loop (store values, loopIntervalId)
	loopIntervalId = sessionStorage["loopIntervalId"] || 0;
	console.log("stored loop interval id: ", loopIntervalId)
	if (sessionStorage["loopStartMinsec"] && sessionStorage["loopStopMinsec"]) {
		loopStartMinsec.value = sessionStorage["loopStartMinsec"];
		loopStopMinsec.value = sessionStorage["loopStopMinsec"];
	}
	// Delay
	delayNumInput.value = sessionStorage["delay"] || 0;
}

/**
 * 
 * @returns tab ID if found, otherwise undefined.
 */
async function getActiveTabId() {
	const tabs = await browser.tabs.query({ active: true });
	const tab = tabs[0];
	if (tab) {
		return tab.id;
	}
	return undefined;
}

/**
 * 
 * @param {*} loopStartTime 
 * @param {*} loopStopTime 
 * @returns 
 */
async function loopVideoContentScript(loopStartTime, loopStopTime) {
	let vid = document.querySelector("video");
	console.log("getting video, vid:", vid)
	if (vid) {
		let vidDuration = vid.duration;
		console.log("got vid dration ", vidDuration)
		loopStopTime = loopStopTime < vidDuration ? loopStopTime : vidDuration;
		console.log("test 0 ", loopStartTime, " ", loopStopTime)
		console.log("interval id", loopIntervalId)
		var loopIntervalId = loopIntervalId ? loopIntervalId : await browser.storage.session.get("loopIntervalId") || 0;
		console.log("test 0.5")
		// Clear the previous loop interval checker, if it existed
		if (loopIntervalId != 0) clearInterval(loopIntervalId);
		// A small optimization: don't loop the whole video from start to end
		console.log("test 1 ")
		if (loopStartTime == 0 && loopStopTime == vidDuration) return;
		// Set up the new interval
		console.log("test 2 ")
		loopIntervalId = setInterval(
			loopVideoCSIntervalHandler,
			1_000,
			vid,
			loopStartTime,
			loopStopTime
		);
		console.log("intervaal id: ", loopIntervalId)
		browser.storage.session.set({ "loopIntervalId": loopIntervalId });
	}
}

/**
 * Called to check the time of the video and adjust it to be within the loop.
 * @param {HTMLVideoElement} vid video to be looped.
 * @param {Number} loopStartTime loop start time (left endpoint).
 * @param {Number} loopStopTimes loop end time (right endpoint).
 */
function loopVideoCSIntervalHandler(vid, loopStartTime, loopStopTime) {
	if (vid && (loopStopTime <= vid.currentTime || vid.currentTime < loopStartTime)) {
		vid.currentTime = loopStartTime;
	}
}
