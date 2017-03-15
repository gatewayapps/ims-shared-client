import React from 'react'
import Modal from 'react-bootstrap-modal'
import classNames from 'classnames'

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
    const btnClasses = classNames('btn', this.props.className, {
      'btn-link': !this.props.button,
      'btn-danger': this.props.button,
      'btn-sm': this.props.size === 'sm',
      'btn-lg': this.props.size === 'lg',
      'btn-xs': this.props.size === 'xs'
    })

    const textClasses = classNames({
      'text-danger': !this.props.button
    })

    const deleteDescription = this.props.deleteDescription ? `"${this.props.deleteDescription}"` : 'this item'

    return (
      <button id={this.props.id} className={btnClasses} onClick={() => this._showPrompt()}>
        <span className={textClasses}>{this.props.children}</span>
        <Modal show={this.state.show} onHide={() => this._onHide()} aria-labelledby='confirmDeleteTitle'>
          <Modal.Header closeButton>
            <Modal.Title id='confirmDeleteTitle'>Confirm Delete</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete {deleteDescription}?
          </Modal.Body>
          <Modal.Footer>
            <Modal.Dismiss className='btn btn-link text-default'>
              <i className='fa fa-times' aria-hidden='true' /> Cancel
            </Modal.Dismiss>
            <button type='button' className='btn btn-danger' onClick={() => this._onConfirmDelete()}>
              <i className='fa fa-trash' aria-hidden='true' /> Delete
            </button>
          </Modal.Footer>
        </Modal>
      </button>
    )
  }
}

DeleteLink.propTypes = Object.assign({}, React.Component.propTypes, {
  deleteDescription: React.PropTypes.string,
  onDelete: React.PropTypes.func.isRequired,
  size: React.PropTypes.oneOf(['sm', 'md', 'lg']),
  button: React.PropTypes.bool
})

export default DeleteLink
