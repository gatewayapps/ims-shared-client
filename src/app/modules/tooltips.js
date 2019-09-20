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

// ------------------------------------
// Constants
// ------------------------------------
export const TOOLTIPS_BEGIN_EDIT = '@@TOOLTIPS/BEGIN_EDIT'
export const TOOLTIPS_CANCEL_EDIT = '@@TOOLTIPS/CANCEL_EDIT'
export const TOOLTIPS_CHANGE_CONTENT = '@@TOOLTIPS/CHANGE_CONTENT'
export const TOOLTIPS_CHANGE_LINK = '@@TOOLTIPS/CHANGE_LINK'
export const TOOLTIPS_FETCH = '@@TOOLTIPS/FETCH'
export const TOOLTIPS_FETCH_FAILURE = '@@TOOLTIPS/FETCH_FAILURE'
export const TOOLTIPS_FETCH_SUCCESS = '@@TOOLTIPS/FETCH_SUCCESS'
export const TOOLTIPS_SAVE = '@@TOOLTIPS/SAVE'
export const TOOLTIPS_SAVE_FAILURE = '@@TOOLTIPS/SAVE_FAILURE'
export const TOOLTIPS_SAVE_SUCCESS = '@@TOOLTIPS/SAVE_SUCCESS'

// ------------------------------------
// Actions
// ------------------------------------
export function beginEdit(tooltip) {
  return {
    type: TOOLTIPS_BEGIN_EDIT,
    tooltip: tooltip
  }
}

export function cancelEdit(tooltipId) {
  return {
    type: TOOLTIPS_CANCEL_EDIT,
    tooltipId: tooltipId
  }
}

export function changeContent(tooltipId, content) {
  return {
    type: TOOLTIPS_CHANGE_CONTENT,
    tooltipId: tooltipId,
    content: content
  }
}

export function changeLink(tooltipId, link) {
  return {
    type: TOOLTIPS_CHANGE_LINK,
    tooltipId: tooltipId,
    link: link
  }
}

export function fetchTooltips() {
  return {
    type: TOOLTIPS_FETCH
  }
}

export function fetchTooltipsSuccess(tooltips) {
  return {
    type: TOOLTIPS_FETCH_SUCCESS,
    tooltips: tooltips
  }
}

export function fetchTooltipsFailure(error) {
  return {
    type: TOOLTIPS_FETCH_FAILURE,
    error: error
  }
}

export function saveTooltip(tooltip) {
  return {
    type: TOOLTIPS_SAVE,
    tooltip: tooltip
  }
}

export function saveTooltipFailure(tooltipId, error) {
  return {
    type: TOOLTIPS_SAVE_FAILURE,
    tooltipId: tooltipId,
    error: error
  }
}

