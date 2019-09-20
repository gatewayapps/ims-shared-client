import React from 'react'
import PropTypes from 'prop-types'
export class DisplayName extends React.Component {
  render() {
    const { user, ...spanProps } = this.props
    if (!user) {
      return null
    } else if (user.displayName) {
      return <span {...spanProps}>{user.displayName}</span>
    } else {
      return (
        <span {...spanProps}>
          {user.firstName} {user.lastName}
        </span>
      )
    }
  }
}

DisplayName.propTypes = {
  user: PropTypes.shape({
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    displayName: PropTypes.string
  })
}

export default DisplayName
