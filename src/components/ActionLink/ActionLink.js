import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

export class ActionLink extends React.Component {
  render () {
    const btnClasses = classNames('btn btn-link', this.props.className, {
      'btn-sm': this.props.size === 'sm',
      'btn-lg': this.props.size === 'lg',
      'btn-xs': this.props.size === 'xs'
    })

    return (
      <button id={this.props.id} className={btnClasses} onClick={this.props.onClick}>
        {this.props.children}
      </button>
    )
  }
}

ActionLink.propTypes = Object.assign({}, React.Component.propTypes, {
  onClick: PropTypes.func,
  size: PropTypes.oneOf([ 'sm', 'md', 'lg', 'xs' ])
})

export default ActionLink
