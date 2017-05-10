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

  render () {
    const btnClasses = classNames('btn btn-link', this.props.className, {
      'btn-sm': this.props.size === 'sm',
      'btn-lg': this.props.size === 'lg',
      'btn-xs': this.props.size === 'xs'
    })

    let releaseLocale
    PackageInformation.releaseNotes.forEach((rl) => {
      if (rl.locale === language) {
        releaseLocale = rl
      }
    })
    if (!releaseLocale) {
      releaseLocale = PackageInformation.releaseNotes[0]
    }

    return (
      <button id='whats-new-button' style={this.props.style} className={btnClasses} title={this.props.buttonTitle || `What's New?`} onClick={() => this._showPrompt()}>
        <i className={`fa fa-fw ${this.props.icon || 'fa-gift'}`} />
        <Modal show={this.state.show} onHide={() => this._onHide()} >
          <Modal.Header closeButton>
            <Modal.Title>What's New in {PackageInformation.name} {PackageInformation.version}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <table >
              {releaseLocale.items.map((i, index) => {
                var icon = this.props.getIcon ? this.props.getIcon(i) : getIconForItem(i)

                return <tr key={`release-note-${index}`} style={{ verticalAlign: 'top' }}>
                  <td style={{ verticalAlign: 'top' }}>
                    {icon}
                  </td>
                  <td style={{ verticalAlign: 'top' }}>
                    <span dangerouslySetInnerHTML={{ __html: converter.makeHtml(i.description) }} />
                  </td>
                </tr>
              })}
            </table>
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
  buttonTitle: React.PropTypes.string,
  getIcon: React.PropTypes.func
})

function getIconForItem (item) {
  let iconClass
  for (var i = 0; i < item.tags.length; i++) {
    const t = item.tags[i]

    switch (t) {
      case 'feature' : iconClass = 'fa fa-fw fa-star text-success'; break
      case 'bug-fix' : iconClass = 'fa fa-fw fa-bug text-danger'; break
      case 'miscellaneous': iconClass = 'fa fa-fw fa-check-circle-o text-warning'; break
      default: iconClass = 'fa fa-fw fa-circle-o'; break
    }
  }
  return <i className={iconClass} />
}

export default ReleaseNotesButton
