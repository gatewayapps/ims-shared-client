// ------------------------------------
// Imports
// ------------------------------------
import { fromJS, Map } from 'immutable'
import { takeLatest } from 'redux-saga'
import { call, put, fork } from 'redux-saga/effects'
import { createSelector } from 'reselect'
import PackageInformation from '../../PackageInformation'
import request from '../../utils/request'

// ------------------------------------
// Constants
// ------------------------------------
export const TOOLTIPS_FETCH = '@@TOOLTIPS/FETCH'
export const TOOLTIPS_FETCH_FAILURE = '@@TOOLTIPS/FETCH_FAILURE'
export const TOOLTIPS_FETCH_SUCCESS = '@@TOOLTIPS/FETCH_SUCCESS'

// ------------------------------------
// Actions
// ------------------------------------
export function fetchTooltips () {
  return {
    type: TOOLTIPS_FETCH
  }
}

export function fetchTooltipsSuccess (tooltips) {
  return {
    type: TOOLTIPS_FETCH_SUCCESS,
    tooltips: tooltips
  }
}

export function fetchTooltipsFailure (error) {
  return {
    type: TOOLTIPS_FETCH_FAILURE,
    error: error
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [TOOLTIPS_FETCH_FAILURE]: (state, action) => {
    return state.set('error', action.error)
  },
  [TOOLTIPS_FETCH_SUCCESS]: (state, action) => {
    const tooltips = action.tooltips.reduce((m, t) => {
      m[t.tooltipId] = t
      return m
    }, {})

    return state
      .set('error', '')
      .set('items', fromJS(tooltips))
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  error: '',
  items: {}
}

export default function Reducer (state = fromJS(initialState), action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}

// ------------------------------------
// Sagas
// ------------------------------------
function * fetchTooltipsSaga () {
  try {
    const hubUrl = window.__HUB_URL__

    if (!hubUrl) {
      yield put(fetchTooltipsFailure('Hub URL not defined'))
      return
    }

    const response = yield call(request, `${window.__HUB_URL__}/api/packages/${PackageInformation.packageId}/tooltips`)
    if (response.success === true) {
      yield put(fetchTooltipsSuccess(response.results))
    } else {
      yield put(fetchTooltipsFailure(response.message))
    }
  } catch (e) {
    yield put(fetchTooltipsFailure(e.message))
  }
}

function * watchFetchTooltips () {
  yield takeLatest(TOOLTIPS_FETCH, fetchTooltipsSaga)
}

export function * rootSaga () {
  yield fork(watchFetchTooltips)
}

// ------------------------------------
// Selectors
// ------------------------------------
const selectModuleState = () => (state) => state.get('tooltips')

export const selectTooltip = (tooltipId) => createSelector(
  selectModuleState(),
  (mState) => {
    const tooltip = mState.getIn([ 'items', `${tooltipId}` ])
    return Map.isMap(tooltip) ? tooltip.toJS() : makeTooltip(tooltipId)
  }
)

function makeTooltip (tooltipId) {
  return {
    packageId: PackageInformation.packageId,
    tooltipId: tooltipId,
    content: '',
    link: ''
  }
}