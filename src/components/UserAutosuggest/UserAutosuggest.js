import React from 'react'
import Autosuggest from 'react-autosuggest'
import request from '../../utils/request'
import UserAutosuggestItem from './UserAutosuggestItem'
import '../../styles/Autosuggest.css'

export class UserAutosuggest extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      value: '',
      users: [],
      isLoading: false
    }
    this.lastRequestId = null
  }

  _getSuggestionValue (suggestion) {
    return suggestion.displayName
  }

  _renderSuggestion (suggestion) {
    return (
      <UserAutosuggestItem user={suggestion} />
    )
  }

  _loadUsers (search) {
    // Cancel the previous request
    if (this.lastRequestId !== null) {
      clearTimeout(this.lastRequestId)
    }

    this.setState({
      isLoading: true
    })

    const requestOptions = {
      method: 'POST',
      body: JSON.stringify({
        filter: search
      }),
      packageId: this.props.packageId,
      tokens: this.props.tokens,
      hubUrl: this.props.hubUrl
    }

    this.lastRequestId = setTimeout(() => {
      request(`${this.props.hubUrl}/api/userAccounts/search`, requestOptions)
        .then((result) => {
          if (result && result.success === true) {
            if (result.total === 0) {
              // No matching user accounts
              this.setState({
                isLoading: false,
                users: []
              })
            } else {
              this.setState({
                isLoading: false,
                users: result.userAccounts
              })
            }
          } else {
            // Error result from query
            this.setState({
              isLoading: false,
              error: `User search returned an error: ${result.message}`,
              users: null
            })
          }
        })
        .catch((error) => {
          // Request error
          this.setState({
            isLoading: false,
            error: `User search failed: ${error.message}`,
            users: null
          })
        })
    }, 250)
  }

  _onChange (event, { newValue }) {
    this.setState({
      value: newValue
    })
  }

  _onUserChange (value) {
    this.setState({ filter: value })
  }

  _onSuggestionsClearRequested () {
    this.setState({
      users: []
    })
  }

  _onSuggestionsFetchRequested ({ value }) {
    this._loadUsers(value)
  }

  _onSuggestionSelected (event, { suggestion }) {
    this.props.onSelect(suggestion)
    this.setState({
      value: ''
    })
  }

  render () {
    const { value, users } = this.state
    const inputProps = {
      className: 'form-control',
      placeholder: 'To add a person start typing their name...',
      value: value,
      onChange: (e, d) => this._onChange(e, d)
    }

    return (
      <Autosuggest
        id={this.props.autoSuggestId}
        suggestions={users}
        onSuggestionsFetchRequested={(e) => this._onSuggestionsFetchRequested(e)}
        onSuggestionsClearRequested={() => this._onSuggestionsClearRequested()}
        getSuggestionValue={this._getSuggestionValue}
        renderSuggestion={this._renderSuggestion}
        inputProps={inputProps}
        focusFirstSuggestion
        onSuggestionSelected={(e, d) => this._onSuggestionSelected(e, d)} />
    )
  }
}

UserAutosuggest.propTypes = Object.assign({}, React.Component, {
  autoSuggestId: React.PropTypes.string,
  hubUrl: React.PropTypes.string.isRequired,
  onSelect: React.PropTypes.func.isRequired,
  packageId: React.PropTypes.string.isRequired,
  tokens: React.PropTypes.shape({
    accessToken: React.PropTypes.string.isRequired,
    expires: React.PropTypes.number.isRequired,
    refreshToken: React.PropTypes.string.isRequired
  })
})

export default UserAutosuggest
