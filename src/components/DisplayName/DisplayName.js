import React from 'react'

export class DisplayName extends React.Component {
  render () {
    if (!this.props.user) {
      return null
    } else if (this.props.user.displayName) {
      return (<span {...this.props}>{this.props.user.displayName}</span>)
    } else {
      return (<span {...this.props}>{this.props.user.firstName} {this.props.user.lastName}</span>)
    }
  }
}

DisplayName.propTypes = {
  user: React.PropTypes.shape({
    firstName: React.PropTypes.string.isRequired,
    lastName: React.PropTypes.string.isRequired,
    displayName: React.PropTypes.string
  })
}

export default DisplayName