export function saveTooltipSuccess(tooltipId, tooltip) {
  return {
    type: TOOLTIPS_SAVE_SUCCESS,
    tooltip: tooltip
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [TOOLTIPS_BEGIN_EDIT]: (state, action) => {
    return state.setIn(['edit', `${action.tooltip.tooltipId}`], fromJS(action.tooltip))
  },
  [TOOLTIPS_CANCEL_EDIT]: (state, action) => {
    return state.deleteIn(['edit', `${action.tooltipId}`])
  },
  [TOOLTIPS_CHANGE_CONTENT]: (state, action) => {
    if (state.hasIn(['edit', `${action.tooltipId}`])) {
      return state.setIn(['edit', `${action.tooltipId}`, 'content'], action.content)
    } else {
      return state
    }
  },
  [TOOLTIPS_CHANGE_LINK]: (state, action) => {
    if (state.hasIn(['edit', `${action.tooltipId}`])) {
      return state.setIn(['edit', `${action.tooltipId}`, 'link'], action.link)
    } else {
      return state
    }
  },
  [TOOLTIPS_FETCH_FAILURE]: (state, action) => {
    return state.set('error', action.error)
  },
  [TOOLTIPS_FETCH_SUCCESS]: (state, action) => {
    const tooltips = action.tooltips.reduce((m, t) => {
      m[t.tooltipId] = t
      return m
    }, {})

    return state.set('error', '').set('items', fromJS(tooltips))
  },
  [TOOLTIPS_SAVE]: (state, action) => {
    if (state.hasIn(['edit', `${action.tooltip.tooltipId}`])) {
      return state.setIn(['edit', `${action.tooltip.tooltipId}`, 'isSaving'], true)
    } else {
      return state
    }
  },
  [TOOLTIPS_SAVE_FAILURE]: (state, action) => {
    if (state.hasIn(['edit', `${action.tooltipId}`])) {
      return state
        .setIn(['edit', `${action.tooltipId}`, 'error'], action.error)
        .setIn(['edit', `${action.tooltipId}`, 'isSaving'], false)
    } else {
      return state
    }
  },
  [TOOLTIPS_SAVE_SUCCESS]: (state, action) => {
    return state
      .setIn(['items', `${action.tooltip.tooltipId}`], fromJS(action.tooltip))
      .deleteIn(['edit', `${action.tooltip.tooltipId}`])
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  error: '',
  items: {},
  edit: {}
}

export default function Reducer(state = fromJS(initialState), action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}

// ------------------------------------
// Sagas
// ------------------------------------
function* fetchTooltipsSaga() {
  try {
    const hubUrl = window.__HUB_URL__

    if (!hubUrl) {
      yield put(fetchTooltipsFailure('Hub URL not defined'))
      return
    }

    const response = yield call(
      request,
      `${window.__HUB_URL__}/api/packages/${PackageInformation.packageId}/tooltips`
    )
    if (response.success === true) {
      yield put(fetchTooltipsSuccess(response.results))
    } else {
      yield put(fetchTooltipsFailure(response.message))
    }
  } catch (e) {
    yield put(fetchTooltipsFailure(e.message))
  }
}

function* saveTooltipSaga(action) {
  try {
    const hubUrl = window.__HUB_URL__

    if (!hubUrl) {
      yield put(saveTooltipFailure(action.tooltip.tooltipId, 'Hub URL not defined'))
      return
    }

    const reqOpts = {
      method: 'POST',
      body: JSON.stringify(_.pickBy(action.tooltip, (x) => x !== null))
    }
    const url = `${window.__HUB_URL__}/api/packages/${PackageInformation.packageId}/tooltips`

    const response = yield call(request, url, reqOpts)

    if (response.success === true) {
      yield put(saveTooltipSuccess(response.result.tooltipId, response.result))
    } else {
      yield put(saveTooltipFailure(action.tooltip.tooltipId, response.message))
    }
  } catch (e) {
    yield put(saveTooltipFailure(action.tooltip.tooltipId, e.message))
  }
}

function* watchFetchTooltips() {
  yield takeLatest(TOOLTIPS_FETCH, fetchTooltipsSaga)
}

function* watchSaveTooltip() {
  yield takeEvery(TOOLTIPS_SAVE, saveTooltipSaga)
}

export function* rootSaga() {
  yield fork(watchFetchTooltips)
  yield fork(watchSaveTooltip)
}

// ------------------------------------
// Selectors
// ------------------------------------
const selectModuleState = () => (state) => state.get('tooltips')

export const selectEditTooltip = (tooltipId) =>
  createSelector(
    selectModuleState(),
    (mState) => {
      const editTooltip = mState.getIn(['edit', `${tooltipId}`])
      return Map.isMap(editTooltip) ? editTooltip.toJS() : undefined
    }
  )

export const selectIsEditing = (tooltipId) =>
  createSelector(
    selectModuleState(),
    (mState) => {
      return mState.hasIn(['edit', `${tooltipId}`])
    }
  )

export const selectIsSaving = (tooltipId) =>
  createSelector(
    selectModuleState(),
    (mState) => {
      return mState.getIn(['edit', `${tooltipId}`, 'isSaving']) || false
    }
  )

export const selectTooltip = (tooltipId) =>
  createSelector(
    selectModuleState(),
    (mState) => {
      const tooltip = mState.getIn(['items', `${tooltipId}`])
      return Map.isMap(tooltip) ? tooltip.toJS() : makeTooltip(tooltipId)
    }
  )

function makeTooltip(tooltipId) {
  return {
    packageId: PackageInformation.packageId,
    tooltipId: tooltipId,
    content: '',
    link: ''
  }
}
