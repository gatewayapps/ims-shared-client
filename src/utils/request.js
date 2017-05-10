import Promise from 'bluebird'
import { Map } from 'immutable'
import fetch from 'isomorphic-fetch'
import moment from 'moment'
import { Constants } from 'ims-shared-core'
import { getCookie } from './cookies'
import * as HeaderUtils from './headers'
import RequestError from './RequestError'
import PackageInformation from '../PackageInformation'

const REFRESH_ATTEMPT_DELAY = 5000
let refreshAttempts = 0

let storeInstance
let tokensPathKey
let hubUrl

export const UPDATE_ACCESS_TOKEN = 'UPDATE_ACCESS_TOKEN'

export function prepareRequest (store, tokensPath) {
  if (store && store.getState && store.dispatch) {
    storeInstance = store
  } else {
    throw new TypeError('Invalid "store" should be an instance of a redux store')
  }

  if (typeof tokensPath === 'string') {
    tokensPathKey = tokensPath.split('.')
  } else if (Array.isArray(tokensPath)) {
    tokensPathKey = tokensPath
  } else {
    throw new TypeError('Invalid "tokensPath" should be either a string or an array')
  }

  hubUrl = getCookie(Constants.Cookies.HubUrl)
  if (!hubUrl) {
    throw new Error('"HUB_URL" cookie has not been set')
  }

  refreshAttempts = 0

  return refreshAccessToken()
}

export default function request (url, options) {
  try {
    verifyInitialized()

    const opts = prepareOptions(options)

    if (opts.authenticate) {
      return makeAuthenticatedRequest(url, opts.requestOptions)
    } else {
      return makeUnauthenticatedRequest(url, opts.requestOptions)
    }
  } catch (e) {
    return Promise.reject(e)
  }
}

function getTokens () {
  const tokens = storeInstance.getState().getIn(tokensPathKey)
  return Map.isMap(tokens) ? tokens.toJS() : undefined
}

function getAccessToken () {
  const tokens = getTokens()
  if (tokens) {
    if (tokens.expires < moment().add(1, 'minute').unix()) {
      return refreshAccessToken()
      .then((response) => response.accessToken)
    } else {
      return Promise.resolve(tokens.accessToken)
    }
  } else {
    console.log('NO TOKENS')
    throw new Error('No tokens in the store')
  }
}

function scheduleRefreshAccessToken () {
  verifyInitialized()

  const tokens = getTokens()

  if (tokens) {
    const refreshTime = moment.unix(tokens.expires).subtract(5, 'minutes')
    let refreshIn = refreshTime.diff(moment())

    if (refreshIn < 0) {
      refreshIn = 0
    }

    setTimeout(() => refreshAccessToken(true), refreshIn)
  } else {
    throw new Error('No tokens in the store')
  }
}

function verifyInitialized () {
  if (!storeInstance || !tokensPathKey || !PackageInformation.packageId || !hubUrl) {
    throw new Error('Request has not been prepared. You need to call "prepareRequest" to configure the request.')
  }
}

function makeAuthenticatedRequest (url, requestOptions) {
  return getAccessToken()
    .then((accessToken) => {
      requestOptions.headers = HeaderUtils.createAuthenticatedRequestHeader(PackageInformation.packageId, accessToken)
      return makeRequest(url, requestOptions)
    })
}

function makeUnauthenticatedRequest (url, requestOptions) {
  requestOptions.headers = HeaderUtils.createRequestHeader(PackageInformation.packageId)
  return makeRequest(url, requestOptions)
}

function makeRequest (url, requestOptions) {
  return fetch(url, requestOptions).then(parseResponse)
}

export function refreshAccessToken (scheduleRefresh) {
  const tokens = getTokens()

  if (!tokens || !tokens.refreshToken) {
    return Promise.resolve()
  }

  const refreshOptions = {
    headers: HeaderUtils.createRequestHeader(PackageInformation.packageId),
    method: 'POST',
    body: JSON.stringify({ refreshToken: tokens.refreshToken })
  }

  return fetch(`${hubUrl}/users/accessToken`, refreshOptions)
    .then(parseResponse)
    .then((response) => {
      if (response.success === true) {
        storeInstance.dispatch(updateAccessToken(response.accessToken, response.expires))
        if (scheduleRefresh === true) {
          scheduleRefreshAccessToken()
        }
        refreshAttempts = 0
      } else {
        console.error(`Received success false from refreshAccessToken with message: ${response.message}`)
      }

      return response
    })
    .catch((error) => {
      refreshAttempts++
      console.error(`Failed refreshing access token attempt ${refreshAttempts}`, error)
      setTimeout(() => refreshAccessToken(true), REFRESH_ATTEMPT_DELAY * refreshAttempts)
    })
}

function parseResponse (response) {
  if (!response || response.status >= 500) {
    throw new RequestError('Response received a server error')
  }
  var contentType = response.headers.get('content-type')
  if (contentType && contentType.indexOf('application/json') !== -1) {
    return response.json()
  } else {
    return response.status === 200
  }
}

function updateAccessToken (accessToken, expires) {
  return {
    type: UPDATE_ACCESS_TOKEN,
    accessToken: accessToken,
    expires: expires
  }
}

function prepareOptions (options = {}) {
  const opts = Object.assign({}, options)

  if (!opts.method) {
    opts.method = 'GET'
  }

  if (!opts.credentials) {
    opts.credentials = 'same-origin'
  }

  if (opts.authenticate === undefined) {
    opts.authenticate = true
  }

  const requestOptions = {
    method: opts.method,
    credentials: opts.credentials,
    body: opts.body,
    headers: {
      'content-type': 'application/json',
      'accept': 'application/json'
    }
  }

  if (!opts.requestOptions) {
    opts.requestOptions = requestOptions
  } else {
    opts.requestOptions = Object.assign({}, requestOptions, opts.requestOptions)
  }

  return opts
}
