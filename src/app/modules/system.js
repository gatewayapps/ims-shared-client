// ------------------------------------
// Imports
// ------------------------------------
import _ from 'lodash'
import { fromJS, Map } from 'immutable'
import { takeEvery, takeLatest } from 'redux-saga'
import { call, put, fork } from 'redux-saga/effects'
import { createSelector } from 'reselect'
import PackageInformation from '../../PackageInformation'
import request from '../../utils/request'
import Notifications from 'react-notification-system-redux'
import React from 'react'

// ------------------------------------
// Constants
// ------------------------------------
export const SYSTEM_CHECK_CLIENT_TIME = '@@SYSTEM/CHECK CLIENT TIME'

// ------------------------------------
// Actions
// ------------------------------------
export function checkClientTime() {
  return {
    type: SYSTEM_CHECK_CLIENT_TIME
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {}

export default function Reducer(state = fromJS(initialState), action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}

// ------------------------------------
// Sagas
// ------------------------------------
function* checkClientTimeSaga(action) {
  const hubUrl = window.__HUB_URL__
  if (!hubUrl) {
  } else {
    const t = new Date()
    const response = yield call(request, `${window.__HUB_URL__}/api/timeCheck?t=${t}`)
    if (response.success === true) {
    } else {
      yield put(
        Notifications.error({
          title: (
            <div>
              <i className="fa fa-exclamation-triangle" /> System Time Warning
            </div>
          ),
          message: response.reason,
          autoDismiss: 5,
          position: 'tr'
        })
      )
    }
  }
}

function* watchCheckClientTime() {
  yield takeLatest(SYSTEM_CHECK_CLIENT_TIME, checkClientTimeSaga)
}

export function* rootSaga() {
  yield fork(watchCheckClientTime)
}
