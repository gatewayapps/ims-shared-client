import 'event-source-polyfill'
import _ from 'lodash'
import React from 'react'
import ReactDOM from 'react-dom'
import {
  browserHistory
} from 'react-router'
import {
  syncHistoryWithStore
} from 'react-router-redux'
import { Constants } from 'ims-shared-core'
import ImsApplication from '../components/App/'
import { getAuthorizeUrl } from '../utils/auth'
import { getCookie } from '../utils/cookies'
import { setLocation } from '../utils/window'
import PackageInformation from '../PackageInformation'
import { loadInitialState, loadInitialStateFromServer, loadPackagesFromHub, getPackageBadgeCount } from './stateInitializer'
import createStore from './store/createStore'
import { selectLocationState } from './modules/routing'
import { serverInitialState } from './modules/universal'
import { checkClientTime } from './modules/system'
import { createPackageState, setPackageBadgeCount } from './modules/packages'

export default function imsBootstrapper (options = {}) {
  const opts = validateOptions(options)

  // ========================================================
  // Configure PackageInformation
  // ========================================================
  window.versionInfo = opts.config
  PackageInformation.configure(window.versionInfo)

  // ========================================================
  // Load HUB URL from cookies
  // ========================================================
  window.__HUB_URL__ = getCookie(Constants.Cookies.HubUrl)

  // ========================================================
  // Set window variable for development mode
  // ========================================================
  window.__DEV__ = opts.isDev

  // ========================================================
  // If no guest access is enabled and there is no
  // refresh token redirect to login
  // ========================================================
  if (opts.noGuestAccess) {
    const rt = getCookie(Constants.Cookies.RefreshToken)
    if (!rt) {
      setLocation(getAuthorizeUrl(window.location.pathname))
      return
    }
  }

  // ========================================================
  // Store and History Instantiation
  // ========================================================
  loadInitialState(opts.stateInitializer).then(completeInitialization(opts))
}

function validateOptions (options) {
  if (!_.isObjectLike(options)) {
    throw new TypeError('options should be an object')
  }

  const lOpts = Object.assign({}, options)

  if (!_.isObjectLike(lOpts.config)) {
    throw new TypeError('options.config is required and should be an object')
  }

  if (lOpts.configureHMR && !_.isFunction(lOpts.configureHMR)) {
    throw new TypeError('options.configureHMR must be a function')
  }

  if (lOpts.stateInitializer) {
    if (!_.isObjectLike(lOpts.stateInitializer)) {
      throw new TypeError('options.stateInitializer should be an object')
    }

    if (!_.isString(lOpts.stateInitializer.url)) {
      throw new TypeError('options.stateInitializer.url is required and should be a string')
    }
  }

  if (lOpts.reducers && !_.isObjectLike(lOpts.reducers)) {
    throw new TypeError('options.reducers should be an object')
  }

  if (!_.isFunction(lOpts.routes)) {
    throw new TypeError('options.routes is required and should be a function')
  }

  if (lOpts.sagas && !_.isObjectLike(lOpts.sagas)) {
    throw new TypeError('options.sagas should be an object')
  }

  if (lOpts.tracking && !_.isObjectLike(lOpts.tracking)) {
    throw new TypeError('options.tracking should be an object')
  }

  if (lOpts.onAppWillMount && !_.isFunction(lOpts.onAppWillMount)) {
    throw new TypeError('options.onAppWillMount should be a function')
  }

  if (!_.isBoolean(lOpts.isDev)) {
    lOpts.isDev = false
  }

  if (!_.isBoolean(lOpts.noGuestAccess)) {
    lOpts.noGuestAccess = true
  }

  return lOpts
}

    // Load packages access from the hub
function updatePackages (store) {
  loadPackagesFromHub().then((result) => {
    if (result.success) {
      store.dispatch(createPackageState(result.packages))

      // Badge support
      for (var i = 0; i < result.packages.length; i++) {
        getPackageBadgeCount(result.packages[i]).then((countResponse) => {
          store.dispatch(setPackageBadgeCount(countResponse.id, countResponse.count))
        })
      }
    }
  })
}

function completeInitialization (options) {
  return (state) => {
    // ========================================================
    // Create Store and History
    // ========================================================
    createStore(state.initialState, browserHistory, options).then((store) => {
      store.dispatch(checkClientTime())
      if (state.fromLocalStorage === true) {
        loadInitialStateFromServer(options.stateInitializer.url)
        .then((initialState) => {
          if (initialState) {
            store.dispatch(serverInitialState(initialState))
          }
        })
      }

      window.setTimeout(() => { updatePackages(store) }, 0)
      window.setInterval(() => { updatePackages(store) }, 60000)

      const history = syncHistoryWithStore(browserHistory, store, {
        selectLocationState: selectLocationState()
      })

    // ========================================================
    // Render Setup
    // ========================================================
      const MOUNT_NODE = document.getElementById('root')

      let render = () => {
        const routes = options.routes(store)

        const appComponent = (
          <ImsApplication
            store={store}
            history={history}
            routes={routes}
            onAppWillMount={options.onAppWillMount} />
      )

        ReactDOM.render(appComponent, MOUNT_NODE)
      }

      if (options.isDev === true) {
        if (module.hot) {
        // Development render functions
          const renderApp = render
          const renderError = (error) => {
            const RedBox = require('redbox-react').default

            ReactDOM.render(<RedBox error={error} />, MOUNT_NODE)
          }

        // Wrap render in try/catch
          render = () => {
            try {
              renderApp()
            } catch (error) {
              renderError(error)
            }
          }

          if (options.configureHMR) {
            options.configureHMR(() => {
              setTimeout(() => {
                ReactDOM.unmountComponentAtNode(MOUNT_NODE)
                render()
              })
            })
          }
        }
      }

    // ========================================================
    // Go!
    // ========================================================
      render()
    })
    .catch((err) => {
      // A rejection here likely means that you are being redirected to the login page
      console.log(err.message)
    })
  }
}
