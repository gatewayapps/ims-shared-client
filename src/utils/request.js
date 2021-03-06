import Promise from 'bluebird'
import { Map, List } from 'immutable'
import fetch from 'isomorphic-fetch'
import FileSaver from 'file-saver'
import moment from 'moment'
import { Constants } from 'ims-shared-core'
import { getCookie } from './cookies'
import * as HeaderUtils from './headers'
import RequestError from './RequestError'
import { setLocation } from './window'
import { getAuthorizeUrl } from './auth'
import PackageInformation from '../PackageInformation'

const REFRESH_ATTEMPT_DELAY = 5000
let refreshAttempts = 0

let storeInstance
let packagesPathKey
let tokensPathKey
let hubUrl

let REFRESH_ACCESS_TOKEN_TIMEOUT

export const UPDATE_ACCESS_TOKEN = 'UPDATE_ACCESS_TOKEN'
export const UPDATE_PACKAGE_ACCESS_TOKENS = 'UPDATE_PACKAGE_ACCESS_TOKENS'

export function prepareRequest(store, tokensPath, packagesPath) {
  if (store && store.getState && store.dispatch) {
    storeInstance = store
  } else {
    throw new TypeError('Invalid "store" should be an instance of a redux store')
  }
  if (typeof packagesPath === 'string') {
    packagesPathKey = packagesPath.split('.')
  } else if (Array.isArray(packagesPath)) {
    packagesPathKey = packagesPath
  } else {
    throw new TypeError('Invalid "packagesPath" should be either a string or an array')
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

export default function request(url, options) {
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

export function download(url, options) {
  try {
    verifyInitialized()

    const opts = prepareDownloadOptions(options)

    if (opts.authenticate) {
      return makeAuthenticatedDownload(url, opts.requestOptions, opts.defaultFileName)
    } else {
      return makeUnauthentiatedDownload(url, opts.requestOptions, opts.defaultFileName)
    }
  } catch (e) {
    return Promise.reject(e)
  }
}

function getTokens() {
  const tokens = storeInstance.getState().getIn(tokensPathKey)
  return Map.isMap(tokens) ? tokens.toJS() : undefined
}

function getAccessToken() {
  const tokens = getTokens()
  if (tokens) {
    if (
      tokens.expires <
      moment()
        .add(1, 'minute')
        .unix()
    ) {
      return refreshAccessToken().then((response) => response.accessToken)
    } else {
      return Promise.resolve(tokens.accessToken)
    }
  } else {
    console.log('NO TOKENS')
    throw new Error('No tokens in the store')
  }
}

export function isPackageAvailable(packageId) {
  const packagesList = storeInstance.getState().getIn(packagesPathKey)

  const packages = List.isList(packagesList) ? packagesList.toJS() : undefined
  if (packages) {
    const filtered = packages.filter((p) => p.packageId === packageId)
    return filtered.length > 0 && filtered[0].installed
  }
  return false
}

function getPackage(packageId) {
  const packagesList = storeInstance.getState().getIn(packagesPathKey)

  const packages = List.isList(packagesList) ? packagesList.toJS() : undefined
  if (packages) {
    const filtered = packages.filter((p) => p.packageId === packageId)
    if (filtered.length > 0) {
      return filtered[0]
    }
  }
  return undefined
}

function getAccessTokenForPackage(packageId) {
  const pkg = getPackage(packageId)

  if (pkg) {
    const token = pkg.accessToken

    if (token) {
      if (
        token.expires <
        moment()
          .add(1, 'minute')
          .unix()
      ) {
        return refreshAccessToken().then(() => getAccessTokenForPackage(packageId))
      } else {
        return Promise.resolve(token.token)
      }
    }
  } else {
    console.log('NO PACKAGE')
    throw new Error(
      'The requested package is not present in the store.  You need to add ' +
        packageId +
        ' to your packageDependencies.'
    )
  }
}

function scheduleRefreshAccessToken() {
  verifyInitialized()

  const tokens = getTokens()

  if (tokens) {
    const refreshTime = moment.unix(tokens.expires).subtract(5, 'minutes')
    let refreshIn = refreshTime.diff(moment())

    if (refreshIn < 0) {
      refreshIn = 0
    }
    if (REFRESH_ACCESS_TOKEN_TIMEOUT) {
      clearTimeout(REFRESH_ACCESS_TOKEN_TIMEOUT)
    }
    REFRESH_ACCESS_TOKEN_TIMEOUT = setTimeout(() => refreshAccessToken(true), refreshIn)
  } else {
    throw new Error('No tokens in the store')
  }
}

function verifyInitialized() {
  if (!storeInstance || !tokensPathKey || !PackageInformation.packageId || !hubUrl) {
    throw new Error(
      'Request has not been prepared. You need to call "prepareRequest" to configure the request.'
    )
  }
}

function combineUrlParts(base, endpoint) {
  if (endpoint.indexOf('/') !== 0) {
    endpoint = '/' + endpoint
  }
  if (base.lastIndexOf('/') === base.length - 1) {
    base = base.substr(0, base.length - 1)
  }
  return `${base}${endpoint}`
}

export function getUrlForPackage(packageId, endpoint) {
  const pkg = getPackage(packageId)
  if (pkg && pkg.packageUrl) {
    return combineUrlParts(pkg.packageUrl, endpoint)
  } else {
    return undefined
  }
}

function makeAuthenticatedRequest(url, requestOptions) {
  if (requestOptions.packageId) {
    const pkg = getPackage(requestOptions.packageId)
    if (pkg && pkg.packageUrl) {
      return getAccessTokenForPackage(pkg.packageId).then((accessToken) => {
        requestOptions.headers = HeaderUtils.createAuthenticatedRequestHeader(
          requestOptions.packageId,
          accessToken
        )

        return makeRequest(combineUrlParts(pkg.packageUrl, url), requestOptions)
      })
    } else {
      throw new Error(
        `Package ${requestOptions.packageId} was not found in ${packagesPathKey.join(
          '.'
        )}.  Make sure you have added the package to your packageDependencies`
      )
    }
  } else {
    return getAccessToken().then((accessToken) => {
      requestOptions.headers = HeaderUtils.createAuthenticatedRequestHeader(
        PackageInformation.packageId,
        accessToken
      )
      return makeRequest(url, requestOptions)
    })
  }
}

function makeUnauthenticatedRequest(url, requestOptions) {
  requestOptions.headers = HeaderUtils.createRequestHeader(PackageInformation.packageId)
  return makeRequest(url, requestOptions)
}

function makeRequest(url, requestOptions) {
  return fetch(url, requestOptions).then(parseResponse)
}

function makeAuthenticatedDownload(url, requestOptions, defaultFileName) {
  return getAccessToken().then((accessToken) => {
    requestOptions.headers = HeaderUtils.createAuthenticatedRequestHeader(
      PackageInformation.packageId,
      accessToken
    )
    return makeDownloadRequest(url, requestOptions, defaultFileName)
  })
}

function makeUnauthentiatedDownload(url, requestOptions, defaultFileName) {
  requestOptions.headers = HeaderUtils.createRequestHeader(PackageInformation.packageId)
  return makeDownloadRequest(url, requestOptions, defaultFileName)
}

function makeDownloadRequest(url, requestOptions, defaultFileName) {
  return fetch(url, requestOptions).then(parseDownloadResponse(defaultFileName))
}

export function makeRefreshAccessTokenRequest() {
  const refreshToken = getCookie(Constants.Cookies.RefreshToken)

  if (!refreshToken) {
    return Promise.resolve({ success: false, message: 'Refresh token not found.' })
  }

  const body = { refreshToken: refreshToken }
  let accessTokenEndpoint = 'accessToken'

  // If a package has packageDependencies set, use those
  if (PackageInformation.packageDependencies) {
    const packages = Array.isArray(PackageInformation.packageDependencies)
      ? PackageInformation.packageDependencies
      : Object.keys(PackageInformation.packageDependencies)
    if (packages.indexOf(PackageInformation.packageId) === -1) {
      packages.push(PackageInformation.packageId)
    }
    body.packages = packages
    accessTokenEndpoint = 'accessTokens'
  }
  const refreshOptions = {
    headers: HeaderUtils.createRequestHeader(PackageInformation.packageId),
    method: 'POST',
    body: JSON.stringify(body)
  }

  return fetch(`${window.__HUB_URL__}/users/${accessTokenEndpoint}`, refreshOptions).then(
    parseResponse
  )
}

function parseDownloadResponse(defaultFileName) {
  return (response) => {
    if (response.status === 200) {
      const contentType = response.headers.get('content-type')

      if (contentType.indexOf('application/json') === -1) {
        return response.blob().then((blob) => {
          const contentDisposition = response.headers.get('content-disposition')
          const re = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
          const result = re.exec(contentDisposition)
          if (result && result[1]) {
            defaultFileName = result[1].replace(/"/g, '').replace(/'/g, '')
          }
          FileSaver.saveAs(blob, defaultFileName)
          return true
        })
      }
    }

    return response.json()
  }
}

export function refreshAccessToken(scheduleRefresh) {
  return makeRefreshAccessTokenRequest()
    .then((response) => {
      if (response.success === true) {
        if (response.results) {
          for (var i = 0; i < response.results.length; i++) {
            if (response.results[i].packageId === PackageInformation.packageId) {
              if (!response.results[i].accessToken || !response.results[i].accessToken.token) {
                return goToLogin(response.results[i].loginUrl)
              }
              storeInstance.dispatch(
                updateAccessToken(
                  response.results[i].accessToken.token,
                  response.results[i].accessToken.expires
                )
              )
            }
          }
          storeInstance.dispatch(updatePackageAccessTokens(response.results))
        } else {
          if (!response.accessToken) {
            return goToLogin(response.loginUrl)
          }
          storeInstance.dispatch(updateAccessToken(response.accessToken, response.expires))
        }

        scheduleRefreshAccessToken()

        refreshAttempts = 0
      } else {
        console.error(
          `Received success false from refreshAccessToken with message: ${response.message}`
        )
        return goToLogin(response.loginUrl)
      }

      return response
    })
    .catch((error) => {
      refreshAttempts++
      console.error(`Failed refreshing access token attempt ${refreshAttempts}`, error)
      setTimeout(() => refreshAccessToken(true), REFRESH_ATTEMPT_DELAY * refreshAttempts)
    })
}

export function parseResponse(response) {
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

function updatePackageAccessTokens(accessTokens) {
  return {
    type: UPDATE_PACKAGE_ACCESS_TOKENS,
    accessTokens: accessTokens
  }
}

function updateAccessToken(accessToken, expires) {
  return {
    type: UPDATE_ACCESS_TOKEN,
    accessToken: accessToken,
    expires: expires
  }
}

function prepareDownloadOptions(options = {}) {
  const opts = prepareOptions(options)

  if (!opts.defaultFileName) {
    opts.defaultFileName = 'download'
  }

  return opts
}

function prepareOptions(options = {}) {
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
    packageId: opts.packageId,
    body: opts.body,
    headers: {
      'content-type': 'application/json',
      accept: 'application/json'
    }
  }

  if (!opts.requestOptions) {
    opts.requestOptions = requestOptions
  } else {
    opts.requestOptions = Object.assign({}, requestOptions, opts.requestOptions)
  }

  return opts
}

function goToLogin(loginUrl) {
  loginUrl = loginUrl || getAuthorizeUrl(window.location.pathname)
  setLocation(loginUrl)
  return { success: false, message: 'Invalid refreshToken redirecting to login' }
}
