import { getCookie } from './cookies'
import { Constants } from 'ims-shared-core'
import request from './request'
import PackageInformation from '../PackageInformation'
/** options
 * include: array of action types to include
 * interval: how often to send.  Defaults to 0 - immediately(in seconds)
 * user: the current user
 * shouldTrackAction: method to determine if an action should be tracked
 * sessionId: unique identifier to track a session
 * logging: whether to write debug info to console.log
 * path: path on hub to send the event, defaults to /events/track
 * method: request method to use, defaults to 'POST'
 * requestOptions: options to send with the request
 */

export default function(options) {
  const log = function(msg, arg) {
    if (options.logging) {
      console.log(msg, arg)
    }
  }

  const getSeconds = () => {
    return new Date().getTime() / 1000
  }

  const ACTION_QUEUE = []
  const TIME_TO_WAIT = options.interval * 1000
  var QUEUE_TIMEOUT = null
  const SESSION_START_TIME = getSeconds()

  log('Session started at ', SESSION_START_TIME)

  const hubUrl = getCookie(Constants.Cookies.HubUrl)
  if (!hubUrl) {
    throw new Error('"HUB_URL" cookie has not been set')
  }

  const shouldQueueAction = (action) => {
    return options.include && options.include.some((i) => i === action.type)
  }

  const sendQueue = () => {
    QUEUE_TIMEOUT = null

    const body = JSON.stringify({
      usr: options.user,
      sid: options.sessionId,
      log: ACTION_QUEUE,
      pid: PackageInformation.packageId,
      ua: navigator.userAgent,
      scr: {
        w: screen.width,
        h: screen.height
      }
    })
    if (options.logging) {
      log('Sending queue', JSON.stringify(JSON.parse(body), null, 2))
    }

    ACTION_QUEUE.length = 0

    return request(`${hubUrl}${options.path || '/events/track'}`, {
      body: body,
      method: options.method || 'POST',
      requestOptions: options.requestOptions
    })
  }

  const addPropertiesToAction = (action) => {
    var retVal = {}
    Object.assign(retVal, action)
    retVal['!at'] = new Date()
    retVal['!st'] = getSeconds() - SESSION_START_TIME
    retVal['!w'] = {
      w: window.innerWidth,
      h: window.innerHeight
    }
    return retVal
  }

  const queueAction = (action) => {
    if (
      (options.shouldTrackAction && options.shouldTrackAction(action)) ||
      (options.include && shouldQueueAction(action))
    ) {
      ACTION_QUEUE.push(addPropertiesToAction(action))
      if (QUEUE_TIMEOUT === null) {
        QUEUE_TIMEOUT = window.setTimeout(sendQueue, TIME_TO_WAIT)
      }
    }
  }

  // Actual middleware
  return (store) => (next) => (action) => {
    queueAction(action)
    return next(action)
  }
}
