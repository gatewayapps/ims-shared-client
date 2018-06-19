import createSagaMiddleware from 'redux-saga'
import { rootSaga as securityRootSaga } from '../modules/security'
import { rootSaga as tooltipsRootSaga } from '../modules/tooltips'

const sagaRegistry = {}

export const sagaMiddleware = createSagaMiddleware()

export const injectSaga = (key, saga) => {
  if (sagaRegistry[key]) {
    sagaRegistry[key].cancel()
  }
  sagaRegistry[key] = sagaMiddleware.run(saga)
}

export const initializeSagas = (sagas = {}) => {
  injectSaga('security', securityRootSaga)
  injectSaga('tooltips', tooltipsRootSaga)

  Object.keys(sagas).forEach((key) => {
    injectSaga(key, sagas[key])
  })
}
