/* eslint-disable camelcase */
import React from 'react'
import PropTypes from 'prop-types'
import { injectScopedReducer } from '../../utils/injectScopedReducer'

export default class ScopedComponent extends React.Component {
  constructor(props, scopeProps) {
    super(props)
    this.scopeProps = scopeProps
  }
  UNSAFE_componentWillMount() {
    injectScopedReducer(`${this.props.scope}`, this.scopeProps.reducer)
  }
}

ScopedComponent.propTypes = {
  scope: PropTypes.string.isRequired
}
