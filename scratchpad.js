/**
 * MUTATIONOBSERVER
 */
// For running only in the browser:
function observerCallback() {
	console.log("Running callback.")
	const vid = document.querySelector("video");
	vid.style.transform = "scaleX(-1)";
}

const vid = document.querySelector("video");
const observerOptions = { attributes: true, attributeFilter: ["style"] };
const observer = new MutationObserver(observerCallback);
observer.observe(vid, observerOptions);
observer.disconnect();

// But I think it needs messaging so that new MutationObserver objects
// aren't created every single time the extension is clicked

/**
 * LISTEN TO BROWSER ACTIONS
 */
// listen to tab URL changes
browser.tabs.onUpdated.addListener(updateActiveTab);
// listen to tab switching
browser.tabs.onActivated.addListener(updateActiveTab);
// listen for window switching
browser.windows.onFocusChanged.addListener(updateActiveTab);

/**
 * IFRAMES
 */
// couldn't find a video, try to find iframes
var myFrame = document.querySelector('iframe');

/**
 * DEBOUNCE FUNCTION
 */
function debounce(callback) {
    if (timer) {
        clearTimeout(timer)
        timer = setTimeout(() => {
            callback()
            timer = undefined
        }, time)
        return
    }

    callback()
    timer = setTimeout(() => {
        timer = undefined
    }, time)
    return
}

/**
 * BROWSER STORAGE
 */
const browserStorage = browser.storage.local;
browserStorage.set({ mirrorCheckbox: 'on' });
initialize();
const storedValues = await browserStorage.get();
