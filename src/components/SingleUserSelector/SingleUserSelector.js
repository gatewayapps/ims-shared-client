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
            <i className='fa fa-fw fa-user' /> {this.props.label || 'Choose Employee'}
          </button>
          {this.props.clearButton && this.props.value &&
            <button
              className={buttonClasses}
              onClick={() => this.props.onChange(undefined)}>
              <i className='fa fa-fw fa-times' /> Clear
            </button>
          }
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

    const inputProps = Object.assign({}, { autoFocus: true }, this.props.inputProps)

    return (
      <div className='ims-single-user-selector__select-container'>
        <div className='ims-single-user-selector__select-container-input'>
          <UserAutosuggest
            autosuggestId={this.props.autosuggestId}
            onSelect={(s) => this._onSelect(s)}
            inputProps={inputProps}
            placeholder={this.props.placeholder} />
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
  clearButton: React.PropTypes.bool,
  inputProps: React.PropTypes.object,
  label: React.PropTypes.string,
  renderSelectedUser: React.PropTypes.func,
  onChange: React.PropTypes.func.isRequired,
  placeholder: React.PropTypes.string,
  size: React.PropTypes.oneOf(['sm', 'md', 'lg', 'xs']),
  value: React.PropTypes.shape({
    userAccountId: React.PropTypes.number.isRequired,
    firstName: React.PropTypes.string.isRequired,
    lastName: React.PropTypes.string.isRequired,
    displayName: React.PropTypes.string
  })
}

export default SingleUserSelector
