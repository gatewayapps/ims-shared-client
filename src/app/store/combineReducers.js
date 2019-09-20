import Immutable from 'immutable'
import { getUnexpectedInvocationParameterMessage, validateNextState } from './utilities'

export default function combineReducers(
  reducers,
  universalReducer,
  getDefaultState = Immutable.Map
) {
  const reducerKeys = Object.keys(reducers)

  return (inputState = getDefaultState(), action) => {
    if (process.env.NODE_ENV !== 'production') {
      const warningMessage = getUnexpectedInvocationParameterMessage(inputState, reducers, action)

      if (warningMessage) {
        console.error(warningMessage)
      }
    }

    inputState = inputState.withMutations((temporaryState) => {
      reducerKeys.forEach((reducerName) => {
        const reducer = reducers[reducerName]
        const currentDomainState = temporaryState.get(reducerName)
        const nextDomainState = reducer(currentDomainState, action)

        validateNextState(nextDomainState, reducerName, action)

        temporaryState.set(reducerName, nextDomainState)
      })
    })

    if (universalReducer) {
      const nextState = universalReducer(inputState, action)
      validateNextState(nextState, 'universal', action)
      inputState = nextState
    }

    return inputState
  }
}
