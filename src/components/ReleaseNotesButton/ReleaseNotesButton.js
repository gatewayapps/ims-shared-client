import React from 'react'
import Modal from 'react-bootstrap-modal'
import showdown from 'showdown'

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
    this.props.releaseNotes.forEach((rl) => {
      if (rl.locale === language) {
        releaseLocale = rl
      }
    })
    if (!releaseLocale) {
      releaseLocale = this.props.releaseNotes[0]
    }

    return (
      <button id='whats-new-button' style={this.props.style} className={btnClasses} title={this.props.buttonTitle || `See What's New!`} onClick={() => this._showPrompt()}>
        <i className={`fa fa-fw ${this.props.icon || 'fa-gift'}`} />
        <Modal show={this.state.show} onHide={() => this._onHide()} >
          <Modal.Header closeButton>
            <Modal.Title>What's New in {this.props.packageName} {this.props.packageVersion}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <table >
              {releaseLocale.items.map((i, index) => {
                var icon = getIconForItem(i)

                return <tr key={`release-note-${index}`} style={{ verticalAlign: 'top' }}>
                  <td style={{ verticalAlign: 'top' }}>
                    <i className={icon} />
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
  packageName: React.PropTypes.string.isRequired,
  packageVersion: React.PropTypes.string.isRequired,
  packageCommit: React.PropTypes.string.isRequired,
  packageBuildTime: React.PropTypes.number,
  releaseNotes: React.PropTypes.array.isRequired,
  releaseHeader: React.PropTypes.string,
  buttonTitle: React.PropTypes.string
})

function getIconForItem (item) {
  for (var i = 0; i < item.tags.length; i++) {
    const t = item.tags[i]

    switch (t) {
      case 'feature' : return 'fa fa-fw fa-star text-success'
      case 'bug-fix' : return 'fa fa-fw fa-bug text-danger'
      case 'miscellaneous': return 'fa fa-fw fa-check-circle-o text-warning'
    }
  }
  return 'fa fa-fw fa-circle-o'
}

export default ReleaseNotesButton
