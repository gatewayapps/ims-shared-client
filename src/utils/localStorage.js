import _ from 'lodash'
import Promise from 'bluebird'
import localForage from 'localforage'

export function getItems (keys) {
  if (!_.isArray(keys) || keys.length === 0) {
    return Promise.resolve({})
  }

  const getPromises = keys.map((key) => {
    return localForage.getItem(key).then((value) => { return { [key]: value } })
  })

  return Promise.all(getPromises)
    .then((values) => { return Object.assign({}, ...values) })
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
    return localForage.setItem(key, items[key])
  })

  return Promise.all(setPromises)
}
