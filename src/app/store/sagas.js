import createSagaMiddleware from 'redux-saga'

const sagaRegistry = {}

export const sagaMiddleware = createSagaMiddleware()

export const injectSaga = (key, saga) => {
  if (sagaRegistry[key]) {
    sagaRegistry[key].cancel()
  }
  sagaRegistry[key] = sagaMiddleware.run(saga)
}

export const initializeSagas = (sagas = {}) => {
  Object.keys(sagas).forEach((key) => {
    injectSaga(key, sagas[key])
  })
}
