import Promise from 'bluebird'
import fetch from 'isomorphic-fetch'
import moment from 'moment'
import * as HeaderUtils from './headers'
import RequestError from './RequestError'

export default function request (url, options) {
  try {
    const opts = prepareOptions(options)

    if (opts.authenticate) {
      return getAccessToken(opts.packageId, opts.tokens, opts.hubUrl)
        .then((accessToken) => {
          opts.requestOptions.headers = HeaderUtils.createAuthenticatedRequestHeader(opts.packageId, accessToken)
          return makeRequest(url, opts.requestOptions)
        })
    } else {
      opts.requestOptions.headers = HeaderUtils.createRequestHeader(opts.packageId)
      return makeRequest(url, opts.requestOptions)
    }
  } catch (e) {
    return Promise.reject(e)
  }
}

function makeRequest (url, requestOptions) {
  return fetch(url, requestOptions).then(parseResponse)
}

function getAccessToken (packageId, tokens, hubUrl) {
  const expiresLimit = moment().add(60, 'seconds').unix()
  if (tokens.expires < expiresLimit) {
    return refreshAccessToken(packageId, hubUrl, tokens.refreshToken)
      .then((result) => {
        if (result.success === true) {
          return result.accessToken
        } else {
          throw new RequestError(result.message)
        }
      })
  } else {
    return Promise.resolve(tokens.accessToken)
  }
}

function refreshAccessToken (packageId, hubUrl, refreshToken) {
  const refreshOptions = {
    headers: HeaderUtils.createRequestHeader(packageId),
    method: 'POST',
    body: JSON.stringify({ refreshToken: refreshToken })
  }

  return fetch(`${hubUrl}/users/accessToken`, refreshOptions).then(parseResponse)
}

function parseResponse (response) {
  if (!response || response.status >= 500) {
    throw new RequestError('Response received a server error')
  }

  return response.json()
}

function prepareOptions (options = {}) {
  const opts = Object.assign({}, options)

  if (!opts.packageId) {
    throw new RequestError('Missing packageId in options')
  }

  if (!opts.hubUrl) {
    throw new RequestError('Missing hubUrl in options')
  }

  if (!opts.method) {
    opts.method = 'GET'
  }

  if (!opts.credentials) {
    opts.credentials = 'same-origin'
  }

  if (opts.authenticate === undefined) {
    opts.authenticate = true
  }

  if (opts.authenticate && (!opts.tokens || !opts.tokens.refreshToken || !opts.tokens.accessToken)) {
    throw new RequestError(`Invalid or missing tokens object in options: ${JSON.stringify(opts.tokens)}`)
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
