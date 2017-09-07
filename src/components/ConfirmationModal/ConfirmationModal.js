import React from 'react'
import ModalOld from 'react-bootstrap-modal'
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
export default class ConfirmationModal extends React.Component {
  render () {
    if (this.props.bsVersion !== 4) {
      return (
        <ModalOld show onHide={() => this.props.onCancel} aria-labelledby='confirmHeader'>
          {this.props.header ? <ModalOld.Header closeButton>
            <ModalOld.Title id='confirmHeader'>{this.props.header}</ModalOld.Title>
          </ModalOld.Header> : null}
          <ModalOld.Body>
            {this.props.actionMessage}
          </ModalOld.Body>
          <ModalOld.Footer>
            <ModalOld.Dismiss onClick={this.props.onCancel} className='btn btn-link text-default'>
              {this.props.cancelButtonContent}
            </ModalOld.Dismiss>
            <button type='button' className={this.props.confirmButtonClassNames || 'btn btn-primary'} onClick={this.props.onConfirm}>
              {this.props.confirmButtonContent}
            </button>
          </ModalOld.Footer>
        </ModalOld>
      )
    } else {
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
}

ConfirmationModal.propTypes = Object.assign({}, React.Component.propTypes, {
  header: React.PropTypes.string,
  confirmButtonContent: React.PropTypes.any,
  confirmButtonClassNames: React.PropTypes.string,
  cancelButtonContent: React.PropTypes.any,
  actionMessage: React.PropTypes.string.isRequired,
  isOpen: React.PropTypes.bool.isRequired,
  onConfirm: React.PropTypes.func.isRequired,
  onCancel: React.PropTypes.func.isRequired,
  bsVersion: React.PropTypes.number
})
