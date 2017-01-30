import React from 'react'

export class DisplayName extends React.Component {
  render () {
    const { user, ...spanProps } = this.props
    if (!user) {
      return null
    } else if (user.displayName) {
      return (<span {...spanProps}>{user.displayName}</span>)
    } else {
      return (<span {...spanProps}>{user.firstName} {user.lastName}</span>)
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
