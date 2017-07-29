import React from 'react'
import Modal from 'react-bootstrap-modal'

export class ConfirmationModal extends React.Component {
  constructor (props) {
    super(props)
  }

  render () {
    return (
      <Modal onHide={() => this.props.onCancel} aria-labelledby='confirmHeader'>
        {this.props.header ? <Modal.Header closeButton>
          <Modal.Title id='confirmHeader'>{this.props.header}</Modal.Title>
        </Modal.Header> : null}
        <Modal.Body>
          {this.props.actionMessage}
        </Modal.Body>
        <Modal.Footer>
          <Modal.Dismiss className='btn btn-link text-default'>
            {this.props.cancelButtonContent}
          </Modal.Dismiss>
          <button type='button' className={this.props.confirmButtonClassNames || 'btn btn-primary'} onClick={this.props.onConfirm}>
            {this.props.confirmButtonContent}
          </button>
        </Modal.Footer>
      </Modal>
    )
  }
}

ConfirmationModal.propTypes = Object.assign({}, React.Component.propTypes, {
  header: React.PropTypes.string,
  confirmButtonContent: React.PropTypes.any,
  confirmButtonClassNames: React.PropTypes.string,
  cancelButtonContent: React.PropTypes.any,
  actionMessage: React.PropTypes.string.isRequired,
  onConfirm: React.PropTypes.func.isRequired,
  onCancel: React.PropTypes.func.isRequired
})

export default ConfirmationModal
