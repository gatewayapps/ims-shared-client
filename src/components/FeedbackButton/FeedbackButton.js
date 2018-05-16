import React from 'react'
import PropTypes from 'prop-types'
import request from '../../utils/request'
import PackageInformation from '../../PackageInformation'
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import classNames from 'classnames'

export class FeedbackButton extends React.Component {
  constructor (props) {
    super(props)
    this.state = { sending: false }
  }
  _onSendFeedback () {
    this.setState({ sending: true })
    return request(`${this.props.hubUrl}/feedback`, {
      method: 'POST',
      body: JSON.stringify({
        user: this.props.user,
        type: this.refs.lstFeedbackType.value,
        description: this.refs.txtDescription.value,
        packageId: PackageInformation.packageId,
        packageVersion: PackageInformation.version,
        packageCommit: PackageInformation.commit
      })
    }).then(() => {
      this.setState({ show: false, sending: false })
    })
  }

  _onHide () {
    this.setState({ show: false, sending: false })
  }

  _showPrompt () {
    this.setState({ show: true })
  }

  renderBody () {
    return (
      <form className='form-horizontal'>
        <div className='form-group'>
          <label className='col-sm-2 control-label'>Type</label>
          <div className='col-sm-10'>
            <select className='form-control' ref='lstFeedbackType'>
              <option value='bug'>Bug</option>
              <option value='feature'>Feature Request</option>
              <option value='visual'>Visual Change</option>
            </select>
          </div>
        </div>
        <div className='form-group'>
          <label className='col-sm-2 control-label'>Description</label>
          <div className='col-sm-10'>
            <textarea className='form-control' rows='3' ref='txtDescription' />
          </div>
        </div>
        <div className='form-group'>
          <label className='col-sm-2 control-label'>Package</label>
          <div className='col-sm-10'>
            <p className='form-control-static' >{PackageInformation.name} ({PackageInformation.packageId})</p>
          </div>
        </div>
        <div className='form-group'>
          <label className='col-sm-2 control-label'>Version</label>
          <div className='col-sm-10'>
            <p className='form-control-static' >{PackageInformation.version} ({PackageInformation.commit})</p>
            {PackageInformation.coreVersion && <p className='form-control-static' >Core: {PackageInformation.coreVersion}</p>}
            {PackageInformation.clientVersion && <p className='form-control-static' >Client: {PackageInformation.clientVersion}</p>}
          </div>
        </div>
      </form>
    )
  }

  render () {
    const btnClasses = classNames('btn btn-link', this.props.className, {
      'btn-sm': this.props.size === 'sm',
      'btn-lg': this.props.size === 'lg',
      'btn-xs': this.props.size === 'xs'
    })

    const sendIcon =
      this.state.sending ? 'fa fa-fw fa-circle-o-notch fa-spin' : 'fa fa-fw fa-send'

    return (
      <span>
        <button id='feedback-button' style={this.props.style} className={btnClasses} title='Send Feedback' onClick={() => this._showPrompt()}>
          <i className={`fa fa-fw ${this.props.icon || 'fa-question-circle'}`} /><span className='d-md-none ml-1'>Feedback</span>
        </button>
        <Modal zIndex={this.props.zIndex} isOpen={this.state.show} toggle={() => this._onHide()} >
          <ModalHeader closeButton>
            Send Feedback
          </ModalHeader>
          <ModalBody >
            {this.renderBody()}
          </ModalBody>
          <ModalFooter>
            <button className='btn btn-link text-default' onClick={() => this._onHide()}>
              <i className='fa fa-times' aria-hidden='true' /> Cancel
          </button>
            <button type='button' disabled={this.state.sending} className='btn btn-success' onClick={() => this._onSendFeedback()}>
              <i className={sendIcon} aria-hidden='true' /> {this.state.sending ? 'Sending...' : 'Send'}
            </button>
          </ModalFooter>
        </Modal>
      </span>
    )
  }
}

FeedbackButton.propTypes = Object.assign({}, React.Component.propTypes, {
  user: PropTypes.object.isRequired,
  icon: PropTypes.string,
  hubUrl: PropTypes.string.isRequired,
  zIndex: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ])
})

FeedbackButton.defaultProps = {
  zIndex: 1050
}

export default FeedbackButton
