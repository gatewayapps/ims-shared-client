import React from 'react'
import Modal3 from 'react-bootstrap-modal'
import classNames from 'classnames'
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
export class DeleteLink extends React.Component {
  constructor (props) {
    super(props)
    this.state = { show: false }
  }

  _onConfirmDelete () {
    this.props.onDelete()
    this.setState({ show: false })
  }

  _onHide () {
    this.setState({ show: false })
  }

  _showPrompt () {
    this.setState({ show: true })
  }

  render () {
    const btnClasses = classNames('btn btn-link', this.props.className, {
      'btn-sm': this.props.size === 'sm',
      'btn-lg': this.props.size === 'lg',
      'btn-xs': this.props.size === 'xs'
    })

    const deleteDescription = this.props.deleteDescription ? `"${this.props.deleteDescription}"` : 'this item'
    if (this.props.bootstrapVersion === 3) {
      return (
        <button id={this.props.id} className={btnClasses} onClick={() => this._showPrompt()}>
          <span className='text-danger'>{this.props.children}</span>
          <Modal3 show={this.state.show} onHide={() => this._onHide()} aria-labelledby='confirmDeleteTitle'>
            <Modal3.Header closeButton>
              <Modal3.Title id='confirmDeleteTitle'>Confirm Delete</Modal3.Title>
            </Modal3.Header>
            <Modal3.Body>
            Are you sure you want to delete {deleteDescription}?
          </Modal3.Body>
            <Modal3.Footer>
              <Modal3.Dismiss className='btn btn-link text-default'>
                <i className='fa fa-times' aria-hidden='true' /> Cancel
            </Modal3.Dismiss>
              <button type='button' className='btn btn-danger' onClick={() => this._onConfirmDelete()}>
                <i className='fa fa-trash' aria-hidden='true' /> Delete
            </button>
            </Modal3.Footer>
          </Modal3>
        </button>
      )
    } else {
      return (
        <button id={this.props.id} className={btnClasses} onClick={() => this._showPrompt()}>
          <span className='text-danger'>{this.props.children}</span>
          <Modal isOpen={this.state.show} toggle={() => this._onHide()} aria-labelledby='confirmDeleteTitle'>
            <ModalHeader>
              Confirm Delete
            </ModalHeader>
            <ModalBody>
            Are you sure you want to delete {deleteDescription}?
            </ModalBody>
            <ModalFooter>
              <button role='button' className='btn btn-link text-default' onClick={() => { this._onHide() }}>
                <i className='fa fa-times' aria-hidden='true' /> Cancel
              </button>
              <button type='button' className='btn btn-danger' onClick={() => this._onConfirmDelete()}>
                <i className='fa fa-trash' aria-hidden='true' /> Delete
            </button>
            </ModalFooter>
          </Modal>
        </button>
      )
    }
  }
}

DeleteLink.propTypes = Object.assign({}, React.Component.propTypes, {
  deleteDescription: React.PropTypes.string,
  bootstrapVersion: React.PropTypes.number,
  onDelete: React.PropTypes.func.isRequired
})

DeleteLink.defaultProps = {
  bootstrapVersion: 3
}

export default DeleteLink
