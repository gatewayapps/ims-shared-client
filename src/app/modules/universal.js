// ------------------------------------
// Imports
// ------------------------------------
import _ from 'lodash'
import { fromJS } from 'immutable'

// ------------------------------------
// Constants
// ------------------------------------
export const IMS_SERVER_INITIAL_STATE = '@@IMS/SERVER_INITIAL_STATE'

// ------------------------------------
// Actions
// ------------------------------------
export function serverInitialState (initialState) {
  return {
    type: IMS_SERVER_INITIAL_STATE,
    initialState: initialState
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [IMS_SERVER_INITIAL_STATE]: (state, action) => {
    if (_.isObjectLike(action.initialState)) {
      return state.mergeDeep(fromJS(action.initialState))
    } else {
      return state
    }
  }
}
// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {}
export default function Reducer (state = fromJS(initialState), action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
