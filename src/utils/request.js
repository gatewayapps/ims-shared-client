import Promise from 'bluebird'
import { Map } from 'immutable'
import fetch from 'isomorphic-fetch'
import moment from 'moment'
import { Constants } from 'ims-shared-core'
import { getCookie } from './cookies'
import * as HeaderUtils from './headers'
import RequestError from './RequestError'

let storeInstance
let tokensPathKey
let packageId
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

  packageId = getCookie(Constants.Cookies.PackageId)
  if (!packageId) {
    throw new Error('"PACKAGE_ID" cookie has not been set')
  }

  hubUrl = getCookie(Constants.Cookies.HubUrl)
  if (!hubUrl) {
    throw new Error('"HUB_URL" cookie has not been set')
  }

  scheduleRefreshAccessToken()
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

function scheduleRefreshAccessToken () {
  verifyInitialized()

  const tokens = getTokens()

  const refreshTime = moment.unix(tokens.expires).subtract(5, 'minutes')
  let refreshIn = refreshTime.diff(moment())

  if (refreshIn < 0) {
    refreshIn = 0
  }

  setTimeout(refreshAccessToken, refreshIn)
}

function verifyInitialized () {
  if (!storeInstance || !tokensPathKey || !packageId || !hubUrl) {
    throw new Error('Request has not been prepared. You need to call "prepareRequest" to configure the request.')
  }
}

function makeAuthenticatedRequest (url, requestOptions) {
  const tokens = getTokens()
  requestOptions.headers = HeaderUtils.createAuthenticatedRequestHeader(packageId, tokens.accessToken)
  return makeRequest(url, requestOptions)
}

function makeUnauthenticatedRequest (url, requestOptions) {
  requestOptions.headers = HeaderUtils.createRequestHeader(packageId)
  return makeRequest(url, requestOptions)
}

function makeRequest (url, requestOptions) {
  return fetch(url, requestOptions).then(parseResponse)
}

function refreshAccessToken () {
  const tokens = getTokens()
  const refreshOptions = {
    headers: HeaderUtils.createRequestHeader(packageId),
    method: 'POST',
    body: JSON.stringify({ refreshToken: tokens.refreshToken })
  }

  return fetch(`${hubUrl}/users/accessToken`, refreshOptions)
    .then(parseResponse)
    .then((response) => {
      storeInstance.dispatch(updateAccessToken(response.accessToken, response.expires))
      scheduleRefreshAccessToken()
      return response
    })
}

function parseResponse (response) {
  if (!response || response.status >= 500) {
    throw new RequestError('Response received a server error')
  }

  return response.json()
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
    body: opts.body
  }

  if (!opts.requestOptions) {
    opts.requestOptions = requestOptions
  } else {
    opts.requestOptions = Object.assign({}, requestOptions, opts.requestOptions)
  }

  return opts
}
