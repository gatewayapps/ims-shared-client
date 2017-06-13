import ImsBootstrapper from './bootstrapper'
import { injectReducer } from './store/reducers'
import { injectSaga } from './store/sagas'

module.exports = {
  ImsBootstrapper: ImsBootstrapper,
  injectReducer: injectReducer,
  injectSaga: injectSaga
}
