import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

var after = function (fn, after) {
  return function () {
    var result = fn.apply(this, arguments)
    result = after.call(this, result)
    return result
  }
}

export default function connectScoped (scopeProps) {
  return connect((state, ownProps) => {
    state = state.toJS ? state.toJS() : state
    if (state[ownProps.scope]) {
      return {
        ...state[ownProps.scope],
        ...ownProps
      }
    } else {
      return ownProps
    }
  }, (dispatch, ownProps) => {
    for (var k in scopeProps.actions) {
      scopeProps.actions[k] = after(scopeProps.actions[k], (res) => {
        res['__SCOPE'] = ownProps.scope
        return res
      })
    }
    return bindActionCreators(scopeProps.actions, dispatch)
  })
}
