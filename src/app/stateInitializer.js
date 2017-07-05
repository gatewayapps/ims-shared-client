import _ from 'lodash'
import fetch from 'isomorphic-fetch'
import { getItem, getItems, setItem, setItems } from '../utils/localStorage'
import { makeRefreshAccessTokenRequest, parseResponse } from '../utils/request'
import { createSecurityState } from './modules/security'

export const INITIAL_STATE_STORAGE_KEY = 'IMS-initialState'
export const SECURITY_STORAGE_KEY = 'IMS-security'

export function loadInitialState (opts) {
  return loadInitialStateFromLocalStorage()
    .then((initialState) => {
      if (initialState) {
        return { fromLocalStorage: true, initialState: initialState }
      } else {
        return loadInitialStateFromServer(opts.url)
          .then((initialState) => {
            return { fromLocalStorage: false, initialState: initialState }
          })
      }
    })
}

function loadInitialStateFromLocalStorage () {
  return getItems([ INITIAL_STATE_STORAGE_KEY, SECURITY_STORAGE_KEY ])
    .then((storageData) => {
      if (_.isObjectLike(storageData) && _.isObjectLike(storageData[INITIAL_STATE_STORAGE_KEY])) {
        const initialState = Object.assign({}, storageData[INITIAL_STATE_STORAGE_KEY], {
          security: storageData[SECURITY_STORAGE_KEY] || {}
        })
        return initialState
      } else {
        return undefined
      }
    })
}

export function loadInitialStateFromServer (url) {
  return fetchInitialStateFromServer(url)
    .then((serverResponse) => {
      if (serverResponse.success !== true || !_.isObjectLike(serverResponse.result) || _.keys(serverResponse.result).length === 0) {
        return undefined
      }

      return getItem(SECURITY_STORAGE_KEY)
        .then((securityObj) => {
          if (!_.isObjectLike(securityObj) || !_.isObjectLike(securityObj.currentUser)) {
            return makeRefreshAccessTokenRequest()
              .then((securityResponse) => {
                let security

                if (securityResponse.success === true) {
                  security = createSecurityState(securityResponse.accessToken, securityResponse.expires)
                }

                const storageData = {
                  [INITIAL_STATE_STORAGE_KEY]: serverResponse.result,
                  [SECURITY_STORAGE_KEY]: security
                }

                return setItems(storageData)
                  .then(() => {
                    return Object.assign({}, serverResponse.result, {
                      security: security || {}
                    })
                  })
              })
          } else {
            return setItem(INITIAL_STATE_STORAGE_KEY, serverResponse.result)
              .then(() => serverResponse.result)
          }
        })
    })
}

function fetchInitialStateFromServer (url) {
  return fetch(url, { credentials: 'same-origin' }).then(parseResponse)
}
