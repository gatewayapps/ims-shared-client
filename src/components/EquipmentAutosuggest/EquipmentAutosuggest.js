import React from 'react'
import Autosuggest from 'react-autosuggest'
import request from '../../utils/request'
import EquipmentAutosuggestItem from './EquipmentAutosuggestItem'
import '../../styles/Autosuggest.css'

export class EquipmentAutosuggest extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      value: '',
      equipment: [],
      isLoading: false
    }
    this.lastRequestId = null
  }

  _getSuggestionValue (suggestion) {
    return suggestion.name
  }

  _renderSuggestion (suggestion) {
    return (
      <EquipmentAutosuggestItem equipment={suggestion} />
    )
  }

  _loadEquipment (search) {
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
      request(`${this.props.hubUrl}/api/equipment/search`, requestOptions)
        .then((result) => {
          if (result && result.success === true) {
            if (result.total === 0) {
              // No matching user accounts
              this.setState({
                isLoading: false,
                equipment: []
              })
            } else {
              this.setState({
                isLoading: false,
                equipment: result.equipment
              })
            }
          } else {
            // Error result from query
            this.setState({
              isLoading: false,
              error: `User search returned an error: ${result.message}`,
              equipment: null
            })
          }
        })
        .catch((error) => {
          // Request error
          this.setState({
            isLoading: false,
            error: `User search failed: ${error.message}`,
            equipment: null
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
      equipment: []
    })
  }

  _onSuggestionsFetchRequested ({ value }) {
    this._loadEquipment(value)
  }

  _onSuggestionSelected (event, { suggestion }) {
    this.props.onSelect(suggestion)
    this.setState({
      value: ''
    })
  }

  render () {
    const { value, equipment } = this.state
    const inputProps = {
      className: 'form-control',
      placeholder: 'To add equipment start typing its name...',
      value: value,
      onChange: (e, d) => this._onChange(e, d)
    }

    return (
      <Autosuggest
        id={this.props.autosuggestId}
        suggestions={equipment}
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

EquipmentAutosuggest.propTypes = Object.assign({}, React.Component, {
  autosuggestId: React.PropTypes.string,
  hubUrl: React.PropTypes.string.isRequired,
  onSelect: React.PropTypes.func.isRequired,
  packageId: React.PropTypes.string.isRequired,
  tokens: React.PropTypes.shape({
    accessToken: React.PropTypes.string.isRequired,
    expires: React.PropTypes.number.isRequired,
    refreshToken: React.PropTypes.string.isRequired
  })
})

export default EquipmentAutosuggest
