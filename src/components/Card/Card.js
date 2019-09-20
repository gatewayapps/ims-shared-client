import React from 'react'
import PropTypes from 'prop-types'
import BaseComponent from '../BaseComponent'
import classNames from 'classnames'
import '../../styles/Card.css'

export class Card extends BaseComponent {
  constructor(props) {
    super(props)
    this.bindFunctions()
  }

  _renderHeader() {
    return (
      <div>
        <div className="ims-card__title">{this.props.title}</div>
        <div className="ims-card__subtitle">{this.props.subtitle}</div>
      </div>
    )
  }

  _renderRemoveButton() {
    if (this.props.removeButton) {
      return (
        <button
          className={classNames('btn btn-link btn-xs', 'ims-card__remove-button')}
          onClick={() => this.props.onRemove()}>
          <i className="fa fa-times text-danger" />
          <span className="sr-only">Remove</span>
        </button>
      )
    }

    return null
  }

  render() {
    const renderHeader = this.props.renderHeader || this._renderHeader

    return (
      <div className="ims-card__container" style={this.props.style}>
        <div className={classNames('clearfix', 'ims-card__header')}>
          {this._renderRemoveButton()}
          {renderHeader()}
        </div>
        <div className="ims-card__body">{this.props.children}</div>
      </div>
    )
  }
}

Card.propTypes = Object.assign({}, React.Component.propTypes, {
  title: PropTypes.node,
  subtitle: PropTypes.node,
  removeButton: PropTypes.bool,
  renderHeader: PropTypes.func,
  onRemove: PropTypes.func
})

export default Card
