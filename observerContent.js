// observerContent.js -- CONTENT SCRIPT

/**
 * Here's a basic overview of what's going on:
 * 1. I set up a global MutationObserver with a predefined callback
 * 2. Every time a message is sent from the background script to this content
 * script, loop at the message.
 *      i) if the message is "true", start observing the video on the page and
 *          keep it mirrored.
 *      ii) if the message is "false", disconnect the observer.
 * 
 * I could have set up all of this in the mirrorContentScript function, but I
 * didn't want to create multiple MutationObservers. I was worried that
 * would impact response time and memory.
 */
console.log("[DM] Observer content script now running.");

// Define browser (in case the extension is running in Chrome, not Firefox)
var browser = chrome || browser;

/**
 * Value of the intervalID returned from the most recent call to setInterval().
 * This value is updated when a new loop session is requested by the user. By
 * storing the value, we can clear out the previous loop (if was running) so
 * that loopVideoCSIntervalHandler is only called by at most one interval at any
 * given time.
 *  
 * Initialized as 0 to indicate that there's no loop running yet. This is shared
 * across _all_ content scripts, including those run within popup.js.
 */
var loopIntervalId = 0;

// Only check when the style of the object (which will be a video) changes
const observerOptions = { attributes: true, attributeFilter: ["style"] };
const observer = new MutationObserver(observerCallback);

// Start observing the video on the page and keep it mirrored
function observerCallback() {
	const vid = document.querySelector("video");
	vid.style.transform = "scaleX(-1)";
}

// Listen to messages coming from the background script
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // If the message is "true", mirror and start observing
    const vid = document.querySelector("video");
    if (message == true) {
        vid.style.transform = "scaleX(-1)";
        observer.observe(vid, observerOptions);
    } else {
        // Otherwise (message is "false"), unmirror and disconnect the observer
        observer.disconnect();
        vid.style.transform = "";
    }
});
