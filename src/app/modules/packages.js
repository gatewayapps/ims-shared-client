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

// ------------------------------------
// Actions
// ------------------------------------
export function createPackageState (packages) {
  return {
    type: SET_PACKAGES_STATE,
    packages: packages
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [SET_PACKAGES_STATE]: (state, action) => {
    return fromJS(action.packages)
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
const selectModuleState = () => (state) => state.get('packages')

export const selectPackages = () => createSelector(
  selectModuleState(),
  (mState) => {
    return List.isList(mState) ? mState.toJS() : []
  }
)
