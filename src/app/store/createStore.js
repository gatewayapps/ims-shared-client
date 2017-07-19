import {
  applyMiddleware,
  compose,
  createStore
} from 'redux'
import { routerMiddleware } from 'react-router-redux'
import { fromJS } from 'immutable'
import { sagaMiddleware, initializeSagas } from './sagas'
import { prepareInjector } from '../../utils/injectScopedReducer'
import { prepareRequest } from '../../utils/request'
import ActionTracker from '../../utils/ActionTracker'
import makeRootReducer, { injectReducer } from './reducers'

export default (initialState = {}, history, options) => {
  const actionTrackerOpts = {
    user: initialState.global ? initialState.global.currentUser : {},
    sessionId: new Date().getTime(),
    interval: 5,
    path: '/events',
    logging: false,
    method: 'POST',
    include: ['@@router/LOCATION_CHANGE'],
    shouldTrackAction: (a) => {
      const trackPattern = /.+_SAVE|_SELECT_TREE_NODE|_ADD_ITEM|_CREATE_NEW|_CANCEL/
      return a['_track'] || trackPattern.test(a.type)
    }
  }

  if (options.tracking) {
    Object.assign(actionTrackerOpts, options.tracking)
  }

  // ======================================================
  // Middleware Configuration
  // ======================================================
  const middleware = [
    sagaMiddleware,
    routerMiddleware(history),
    ActionTracker(actionTrackerOpts)
  ]

  // ======================================================
  // Store Enhancers
  // ======================================================
  const enhancers = []
  if (options.isDev) {
    const devToolsExtension = window.devToolsExtension
    if (typeof devToolsExtension === 'function') {
      enhancers.push(devToolsExtension())
    }
  }

  // ======================================================
  // Store Instantiation and HMR Setup
  // ======================================================
  const store = createStore(
    makeRootReducer(options.reducers),
    fromJS(initialState),
    compose(
      applyMiddleware(...middleware),
      ...enhancers
    )
  )
  store.asyncReducers = {}

  // Prepare request object
  prepareRequest(store, 'security.tokens', 'security.packages')

  // Prepare scoped component injector
  prepareInjector(store, injectReducer)

  // Initialize global sagas
  initializeSagas(options.sagas)

  if (module.hot) {
    module.hot.accept('./reducers', () => {
      const reducers = require('./reducers').default
      store.replaceReducer(reducers(options.reducers, store.asyncReducers))
    })
  }

  return store
}
