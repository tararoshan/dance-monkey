# Dance Monkey
A Chrome/Firefox extension to help with learning dances from YouTube videos. The name comes from "code monkey" but for dancing (dance monkeys just follow what the dancer on the screen does, code monkeys just code what their boss tells them to code).

Note: To reset the extension options config, click on the Dance Monkey icon (the person dancing). It should reset the video on the current tab and clear the extension.

Figma design file: [link](https://www.figma.com/file/tIFpsQBEdYRqMR03bvkYrz/dance-monkey?type=design&node-id=0%3A1&mode=design&t=WpDWxXPhiKGkoPqq-1)

All of the beautiful icons are actually emojis from [OpenMoji](https://openmoji.org/)!

## Manual Testing in Firefox
Clone the repository, open Firefox > Add-ons Manager > Extensions >
gear/settings button > **Debug Add-ons** > Load Temporary Add-on... > select the
manifest.json file of Dance Monkey. Click "Inspect" on the loaded extention
block to view console messages, etc.

## Manifest V3 Notes
Because of the `activeTab` permission, I originally added
```json
"host_permissions": [
    "*://*.youtube.com/*",
    "*://*.youtube-nocookie.com/*",
    "<all_urls>"
],
```
But users have to manually enable permissions for the extension to run on those
sites. I think that's too much work for the user, so I'm using the `tabs`
permission instead.

## Known Issues
### DuckDuckGo Videos
DDG shows videos in nested frames, which are difficult to find in the
Document-Object Model. I may pick this up later, but from asking around, most
dancers don't care about this.

## Things I Learned
- There's a standard for adding in-line documentation for JavaScript, called
[JSDoc](https://jsdoc.app/)
- [Scripting Web API](https://developer.chrome.com/docs/extensions/reference/api/scripting#runtime-functions)
- Use `<link>` instead of `@import` for loading fonts. `@import` waits until the
style file has been fetched before rendering, so it takes more time to show.
- CSS is *so much easier* to understand by **inspecting the browser**
- I found a [wonderful reference to CSS flexbox](https://www.joshwcomeau.com/css/interactive-guide-to-flexbox/)
- Loading a script pauses the parsing of HTML, so [adding an async or defer](https://www.growingwiththeweb.com/2014/02/async-vs-defer-attributes.html)
tag can help with the loading
- It's [not recommended to inline event handlers](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#inline_event_handlers_%E2%80%94_dont_use_these)
