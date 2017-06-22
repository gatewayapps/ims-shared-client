import createSagaMiddleware from 'redux-saga'
import { rootSaga as securityRootSaga } from '../modules/security'

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

  Object.keys(sagas).forEach((key) => {
    injectSaga(key, sagas[key])
  })
}
