import _ from 'lodash'
import Promise from 'bluebird'
import localForage from 'localforage'

export default {
  getItem,
  getItems,
  removeItem,
  removeItems,
  setItem,
  setItems
}

export function getItem (key) {
  return localForage.getItem(key)
}

export function getItems (keys) {
  if (!_.isArray(keys) || keys.length === 0) {
    return Promise.resolve({})
  }

  const getPromises = keys.map((key) => {
    return getItem(key).then((value) => { return { [key]: value } })
  })

  return Promise.all(getPromises)
    .then((values) => { return Object.assign({}, ...values) })
}

export function setItem (key, value) {
  return localForage.setItem(key, value)
}

export function setItems (items) {
  if (!_.isObjectLike(items)) {
    throw new TypeError('items should be an object')
  }

  const keys = Object.keys(items)

  if (keys.length === 0) {
    return Promise.resolve()
  }

  const setPromises = keys.map((key) => {
    return setItem(key, items[key])
  })

  return Promise.all(setPromises)
}

export function removeItem (key) {
  return localForage.removeItem(key)
}

export function removeItems (keys) {
  if (!_.isArray(keys)) {
    throw new TypeError('keys should be an array')
  }

  if (keys.length === 0) {
    return Promise.resolve()
  }

  const removePromises = keys.map((key) => {
    return removeItem(key)
  })

  return Promise.all(removePromises)
}
