import React from 'react'
import Modal from 'react-bootstrap-modal'
import showdown from 'showdown'

import PackageInformation from '../../PackageInformation'

import classNames from 'classnames'

// This is probably not the best approach, there are several listed here:
// http://stackoverflow.com/questions/1043339/javascript-for-detecting-browser-language-preference
// The best is probably sending a cookie with the user's preferred language

const language = window.navigator.userLanguage || window.navigator.language
const converter = new showdown.Converter()

export class ReleaseNotesButton extends React.Component {
  constructor (props) {
    super(props)
    this.state = { show: false }
  }
  _onHide () {
    this.setState({ show: false, sending: false })
  }

  _showPrompt () {
    this.setState({ show: true })
  }

  getReleaseLocale (release) {
    let releaseLocale
    release.notes.forEach((rl) => {
      if (rl.locale === language) {
        releaseLocale = rl
      }
    })
    if (!releaseLocale) {
      releaseLocale = release.notes[0]
    }
    return releaseLocale
  }
  getIcon (item) {
    if (this.props.getIcon) {
      return this.props.getIcon(item)
    }
    let iconClass
    for (var i = 0; i < item.tags.length; i++) {
      const t = item.tags[i]

      switch (t) {
        case 'feature' : iconClass = 'fa fa-fw fa-star text-success'; break
        case 'bug-fix' : iconClass = 'fa fa-fw fa-bug text-danger'; break
        case 'miscellaneous': iconClass = 'fa fa-fw fa-check-circle-o text-warning'; break
      }
    }
    iconClass = iconClass || 'fa fa-fw fa-circle-o'
    return <i className={iconClass} />
  }
  renderRelease (release) {
    if (this.props.renderRelease) {
      return this.props.renderRelease(release)
    }
    const releaseLocale = this.getReleaseLocale(release)
    return (
      <div>
        {this.renderReleaseHeader(release)}
        <table className='table table-condensed table-striped'>
          <tbody>
            {releaseLocale.items.map((i, index) => this.renderItem(i, index))}
          </tbody>
        </table>
      </div>
    )
  }
  renderReleaseHeader (release) {
    if (this.props.renderReleaseHeader) {
      return this.props.renderReleaseHeader(release)
    }
    const releaseLocale = this.getReleaseLocale(release)
    if (releaseLocale.header) {
      if (releaseLocale.header.indexOf(release.version) === -1) {
        releaseLocale.header = `${release.version} - ${releaseLocale.header}`
      }
      return <h4><span dangerouslySetInnerHTML={{ __html: converter.makeHtml(releaseLocale.header) }} /> </h4>
    } else {
      return <h4>{release.version}</h4>
    }
  }
  renderItem (item, index) {
    if (this.props.renderItem) {
      return this.props.renderItem(item, index)
    }
    var icon = this.getIcon(item)

    return <tr key={`release-note-${index}`} style={{ verticalAlign: 'top' }}>
      <td style={{ verticalAlign: 'top', paddingRight: '5px' }}>
        {icon}
      </td>
      <td style={{ verticalAlign: 'top' }}>
        <span dangerouslySetInnerHTML={{ __html: converter.makeHtml(item.description) }} />
      </td>
    </tr>
  }

  render () {
    const btnClasses = classNames('btn btn-link', this.props.buttonClassName, {
      'btn-sm': this.props.size === 'sm',
      'btn-lg': this.props.size === 'lg',
      'btn-xs': this.props.size === 'xs'
    })

    // Old PackageInformations contained a single release
    // This should wrap old releases as an array so everything continues working
    const releases = PackageInformation.releaseNotes instanceof Array
    ? PackageInformation.releaseNotes
    : [PackageInformation.releaseNotes]

    return (
      <button id='whats-new-button' style={this.style} className={btnClasses} title={this.props.buttonTitle} onClick={() => this._showPrompt()}>
        <i className={`fa fa-fw ${this.props.buttonIcon}`} />
        <Modal show={this.state.show} onHide={() => this._onHide()} >
          <Modal.Header closeButton>
            <Modal.Title>{this.props.modalTitle || `What's New in ${PackageInformation.name}`}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
              {releases.map((rn) => this.renderRelease(rn))}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Modal.Dismiss className='btn btn-link text-default'>
              <i className='fa fa-times' aria-hidden='true' /> Close
            </Modal.Dismiss>
          </Modal.Footer>
        </Modal>
      </button>
    )
  }
}

ReleaseNotesButton.propTypes = Object.assign({}, React.Component.propTypes, {
  buttonClassName: React.PropTypes.string,
  buttonIcon: React.PropTypes.string,
  size: React.PropTypes.string,
  buttonTitle: React.PropTypes.string,
  modalTitle: React.PropTypes.string,
  getIcon: React.PropTypes.func,
  renderRelease: React.PropTypes.func,
  renderReleaseHeader: React.PropTypes.func,
  renderItem: React.PropTypes.func,
  getReleaseLocale: React.PropTypes.func
})

ReleaseNotesButton.defaultProps = {
  buttonIcon: 'fa-gift',
  buttonTitle: `What's New?`
}

export default ReleaseNotesButton
