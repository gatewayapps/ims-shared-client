import { getCookie } from './cookies'
import { Constants } from 'ims-shared-core'
import request from './request'
/** options
 * include: array of action types to include
 * interval: how often to send.  Defaults to 0 - immediately(in seconds)
 * user: the current user
 * sessionId: unique identifier to track a session
 */

export default function (options) {
  const ACTION_QUEUE = []
  const TIME_TO_WAIT = options.interval * 1000
  var QUEUE_TIMEOUT = null

  const packageId = getCookie(Constants.Cookies.PackageId)
  if (!packageId) {
    throw new Error('"PACKAGE_ID" cookie has not been set')
  }

  const hubUrl = getCookie(Constants.Cookies.HubUrl)
  if (!hubUrl) {
    throw new Error('"HUB_URL" cookie has not been set')
  }

  const shouldQueueAction = (action) => {
    return options.include && options.include.some((i) => i === action.type)
  }

  const sendQueue = () => {
    QUEUE_TIMEOUT = null

    const body = {
      user: options.user,
      sid: options.sessionId,
      events: ACTION_QUEUE,
      packageId: packageId,
      ua: navigator.userAgent,
      screen: {
        w: screen.width,
        h: screen.height
      }
    }
    return request(`${hubUrl}/api/track`, { body: JSON.stringify(body), method: 'POST' })
  }

  const queueAction = (action) => {
    if (shouldQueueAction(action)) {
      action['__ts'] = new Date()
      action['__view'] = {
        w: window.innerWidth,
        h: window.innerHeight
      }
      ACTION_QUEUE.push(action)

      if (QUEUE_TIMEOUT === null) {
        QUEUE_TIMEOUT = window.setTimeout(sendQueue, TIME_TO_WAIT)
      }
    }
  }

  // Actual middleware
  return store => next => action => {
    queueAction(action)
    return next(action)
  }
}
