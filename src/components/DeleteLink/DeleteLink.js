import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
export class DeleteLink extends React.Component {
  constructor(props) {
    super(props)
    this.state = { show: false }
  }

  _onConfirmDelete() {
    this.props.onDelete()
    this.setState({ show: false })
  }

  _onHide() {
    this.setState({ show: false })
  }

  _showPrompt() {
    this.setState({ show: true })
  }

  render() {
    const btnClasses = classNames(
      'btn',
      this.props.useDefaultStyling ? 'btn-link' : '',
      this.props.className,
      {
        'btn-sm': this.props.size === 'sm',
        'btn-lg': this.props.size === 'lg',
        'btn-xs': this.props.size === 'xs'
      }
    )

    const deleteDescription = this.props.deleteDescription
      ? `"${this.props.deleteDescription}"`
      : 'this item'
    const spanClass = this.props.useDefaultStyling ? 'text-danger' : ''
    return (
      <button id={this.props.id} className={btnClasses} onClick={() => this._showPrompt()}>
        <span className={spanClass}>{this.props.children}</span>
        <Modal
          isOpen={this.state.show}
          toggle={() => this._onHide()}
          aria-labelledby="confirmDeleteTitle">
          <ModalHeader>Confirm Delete</ModalHeader>
          <ModalBody>Are you sure you want to delete {deleteDescription}?</ModalBody>
          <ModalFooter>
            <button
              role="button"
              className="btn btn-link text-default"
              onClick={() => {
                this._onHide()
              }}>
              <i className="fa fa-times" aria-hidden="true" /> Cancel
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => this._onConfirmDelete()}>
              <i className="fa fa-trash" aria-hidden="true" /> Delete
            </button>
          </ModalFooter>
        </Modal>
      </button>
    )
  }
}

DeleteLink.propTypes = Object.assign({}, React.Component.propTypes, {
  deleteDescription: PropTypes.string,
  useDefaultStyling: PropTypes.bool,
  onDelete: PropTypes.func.isRequired
})

DeleteLink.defaultProps = {
  useDefaultStyling: true
}

export default DeleteLink
