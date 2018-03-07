import React from 'react'
import ModalOld from 'react-bootstrap-modal'
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import showdown from 'showdown'
import { getItem, setItem } from '../../utils/localStorage'
import PackageInformation from '../../PackageInformation'
import '../../styles/animate.min.css'
import classNames from 'classnames'

const RELEASE_NOTES_STORAGE_KEY = 'RELEASE_NOTES_LAST_VERSION'

// This is probably not the best approach, there are several listed here:
// http://stackoverflow.com/questions/1043339/javascript-for-detecting-browser-language-preference
// The best is probably sending a cookie with the user's preferred language

const language = window.navigator.userLanguage || window.navigator.language
const converter = new showdown.Converter()

export class ReleaseNotesButton extends React.Component {
  constructor (props) {
    super(props)
    this.state = { show: false, isNew: false }
    this.compareVersion()
  }

  compareVersion () {
    getItem(RELEASE_NOTES_STORAGE_KEY).then((lastVersion) => {
      if (!lastVersion || lastVersion !== PackageInformation.version) {
        this.setState({ isNew: true })
      }
    })
  }

  _onHide () {
    this.setState({ show: false, sending: false })
  }

  _showPrompt () {
    this.setState({ show: true, isNew: false })
    setItem(RELEASE_NOTES_STORAGE_KEY, PackageInformation.version)
  }

  getReleaseLocale (release) {
    if (release && release.notes) {
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
    } if (release && release.locales) {
      // new style from Parcel
      const l = release.locales.find((l) => l.locale === language)
      if (l) {
        return l
      } else {
        return release.locales[0]
      }
    } else {
      return undefined
    }
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
    if (releaseLocale) {
      const notes = releaseLocale.items || releaseLocale.notes || []
      const key = release.major + '-' + release.minor + '-' + release.patch
      return (
        <div key={key}>
          {this.renderReleaseHeader(release)}
          <table className='table table-condensed table-sm'>
            <tbody>

              {notes.map((i, index) => this.renderItem(i, index, key))}
            </tbody>
          </table>
        </div>)
    } else {
      return <div key='no-release-info'><h4>No release information available</h4></div>
    }
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
  renderItem (item, index, key) {
    if (this.props.renderItem) {
      return this.props.renderItem(item, index, key)
    }
    var icon = this.getIcon(item)

    return <tr key={`release-note-${index}-${key}`} style={{ verticalAlign: 'top' }}>
      <td style={{ verticalAlign: 'top', paddingRight: '5px', width: '30px' }}>
        {icon}
      </td>
      <td style={{ verticalAlign: 'top' }}>
        <span dangerouslySetInnerHTML={{ __html: converter.makeHtml(item.description) }} />
      </td>
    </tr>
  }

  render () {
    const animatedProperty = `animated ${this.props.newAnimationEffect}`
    const btnClasses = classNames('btn btn-link', this.props.buttonClassName, {
      'btn-sm': this.props.size === 'sm',
      'btn-lg': this.props.size === 'lg',
      'btn-xs': this.props.size === 'xs',
      [animatedProperty]: this.state.isNew
    })

    let releasesContent
    if (PackageInformation.releaseNotes && typeof PackageInformation.releaseNotes === 'string') {
      releasesContent = <div dangerouslySetInnerHTML={{ __html: PackageInformation.releaseNotes }} />
    } else {
      const releases = PackageInformation.releaseNotes instanceof Array
      ? PackageInformation.releaseNotes
      : [PackageInformation.releaseNotes]
      releasesContent = releases.map((rn) => this.renderRelease(rn))
    }

    // Old PackageInformations contained a single release
    // This should wrap old releases as an array so everything continues working

    if (this.props.bootstrapVersion === 3) {
      return (
        <button id='whats-new-button' style={this.props.buttonStyle} className={btnClasses} title={this.props.buttonTitle} onClick={() => this._showPrompt()}>
          <i className={`fa fa-fw ${this.props.buttonIcon}`} />
          <ModalOld show={this.state.show} onHide={() => this._onHide()} >
            <ModalOld.Header closeButton>
              <ModalOld.Title>{this.props.modalTitle || `What's New in ${PackageInformation.name}`}</ModalOld.Title>
            </ModalOld.Header>
            <ModalOld.Body>
              <div style={{ maxHeight: '600px', overflowY: 'auto' }} >
                {releasesContent}
              </div>
            </ModalOld.Body>
            <ModalOld.Footer>
              <ModalOld.Dismiss className='btn btn-link text-default'>
                <i className='fa fa-times' aria-hidden='true' /> Close
            </ModalOld.Dismiss>
            </ModalOld.Footer>
          </ModalOld>
        </button>
      )
    } else {
      return (
        <span>
          <button id='whats-new-button' style={this.props.buttonStyle} className={btnClasses} title={this.props.buttonTitle} onClick={() => this._showPrompt()}>
            <i className={`fa fa-fw ${this.props.buttonIcon}`} />
            <Modal zIndex={this.props.zIndex} isOpen={this.state.show} toggle={() => this._onHide()}>
              <ModalHeader>
                {this.props.modalTitle || `What's New in ${PackageInformation.name}`}
              </ModalHeader>
              <ModalBody>
                <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                  {releasesContent}
                </div>
              </ModalBody>
              <ModalFooter>
                <button className='btn btn-secondary' onClick={() => this._onHide()}><i className='fa fa-times' aria-hidden='true' /> Close</button>
              </ModalFooter>
            </Modal>
          </button>
        </span>
      )
    }
  }
}

ReleaseNotesButton.propTypes = Object.assign({}, React.Component.propTypes, {
  buttonClassName: React.PropTypes.string,
  buttonIcon: React.PropTypes.string,
  size: React.PropTypes.string,
  buttonTitle: React.PropTypes.string,
  modalTitle: React.PropTypes.string,
  buttonStyle: React.PropTypes.object,
  getIcon: React.PropTypes.func,
  renderRelease: React.PropTypes.func,
  renderReleaseHeader: React.PropTypes.func,
  renderItem: React.PropTypes.func,
  getReleaseLocale: React.PropTypes.func,
  newAnimationEffect: React.PropTypes.string,
  bootstrapVersion: React.PropTypes.number,
  zIndex: React.PropTypes.oneOfType([
    React.PropTypes.number,
    React.PropTypes.string
  ])
})

ReleaseNotesButton.defaultProps = {
  buttonIcon: 'fa-gift',
  newAnimationEffect: 'infinite rubberBand',
  buttonTitle: `What's New?`,
  bootstrapVersion: 3,
  zIndex: 1050
}

export default ReleaseNotesButton
