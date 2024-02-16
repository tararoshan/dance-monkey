// scratchpad.js -- NOTES AND CASSEROLE CODE

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
