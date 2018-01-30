import React from 'react'
import PropTypes from 'prop-types'
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
export default class ConfirmationModal extends React.Component {
  render () {
      return (
        <Modal isOpen toggle={this.props.onCancel} >
          {this.props.header ? <ModalHeader closeButton>
            {this.props.header}
          </ModalHeader> : null}
          <ModalBody>
            {this.props.actionMessage}
          </ModalBody>
          <ModalFooter>
            <button type='button' className='btn btn-secondary' onClick={this.props.onCancel}>{this.props.cancelButtonContent}</button>
            <button type='button' className={this.props.confirmButtonClassNames || 'btn btn-primary'} onClick={this.props.onConfirm}>
              {this.props.confirmButtonContent}
            </button>
          </ModalFooter>
        </Modal>
      )
  }
}

ConfirmationModal.propTypes = Object.assign({}, React.Component.propTypes, {
  header: PropTypes.string,
  confirmButtonContent: PropTypes.any,
  confirmButtonClassNames: PropTypes.string,
  cancelButtonContent: PropTypes.any,
  actionMessage: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
})
