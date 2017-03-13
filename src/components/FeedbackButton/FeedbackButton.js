import React from 'react'
import Modal from 'react-bootstrap-modal'
import { getCookie } from '../../utils/cookies'
import request from '../../utils/request'
import { Constants } from 'ims-shared-core'

import classNames from 'classnames'

export class DeleteLink extends React.Component {
  constructor (props) {
    super(props)

    const packageId = getCookie(Constants.Cookies.PackageId)
    const packageVersion = getCookie(Constants.Cookies.PackageVersion)
    const packageCommit = getCookie(Constants.Cookies.PackageCommit)
    if (!packageId) {
      throw new Error('"PACKAGE_ID" cookie has not been set')
    }
    if (!packageVersion) {
      throw new Error('"PACKAGE_VERSION" cookie has not been set')
    }
    if (!packageCommit) {
      throw new Error('"PACKAGE_COMMIT" cookie has not been set')
    }

    this.state = { show: false, packageId: packageId, packageVersion: packageVersion, packageCommit: packageCommit }
  }

  _onSendFeedback () {
    const packageId = getCookie(Constants.Cookies.PackageId)
    const packageVersion = getCookie(Constants.Cookies.PackageVersion)
    const packageCommit = getCookie(Constants.Cookies.PackageCommit)
    const hubUrl = getCookie(Constants.Cookies.HubUrl)
    this.setState({ sending: true })
    return request(`${hubUrl}/feedback`, {
      method: 'POST',
      body: JSON.stringify({
        user: this.props.user,
        type: this.refs.lstFeedbackType.value,
        description: this.refs.txtDescription.value,
        packageId: packageId,
        packageVersion: packageVersion,
        packageCommit: packageCommit
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

  render () {
    const btnClasses = classNames('btn btn-link', this.props.className, {
      'btn-sm': this.props.size === 'sm',
      'btn-lg': this.props.size === 'lg',
      'btn-xs': this.props.size === 'xs'
    })

    const sendIcon =
      this.state.sending ? 'fa fa-fw fa-circle-o-notch fa-spin' : 'fa fa-fw fa-send'

    return (
      <button id={this.props.id} style={this.props.style} className={btnClasses} title='Send Feedback' onClick={() => this._showPrompt()}>
        <i className={`fa fa-fw ${this.props.icon || 'fa-question-circle-o'}`} />
        <Modal show={this.state.show} onHide={() => this._onHide()} >
          <Modal.Header closeButton>
            <Modal.Title id='confirmDeleteTitle'>Send Feedback</Modal.Title>
          </Modal.Header>
          <Modal.Body>
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
                  <p className='form-control-static' >{this.state.packageId}</p>
                </div>
              </div>
              <div className='form-group'>
                <label className='col-sm-2 control-label'>Version</label>
                <div className='col-sm-10'>
                  <p className='form-control-static' >{this.state.packageVersion} ({this.state.packageCommit})</p>
                </div>
              </div>

            </form>
          </Modal.Body>
          <Modal.Footer>
            <Modal.Dismiss className='btn btn-link text-default'>
              <i className='fa fa-times' aria-hidden='true' /> Cancel
            </Modal.Dismiss>
            <button type='button' disabled={this.state.sending} className='btn btn-success' onClick={() => this._onSendFeedback()}>
              <i className={sendIcon} aria-hidden='true' /> {this.state.sending ? 'Sending...' : 'Send'}
            </button>
          </Modal.Footer>
        </Modal>
      </button>
    )
  }
}

DeleteLink.propTypes = Object.assign({}, React.Component.propTypes, {
  user: React.PropTypes.object.isRequired,
  icon: React.PropTypes.string
})

export default DeleteLink
