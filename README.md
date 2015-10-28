customjs
========

[Custom JavaScript for websites - Chrome Extension](https://chrome.google.com/webstore/detail/custom-javascript-for-web/poakhlngfciodnhlhhgnaaelnpjljija)

Run custom JavaScript on any website.
Use this tool to inject custom javascript in any website.

Your scripts are kept in the local storage and applied across domain URLs.

You can use jQuery 1.11.x or 2.1.x or your own external scripts.

Use cases:
- site debugging (wrong list sort, etc.)
- hiding annoyng popups and Ads
- custom UI
- anything you can think of :)

New features:
- Ace Editor (formating, highlight, undo/redo by hotkeys)
- Draft auto save (so doesn't matter when you close the window without saving)
- Hosts (websites) switch (you can browse customjs of other websites)
- Include external script (eq. Underscore.js is cool)

Thanks to:
- Ace - http://ace.c9.io/
- Pure - http://purecss.io/

# base.js
It provides useful functions for you.
Now there're only one function:
```javascript
customjsReady('.nav', function(element) {
  // do something
});
```

The `customjsReady` wiil be called when an element matching the selector
is added to the DOM. You can find more details from:
http://ryanmorr.com/using-mutation-observers-to-watch-for-element-availability/

Special thanks to [Ryan Morr](http://ryanmorr.com/)

# Why Custom JavaScript for Websites 2
Since the author haven't update original extension for almost one year.
Its website http://hromadadan.com is also unavailable.
I can not find the author.

But the sync feature is urgent. So this repos is here.
