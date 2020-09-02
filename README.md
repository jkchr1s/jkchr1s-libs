# jkchr1s front-end libraries

This package includes helper functions for common JavaScript front-end scenarios.

## VanillaLib

A collection of helper functions for vanilla JavaScript/DOM manipulation with the intent of _not_ needing jQuery.

| Function | Purpose |
|----------|---------|
| `appendClasses` | Appends a single or multiple classes to a DOM Element |
| `documentReady` | Vanilla equivalent to jQuery's `$(document).ready()` |
| `emit` | Emits a CustomEvent payload to a DOM Element |
| `emitGlobal` | Emits a CustomEvent payload to the document element |
| `escapeRegexString` | Escapes a string to be used in a regular expression |
| `forEachNode` | Iterates over a query selector, NodeList, or a single Node and executes the specified callback |
| `getClasses` | Gets an array of class names assigned to a DOM element |
| `getDataJson` | Gets a JavaScript object value from an element data attribute |
| `getTrueOffsetTop` | Calculates the true offset top of a DOM Element, walking the DOM up to the root node |
| `isIE11` | Determines whether or not we are running under Internet Explorer 11 |
| `isIosDevice` | Determines whether or not we are running under an iOS or iPadOS device |
| `makeEl` | Creates a DOM Element using an object to set attributes and/or inner HTML |
| `makeEvent` | Creates a `CustomEvent` and polyfills browsers that do not support using `new window.CustomEvent` |
| `loadCss` | Returns a Promise that resolves after loading an externally hosted CSS asset |
| `loadScript` | Returns a Promise that resolves after loading an externally hosted JS asset. Accepts a callback that determines whether or not the script has been loaded. |
| `removeClasses` | Removes one or more classes from a DOM Element |
| `setDataJson` | Sets a JavaScript object value on an element data attribute after first base64 encoding the JSON |
| `uppercaseFirst` | Capitalizes the first letter of a string |
| `watchArray` | Modifies an array's prototype to gain access to hooks for methods performed on the array. |


## VueLib

A collection of Vue and Vuex helper functions.

| Function | Purpose |
|----------|---------|
| `mapFields` | Similar to Vuex's `mapGetters`, but maps getters and mutations for a 2-way binding |
| `makeClassObject` | Normalizes classes represented as strings, arrays, or objects into an object |
| `makeVuexGettersForState` | Creates Vuex getters for all keys in the given initial state object |
| `makeVuexMutationsForState` | Creates Vuex mutations for all keys in the given initial state object. If the key is an array, it also creates _key_ArrPush to push an element from the array and _key_ArrClear to clear the array. |


# Additional information
For additional information about using these tools, please see the associated JSDoc comments.
