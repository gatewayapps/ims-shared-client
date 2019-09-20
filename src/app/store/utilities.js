import Immutable from 'immutable'

export function getStateName(action) {
  return action && action.type === '@@redux/INIT'
    ? 'initialState argument passed to createStore'
    : 'previous state received by the reducer'
}

export function getUnexpectedInvocationParameterMessage(state, reducers, action) {
  const reducerNames = Object.keys(reducers)

  if (!reducerNames.length) {
    return (
      'Store does not have a valid reducer. Make sure the argument passed to combineReducers is an object ' +
      'whose values are reducers.'
    )
  }

  const stateName = getStateName(action)

  if (
    Immutable.isImmutable ? !Immutable.isImmutable(state) : !Immutable.Iterable.isIterable(state)
  ) {
    return (
      'The ' +
      stateName +
      ' is of unexpected type. Expected argument to be an instance of Immutable.Collection ' +
      'or Immutable.Record with the following properties: "' +
      reducerNames.join('", "') +
      '".'
    )
  }

  const unexpectedStatePropertyNames = state
    .toSeq()
    .keySeq()
    .toArray()
    .filter((name) => {
      return !reducers.hasOwnProperty(name)
    })

  if (unexpectedStatePropertyNames.length > 0) {
    return (
      'Unexpected ' +
      (unexpectedStatePropertyNames.length === 1 ? 'property' : 'properties') +
      ' "' +
      unexpectedStatePropertyNames.join('", "') +
      '" found in ' +
      stateName +
      '. Expected to find one of the known reducer property names instead: "' +
      reducerNames.join('", "') +
      '". Unexpected properties will be ignored.'
    )
  }

  return null
}

export function validateNextState(nextState, reducerName, action) {
  if (nextState === undefined) {
    throw new Error(
      'Reducer "' +
        reducerName +
        '" returned undefined when handling "' +
        action.type +
        '" action. To ignore an action, you must explicitly return the previous state.'
    )
  }
}
