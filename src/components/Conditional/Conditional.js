import React from 'react'
import PropTypes from 'prop-types'

export class ActionLink extends React.Component {
  render() {
    var shouldRender = this.props.value
      ? this.props.condition === this.props.value
      : !!this.props.condition

    return shouldRender ? this.props.children : null
  }
}

ActionLink.propTypes = Object.assign({}, React.Component.propTypes, {
  condition: PropTypes.any,
  value: PropTypes.any,
  children: PropTypes.any
})

export default ActionLink
