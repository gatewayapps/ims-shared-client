// ------------------------------------
// Imports
// ------------------------------------
import _ from 'lodash'
import { fromJS, List } from 'immutable'
import { createSelector } from 'reselect'

// ------------------------------------
// Constants
// ------------------------------------
export const SET_PACKAGES_STATE = '@@PACKAGES/SET_PACKAGES_STATE'
export const SET_PACKAGE_BADGE_COUNT = '@@PACKAGES/SET_PACKAGE_BADGE_COUNT'

// ------------------------------------
// Actions
// ------------------------------------
export function createPackageState (packages) {
  return {
    type: SET_PACKAGES_STATE,
    packages: packages
  }
}

export function setPackageBadgeCount (id, count) {
  return {
    type: SET_PACKAGE_BADGE_COUNT,
    id,
    count
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [SET_PACKAGES_STATE]: (state, action) => {
    // Prevent zeroing out the badge count during an update
    for (var i = 0; i < state.length; i++) {
      const packageIndex = action.packages.findIndex((p) => p.packageId === state[i].packageId)
      if (packageIndex > -1) {
        action.packages[packageIndex].badgeCount = state[i].badgeCount
      }
    }

    return fromJS(action.packages)
  },
  [SET_PACKAGE_BADGE_COUNT]: (state, action) => {
    const packages = state.toJS()
    for (var i = 0; i < packages.length; i++) {
      if (packages[i].id === action.id) {
        packages[i].badgeCount = action.count
      }
    }
    return fromJS(packages)
  }
}
// ------------------------------------
// Reducer
// ------------------------------------
const initialState = []
export default function Reducer (state = fromJS(initialState), action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}

// ------------------------------------
// Selectors
// ------------------------------------
const selectModuleState = () => (state) => state.get('__USER__PACKAGES')

export const selectPackages = () => createSelector(
  selectModuleState(),
  (mState) => {
    return List.isList(mState) ? mState.toJS() : []
  }
)
