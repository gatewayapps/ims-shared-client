import { fromJS } from 'immutable'

// ------------------------------------
// Selectors
// ------------------------------------
export const selectLocationState = () => {
  let prevRoutingState
  let prevRoutingStateJS

  return (state) => {
    const routingState = fromJS(state.get('routing'))

    if (!routingState.equals(prevRoutingState)) {
      prevRoutingState = routingState
      prevRoutingStateJS = routingState.toJS()
    }

    return prevRoutingStateJS
  }
}
