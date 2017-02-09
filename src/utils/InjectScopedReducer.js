
var storeInstance
var injectorInstance

export function prepareInjector (store, injector) {
  storeInstance = store
  injectorInstance = injector
}

export function injectScopedReducer (scope, reducer) {
  const wrappedReducer = wrapReducer(scope, reducer)

  injectorInstance(storeInstance, { key: scope, reducer: wrappedReducer })
}

const wrapReducer = (scope, reducer) => {
  return (state, action) => {
    if (!action['__SCOPE'] || action['__SCOPE'] === scope) {
      return reducer(state, action)
    } else {
      return state
    }
  }
}
