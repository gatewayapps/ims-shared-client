import { routerReducer } from 'react-router-redux'
import { reducer as notifications } from 'react-notification-system-redux'
import combineReducers from './combineReducers'
import securityReducer from '../modules/security'
import universalReducer from '../modules/universal'
import packagesReducer from '../modules/packages'

let _globalReducers

export const makeRootReducer = (globalReducers = {}, asyncReducers) => {
  _globalReducers = globalReducers || {}
  return combineReducers({
    routing: routerReducer,
    security: securityReducer,
    notifications: notifications,
    __USER__PACKAGES: packagesReducer,
    ...globalReducers,
    ...asyncReducers
  }, universalReducer)
}

export const injectReducer = (store, { key, reducer }) => {
  store.asyncReducers[key] = reducer
  store.replaceReducer(makeRootReducer(_globalReducers, store.asyncReducers))
}

export default makeRootReducer
