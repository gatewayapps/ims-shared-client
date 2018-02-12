import React from 'react'
import PropTypes from 'prop-types'
class LogoutButton extends React.Component {
  render () {
    const {
      children,
      logout,
      ...props
    } = this.props

    const content = children || (<span><i className='fa fa-fw fa-sign-out' /> Logout</span>)

    return (
      <a onClick={() => { logout() }} style={{ cursor: 'pointer' }} {...props}>
        {content}
      </a>
    )
  }
}

LogoutButton.propTypes = Object.assign({}, React.Component.propTypes, {
  logout: PropTypes.func.isRequired
})

export default LogoutButton
