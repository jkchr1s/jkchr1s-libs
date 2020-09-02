'use strict'

/**
 * Normalize a classList to an array
 * @param classList {String|Array<String>}
 * @returns {Array<String>}
 * @private
 */
function _normalizeClassList (classList) {
  if (typeof classList === 'string') {
    return classList.split(' ')
  } else if (!Array.isArray(classList)) {
    window.console && window.console.warn && window.console.warn('invalid classList', classList)
    return []
  } else {
    return classList
  }
}

/**
 * Gets the data attribute name
 * @param attributeName {String}
 * @return {String}
 * @private
 */
export function _normalizeDataAttributeName (attributeName) {
  return attributeName.match(/^data-/)
    ? attributeName
    : `data-${attributeName}`
}

/**
 * Append classes to an element
 * @param element {Element}
 * @param classList {String|Array<String>}
 */
export function appendClasses (element, classList) {
  let classes = getClasses(element),
    adding = _normalizeClassList(classList)

  // deduplicate
  adding.forEach(className => {
    if (classes.indexOf(className) === -1) {
      classes.push(className)
    }
  })

  return element.setAttribute('class', classes.join(' '))
}

/**
 * Document ready callback function
 * @param callback {Function}
 * @returns {*}
 */
export function documentReady (callback) {
  if (document.readyState === "complete" || (document.readyState !== "loading" && !document.documentElement.doScroll)) {
    return callback()
  } else {
    document.addEventListener('DOMContentLoaded', callback)
  }
}

/**
 * Emits a CustomEvent to the target element
 * @param element {Element|Node}
 * @param eventName {String}
 * @param detail {Object|undefined}
 * @returns {boolean}
 */
export function emit (element, eventName, detail) {
  detail = detail || {}
  window.console && window.console.debug && window.console.debug('emit', element, eventName, detail)
  return element.dispatchEvent(makeEvent(eventName, {detail}))
}

/**
 * Emits a global CustomEvent to the document element
 * @param eventName {String}
 * @param detail {Object|undefined}
 * @returns {boolean}
 */
export function emitGlobal(eventName, detail) {
  return emit(document.documentElement, eventName, detail)
}

/**
 * Escapes a string to be used for regex matching
 * @param str {string}
 * @returns {string}
 */
export function escapeRegexString (str) {
  return str
    .replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
    .replace(/-/g, '\\x2d')
}

/**
 * Iterates over a given querySelector in an IE11-safe manner
 * @param querySelector {String|Node|NodeList}
 * @param callback {Function}
 * @returns {void|*}
 */
export function forEachNode(querySelector, callback) {
  if (typeof querySelector === 'string') {
    querySelector = document.querySelectorAll(querySelector)
  } else if (querySelector instanceof Node) {
    return callback(querySelector)
  }
  return Array.prototype.forEach.call(querySelector, callback)
}

/**
 * Returns an array of classes for an element
 * @param element {Element}
 * @returns {string[]}
 */
export function getClasses (element) {
  return (element.getAttribute('class') || '').split(' ')
}

/**
 * Serializes a data attribute for a given node as JSON
 * @param el {Element}
 * @param attribute {String}
 * @returns {any|null}
 */
export function getDataJson (el, attribute) {
  const attr = _normalizeDataAttributeName(attribute),
    value = el.getAttribute(attr)
  return value
    ? JSON.parse(atob(value))
    : null
}

/**
 * Calculates the true offset top in pixels
 * @param el {Node}
 * @returns {Number}
 */
export function getTrueOffsetTop (el) {
  let top = 0
  while (el) {
    top += el.offsetTop
    el = el.offsetParent
  }
  return top
}

/**
 * Determines whether or not the script is running on IE 11
 * @returns {boolean}
 */
export function isIE11 () {
  return !!window.MSInputMethodContext && !!document.documentMode
}

/**
 * Determines whether or not the script is running on either iOS or iPadOS
 * @returns {boolean}
 */
