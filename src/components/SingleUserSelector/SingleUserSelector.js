import React from 'react'
import classNames from 'classnames'
import DisplayName from '../DisplayName'
import UserAutosuggest from '../UserAutosuggest'
import '../../styles/SingleUserSelector.css'

export class SingleUserSelector extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      selectMode: false
    }
  }

  _onCancel () {
    this.setState({
      selectMode: false
    })
  }

  _onSelect (suggestion) {
    this.props.onChange(suggestion)
    this.setState({
      selectMode: false
    })
  }

  _onShowSelectMode () {
    this.setState({
      selectMode: true
    })
  }

  _renderDisplayMode () {
    if (this.props.renderSelectedUser) {
      return this.props.renderSelectedUser()
    } else {
      const buttonClasses = classNames('btn btn-link', {
        'btn-sm': this.props.size === 'sm',
        'btn-lg': this.props.size === 'lg',
        'btn-xs': this.props.size === 'xs'
      })

      return (
        <div>
          <DisplayName
            className='ims-single-user-selector__display-name'
            user={this.props.value} />
          <button
            className={buttonClasses}
            onClick={() => this._onShowSelectMode()}>
            <i className='fa fa-user' /> {this.props.label || 'Choose Employee'}
          </button>
        </div>
      )
    }
  }

  _renderSelectMode () {
    const buttonClasses = classNames('btn btn-link', {
      'btn-sm': this.props.size === 'sm',
      'btn-lg': this.props.size === 'lg',
      'btn-xs': this.props.size === 'xs'
    })

    return (
      <div className='ims-single-user-selector__select-container'>
        <div className='ims-single-user-selector__select-container-input'>
          <UserAutosuggest
            autosuggestId={this.props.autosuggestId}
            hubUrl={this.props.hubUrl}
            onSelect={(s) => this._onSelect(s)}
            inputProps={this.props.inputProps}
            packageId={this.props.packageId}
            placeholder={this.props.placeholder}
            tokens={this.props.tokens} />
        </div>
        <div className='ims-single-user-selector__select-container-cancel'>
          <button
            className={buttonClasses}
            onClick={() => this._onCancel()}>
            Cancel
          </button>
        </div>
      </div>
    )
  }

  render () {
    if (this.state.selectMode === true) {
      return this._renderSelectMode()
    } else {
      return this._renderDisplayMode()
    }
  }
}

SingleUserSelector.propTypes = {
  autosuggestId: React.PropTypes.string,
  hubUrl: React.PropTypes.string.isRequired,
  inputProps: React.PropTypes.object,
  label: React.PropTypes.string,
  renderSelectedUser: React.PropTypes.func,
  onChange: React.PropTypes.func.isRequired,
  packageId: React.PropTypes.string.isRequired,
  placeholder: React.PropTypes.string,
  size: React.PropTypes.oneOf(['sm', 'md', 'lg', 'xs']),
  tokens: React.PropTypes.shape({
    accessToken: React.PropTypes.string.isRequired,
    expires: React.PropTypes.number.isRequired,
    refreshToken: React.PropTypes.string.isRequired
  }),
  value: React.PropTypes.shape({
    userAccountId: React.PropTypes.number.isRequired,
    firstName: React.PropTypes.string.isRequired,
    lastName: React.PropTypes.string.isRequired,
    displayName: React.PropTypes.string
  })
}

export default SingleUserSelector
