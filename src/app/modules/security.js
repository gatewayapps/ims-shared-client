// ------------------------------------
// Imports
// ------------------------------------
import { createSelector } from 'reselect'
import { takeLatest, takeEvery } from 'redux-saga'
import { call, fork, select } from 'redux-saga/effects'
import { fromJS, Map } from 'immutable'
import { Constants, PermissionHandler } from 'ims-shared-core'
import { INITIAL_STATE_STORAGE_KEY, SECURITY_STORAGE_KEY } from '../stateInitializer'
import { getAuthorizeUrl, decodeJWT } from '../../utils/auth'
import { deleteCookie } from '../../utils/cookies'
import {
  removeItems,
  setItem
} from '../../utils/localStorage'
import { UPDATE_ACCESS_TOKEN, UPDATE_PACKAGE_ACCESS_TOKENS } from '../../utils/request'
import { setLocation } from '../../utils/window'
import PackageInformation from '../../PackageInformation'

// ------------------------------------
// Constants
// ------------------------------------
export const SECURITY_LOGOUT = '@@security/LOGOUT'

// ------------------------------------
// Actions
// ------------------------------------
export function logout () {
  return {
    type: SECURITY_LOGOUT
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------
export function createSecurityState (accessToken, expires) {
  return {
    currentUser: decodeAccessToken(accessToken),
    tokens: {
      accessToken: accessToken,
      expires: expires
    }
  }
}

export function createPackageSecurityObject (packageInfo) {
  return {
    userInfo: decodeAccessToken(packageInfo.accessToken.token),
    expires: packageInfo.accessToken.expires,
    ...packageInfo
  }
}

function decodeAccessToken (accessToken) {
  const decoded = decodeJWT(accessToken)
  const permHandler = new PermissionHandler({ package:{ id: PackageInformation.packageId } })
  decoded.permissions = permHandler.createPermissionsArrayFromStringsArray(decoded.claims)
  return decoded
}

const ACTION_HANDLERS = {
  [UPDATE_ACCESS_TOKEN]: (state, action) => {
    const newSecurityState = createSecurityState(action.accessToken, action.expires)

    return state.merge(fromJS(newSecurityState))
  },
  [UPDATE_PACKAGE_ACCESS_TOKENS]: (state, action) => {
    const packages = action.accessTokens.map((p) => createPackageSecurityObject(p))
    return state.set('packages', fromJS(packages))
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  currentUser: undefined,
  tokens: {
    refreshToken: undefined,
    accessToken: undefined,
    expires: 0
  },
  packages: []
}
export default function Reducer (state = fromJS(initialState), action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}

// ------------------------------------
// Sagas
// ------------------------------------
export function * logoutSaga (action) {
  // delete the refreshToken cookie
  yield call(deleteCookie, Constants.Cookies.RefreshToken)

  // remove initialState from localStorage
  yield call(removeItems, [ INITIAL_STATE_STORAGE_KEY, SECURITY_STORAGE_KEY ])

  // redirect to the authorizeUrl
  let authorizeUrl = getAuthorizeUrl()
  yield call(setLocation, authorizeUrl)
}

export function * updateAccessTokenSaga (action) {
  // get security module from state
  const securityState = yield select(selectModuleState())

  // update security initial state in localStorage
  yield call(setItem, SECURITY_STORAGE_KEY, securityState.toJS())
}

export function * watchLogout () {
  yield takeEvery(SECURITY_LOGOUT, logoutSaga)
}

export function * watchUpdateAccessToken () {
  yield takeLatest(UPDATE_ACCESS_TOKEN, updateAccessTokenSaga)
}

export function * rootSaga () {
  yield fork(watchLogout)
  yield fork(watchUpdateAccessToken)
}

// ------------------------------------
// Selectors
// ------------------------------------
const selectModuleState = () => (state) => state.get('security')

export const selectCurrentUser = () => createSelector(
  selectModuleState(),
  (mState) => {
    const currentUser = mState.get('currentUser')
    return Map.isMap(currentUser) ? currentUser.toJS() : {}
  }
)

export const selectTokens = () => createSelector(
  selectModuleState(),
  (globalState) => {
    const tokens = globalState.get('tokens')
    return Map.isMap(tokens) ? tokens.toJS() : {}
  }
)

export const selectAccessToken = () => createSelector(
  selectModuleState(),
  (globalState) => globalState.getIn([ 'tokens', 'accessToken' ])
)