export function isIosDevice () {
  return (/iPad|iPhone|iPod/.test(navigator.platform)
    || navigator.platform === 'MacIntel'
    && navigator.maxTouchPoints > 1)
    && !window.MSStream;
}

/**
 * Shorthand function to create an HTML element
 * @param tag {String}
 * @param attrs {Object}
 * @returns {Node}
 */
export function makeEl (tag, attrs) {
  let element = document.createElement(tag)
  if (attrs && typeof attrs === 'object') {
    Object.keys(attrs).forEach(attr => {
      if (['body', 'html', 'innerHTML'].indexOf(attr) === -1) {
        element.setAttribute(attr, attrs[attr])
      } else if (attr === 'children') {
        element.appendChild(attrs[attr])
      } else {
        element.innerHTML = attrs[attr]
      }
    })
  }
  return element
}

/**
 * Creates a CustomEvent instance and polyfills if necessary
 * @param eventName {String}
 * @param payload {Object}
 * @returns {CustomEvent}
 */
export function makeEvent (eventName, payload) {
  // see if this is provided by the browser
  if (typeof window.CustomEvent === 'function') {
    return new window.CustomEvent(eventName, payload)
  }

  // you're still here, so we need to polyfill
  payload = payload || {bubbles: false, cancelable: false, detail: null}
  let e = document.createEvent('CustomEvent')
  e.initCustomEvent(eventName, payload.bubbles, payload.cancelable, payload.detail)
  return e
}

/**
 * Loads an external stylesheet
 * @param href {String}
 * @returns {Promise<void>}
 */
export function loadCss(href) {
  return new Promise(resolve => {
    const el = makeEl('link', {
      href,
      rel: 'stylesheet'
    })
    document.head.appendChild(el)
    return resolve()
  })
}

/**
 * Loads an external JavaScript script, then executes verifyFn to determine whether or not
 * the script successfully loads.
 * @param scriptSrc {String}
 * @param verifyFn {Function}
 * @returns {Promise<void>}
 */
export function loadScript(scriptSrc, verifyFn) {
  // determine whether or not this script has already been loaded
  if (verifyFn && verifyFn()) {
    // script already loaded
    return Promise.resolve()
  }

  // create our script tag
  const el = makeEl('script', {
    type: 'text/javascript',
    src: scriptSrc
  })

  // append to end of document
  document.documentElement.appendChild(el)

  // verify if verifyFn is set
  return verifyFn
    ? new Promise(resolve => {
      let verify = setInterval(() => {
        if (verifyFn()) {
          clearInterval(verify)
          return resolve()
        }
      }, 1)
    })
    : Promise.resolve()
}

/**
 * Removes classes from an element
 * @param element {Element}
 * @param classList {String|Array<String>}
 */
export function removeClasses (element, classList) {
  const removing = _normalizeClassList(classList)
  element.setAttribute('class', getClasses(element).filter(c => removing.indexOf(c) === -1).join(' '))
}

/**
 *
 * @param el {Element}
 * @param attribute {String}
 * @param value {*}
 */
export function setDataJson (el, attribute, value) {
  const attr = _normalizeDataAttributeName(attribute)
  el.setAttribute(attr, btoa(JSON.stringify(value)))
}

/**
 * Capitalizes the first letter of a string
 * @param str {string}
 * @returns {string}
 */
export function uppercaseFirst (str) {
  return `${str.charAt(0).toUpperCase()}${str.slice(1)}`
}

/**
 * Modifies an array's prototype so that the array can be watched and you can react to changes
 * @param arr {Array}
 * @param callback {Function}
 * @param bindMethods {Array}
 */
export function watchArray(arr, callback, bindMethods) {
  const listenFor = Array.isArray(bindMethods)
    ? bindMethods
    : ['pop', 'push', 'reverse', 'shift', 'unshift', 'splice', 'sort']
  listenFor.forEach(method => {
    arr[method] = function () {
      const result = Array.prototype[method].apply(arr, arguments)
      callback(arr, method, arguments)
      return result
    }
  })
}
