import _ from 'lodash'
import fetch from 'isomorphic-fetch'
import PackageInformation from '../PackageInformation'
import { getItem, getItems, setItem, setItems } from '../utils/localStorage'
import { makeRefreshAccessTokenRequest, parseResponse, default as request } from '../utils/request'
import { createSecurityState, createPackageSecurityObject } from './modules/security'

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
      if (
          _.isObjectLike(storageData) &&
          _.isObjectLike(storageData[INITIAL_STATE_STORAGE_KEY]) &&
          _.isObjectLike(storageData[SECURITY_STORAGE_KEY]) &&
          _.isObjectLike(storageData[SECURITY_STORAGE_KEY].currentUser)) {
        return Object.assign({}, storageData[INITIAL_STATE_STORAGE_KEY], {
          security: storageData[SECURITY_STORAGE_KEY]
        })
      } else {
        return undefined
      }
    })
}

function createSecurityStateFromResponse (response) {
  if (response.results) {
    const packages = []
    let securityObject = {}
    for (var i = 0; i < response.results.length; i++) {
      packages.push(createPackageSecurityObject(response.results[i]))
      if (response.results[i].packageId === PackageInformation.packageId) {
        securityObject = createSecurityState(response.results[i].accessToken.token, response.results[i].accessToken.expires)
      }
    }
    securityObject.packages = packages
    return securityObject
  } else {
    return createSecurityState(response.accessToken, response.expires)
  }
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
                if (securityResponse && securityResponse.success === true) {
                  security = createSecurityStateFromResponse(securityResponse)
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

export function loadPackagesFromHub () {
  return request('/api/userAccounts/me/packages', { packageId: 'ims.core.administration' })
}

export function getPackageBadgeCount (pkgDef) {
  if (pkgDef.badgeUrl) {
    return request(pkgDef.badgeUrl).then((result) => {
      if (result.success && !isNaN(result.count)) {
        return {
          id: pkgDef.id,
          count: result.count
        }
      } else {
        return {
          id: pkgDef.id,
          count: 0
        }
      }
    }).catch(() => {
      // We never want to hold up the app for a badge request
      // So don't do anything, just return 0
      return {
        id: pkgDef.id,
        count: 0
      }
    })
  } else {
    return Promise.resolve({
      id: pkgDef.id,
      count: 0
    })
  }
}

function fetchInitialStateFromServer (url) {
  return fetch(url, { credentials: 'same-origin' }).then(parseResponse)
}
