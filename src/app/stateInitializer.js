import _ from 'lodash'
import { fromJS, Map } from 'immutable'
import fetch from 'isomorphic-fetch'
import { getItems, setItems } from '../utils/localStorage'

const defaultInitialStateProps = {
  currentUser: 'global.currentUser',
  tokens: 'global.tokens'
}

export function loadInitialState (opts) {
  const stateProps = Object.assign({}, defaultInitialStateProps, opts.customProps || {})

  return loadInitialStateFromLocalStorage(stateProps)
    .then((initialState) => {
      if (initialState) {
        return initialState
      } else {
        return loadInitialStateFromServer(opts.url, stateProps)
      }
    })
}

function loadInitialStateFromLocalStorage (stateProps) {
  const keys = Object.keys(stateProps)

  return getItems(keys)
    .then((data) => {
      if (hasAllData(keys, data)) {
        return createInitialState(stateProps, data)
      } else {
        return undefined
      }
    })
}

function hasAllData (keys, data) {
  for (let i = 0; i < keys.length; i++) {
    const value = data[keys[i]]
    if (_.isUndefined(value) || _.isNull(value)) {
      return false
    }
  }

  return true
}

function createInitialState (stateProps, data) {
  let initialState = new Map()

  Object.keys(stateProps).forEach((key) => {
    const path = stateProps[key].split('.')
    initialState = initialState.setIn(path, data[key])
  })

  return initialState.toJS()
}

function loadInitialStateFromServer (url, stateProps) {
  return fetch(url, { credentials: 'same-origin' })
    .then((res) => res.json())
    .then((response) => {
      if (response.success !== true) {
        return undefined
      }

      const initialState = fromJS(response.result)

      const items = {}

      Object.keys(stateProps).forEach((key) => {
        const path = stateProps[key].split('.')
        const value = initialState.getIn(path)
        items[key] = value.toJS ? value.toJS() : value
      })

      return setItems(items)
        .then(() => { return response.result })
    })
}
