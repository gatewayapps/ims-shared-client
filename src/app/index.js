import ImsBootstrapper from './bootstrapper'
import { injectReducer } from './store/reducers'
import { injectSaga } from './store/sagas'
import { selectLocationState } from './modules/routing'

/* Layouts */
import ReactiveLayout from './layouts/ReactiveLayout'

import {
  logout,
  SECURITY_LOGOUT,
  selectAccessToken,
  selectCurrentUser,
  selectTokens
} from './modules/security'

module.exports = {
  ImsBootstrapper: ImsBootstrapper,
  injectReducer: injectReducer,
  injectSaga: injectSaga,
  logout: logout,
  SECURITY_LOGOUT: SECURITY_LOGOUT,
  selectAccessToken: selectAccessToken,
  selectCurrentUser: selectCurrentUser,
  selectLocationState: selectLocationState,
  selectTokens: selectTokens,
  ReactiveLayout: ReactiveLayout
}
