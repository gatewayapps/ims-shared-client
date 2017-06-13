import { combineReducers } from 'redux-immutable'
import { routerReducer } from 'react-router-redux'

let _globalReducers

export const makeRootReducer = (globalReducers = {}, asyncReducers) => {
  _globalReducers = globalReducers || {}
  return combineReducers({
    routing: routerReducer,
    ...globalReducers,
    ...asyncReducers
  })
}

export const injectReducer = (store, { key, reducer }) => {
  store.asyncReducers[key] = reducer
  store.replaceReducer(makeRootReducer(_globalReducers, store.asyncReducers))
}

export default makeRootReducer
