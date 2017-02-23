import React from 'react'

export class ActionLink extends React.Component {
  render () {
    var shouldRender = this.props.value ? this.props.condition === this.props.value : !!this.props.condition

    return shouldRender ? this.props.children : undefined
  }
}

ActionLink.propTypes = Object.assign({}, React.Component.propTypes, {
  condition: React.PropTypes.any,
  value: React.PropTypes.any,
  children: React.PropTypes.any
})

export default ActionLink
