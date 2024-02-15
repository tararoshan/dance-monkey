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

console.log("running observerContent.js")

// Only check when the style of the object (which will be a video) changes
const observerOptions = { attributes: true, attributeFilter: ["style"] };
const observer = new MutationObserver(observerCallback);

// Start observing the video on the page and keep it mirrored
function observerCallback() {
    console.log("Running observerCallback")
    console.log(this.target)
	const vid = document.querySelector("video");
    // console.log("vid in callback: ", vid)
	vid.style.transform = "scaleX(-1)";
}

console.log("checkpoint")

// Listen to messages coming from the background script
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // if the message is "true", mirror and start observing
    console.log("recived message", message)
    const vid = document.querySelector("video");
    if (message == true) {
        console.log("setting up observer")
        vid.style.transform = "scaleX(-1)";
        observer.observe(vid, observerOptions);
        console.log("observer set up")
    } else {
        // otherwise (message is "false"), unmirror and disconnect the observer
        console.log("disconnecting")
        vid.style.transform = "";
        observer.disconnect();
        console.log("disconnect done")
        vid.style.transform = "";
    }
});
