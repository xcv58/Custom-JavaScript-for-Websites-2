# Custom JavaScript for websites

[![CircleCI](https://circleci.com/gh/xcv58/Custom-JavaScript-for-Websites-2.svg?style=svg)](https://circleci.com/gh/xcv58/Custom-JavaScript-for-Websites-2)
[![Build Status](https://travis-ci.org/xcv58/Custom-JavaScript-for-Websites-2.svg?branch=master)](https://travis-ci.org/xcv58/Custom-JavaScript-for-Websites-2)
[![dependencies Status](https://david-dm.org/xcv58/Custom-JavaScript-for-Websites-2/status.svg)](https://david-dm.org/xcv58/Custom-JavaScript-for-Websites-2)
[![devDependencies Status](https://david-dm.org/xcv58/Custom-JavaScript-for-Websites-2/dev-status.svg)](https://david-dm.org/xcv58/Custom-JavaScript-for-Websites-2?type=dev)

[![Maintainability](https://api.codeclimate.com/v1/badges/92a8617dc60beef87408/maintainability)](https://codeclimate.com/github/xcv58/Custom-JavaScript-for-Websites-2/maintainability)
[![DeepScan Grade](https://deepscan.io/api/projects/737/branches/1388/badge/grade.svg)](https://deepscan.io/dashboard/#view=project&pid=737&bid=1388)

[![JavaScript Style Guide](https://cdn.rawgit.com/standard/standard/master/badge.svg)](https://github.com/standard/standard)


[Custom JavaScript for Websites 2 - Chrome Extension](https://xcv58.xyz/inject-js)

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
You can find `base.js` at `extension/lib/base.js`.
It provides useful functions for you. You can directly use all functions in your
JavaScript code. To avoid name conflict, all functions start with `customjs`.

Now there're only one function:

## `customjsReady`
```javascript
customjsReady('.nav', function(element) {
  // do something
});
```

The `customjsReady` wiil be called when an element matching the selector
is added to the DOM. You can find more details from:
http://ryanmorr.com/using-mutation-observers-to-watch-for-element-availability/

Special thanks to [Ryan Morr](http://ryanmorr.com/)

## How do I inject large JavaScript

You can host the JS code in public accessible url and dynamically load and eval it. A sample implementation like this:

```
customjsReady('body', function(element) {
  fetch('https://gist.githubusercontent.com/xcv58/5aaeda690ace2f468d51dbf9c65a3980/raw/a8b1c59223892fb2be08490b00c84fa4a029bb8e/test.js')
    .then((res) => res.text())
    .then((js) => {
      console.log('works in fetch', js)
      eval(js);
    })
});
```

# Why Custom JavaScript for Websites 2
Since the author haven't update original extension for almost one year.
Its website http://hromadadan.com is also unavailable.
I can not find the author.

But the sync feature is urgent. So this repos is here.

You can download older versions from: https://crx.dam.io/ext/ddbjnfjiigjmcpcpkmhogomapikjbjdk.html
