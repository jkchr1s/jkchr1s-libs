'use strict'

/**
 * Maps getters and setters to a Vue component. This goes in the computed section of your component
 * @param fields {Array|Object}
 * @returns {Object}
 */
export function mapFields (fields) {
  let computed = {}
  const appendToComputed = o => {
    computed[o] = {
      get () {
        return this.$store.getters[o]
      },
      set (value) {
        this.$store.commit(o, value)
      }
    }
  }

  if (Array.isArray(fields)) {
    fields.forEach(o => appendToComputed(o))
  } else if (typeof fields === 'object') {
    Object.keys(fields).forEach(o => appendToComputed(o))
  }

  return computed
}

/**
 * Normalizes Vue classes into an object. Accepts
 * @param classes {String|Array|Object}
 * @param [defaults] {String|Array|Object}
 * @returns {Object}
 */
export function makeClassObject (classes, defaults) {
  let classObj = {}

  if (typeof classes === 'string') {
    classes.split(' ').forEach(className => {
      classObj[className] = true
    })
  } else if (Array.isArray(classes)) {
    classes.forEach(className => {
      classObj[className] = true
    })
  } else if (typeof classes === 'function') {
    return makeClassObject(classes())
  } else if (typeof classes === 'object') {
    classObj = Object.assign(classObj, classes)
  } else if (classes) {
    // unknown
  }

  if (defaults) {
    const defaultValues = makeClassObject(defaults)
    Object.keys(defaultValues).forEach(key => {
      classObj[key] = defaultValues[key]
    })
  }

  return classObj
}


/**
 * Creates Vuex getters for a given initial state
 * @param stateObj {Object}
 * @returns {Object}
 */
export function makeVuexGettersForState (stateObj) {
  let getters = {}
  Object.keys(stateObj).forEach(key => {
    getters[key] = state => state[key]
  })
  return getters
}

/**
 * Creates Vuex mutations for a given initial state
 * If an item is an array, it also produces mutations for {key}ArrClear to empty the array
 * and {key}ArrPush to append an element on the array
 * @param stateObj {Object}
 * @returns {Object}
 */
export function makeVuexMutationsForState (stateObj) {
  let mutations = {}
  Object.keys(stateObj).forEach(key => {
    mutations[key] = (state, payload) => {
      state[key] = payload
    }
    if (Array.isArray(stateObj[key])) {
      mutations[`${key}ArrClear`] = state => {
        state[key].splice(0)
      }
      mutations[`${key}ArrPush`] = (state, payload) => {
        state[key].push(payload)
      }
    }
  })
  return mutations
}
