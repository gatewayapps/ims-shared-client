import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import BaseComponent from '../BaseComponent'
import styles from '../../styles/LoggedInUser.css'

export class LoggedInUser extends BaseComponent {
  constructor (props) {
    super(props)
    super.bindFunctions()
  }

  _hasProfileImage () {
    return !!this.props.user.profileImageUrl
  }

  _onLogout () {
    this.props.logout()
  }

  _renderProfileImage () {
    if (this._hasProfileImage()) {
      return (
        <img
          className='img-circle'
          style={{ borderRadius:'50%' }}
          height={24}
          width={24}
          src={this.props.user.profileImageUrl} />
      )
    } else {
      return (
        <span className={styles.profileIcon}>
          <strong className='fa fa-fw fa-user-circle' />
        </span>
      )
    }
  }

  render () {
    if (!this.props.user) {
      return null
    }

    const anchorClasses = classNames('nav-link dropdown-toggle', {
      [styles.profileImage]: this._hasProfileImage()
    })

    return (
      <li className='nav-item dropdown'>
        <a
          href='#'
          className={anchorClasses}
          data-toggle='dropdown'
          role='button'
          aria-haspopup='true'
          aria-expanded='false'>
          {this._renderProfileImage()} {this.props.user.displayName} <span className='caret' />
        </a>
        <ul className='dropdown-menu' style={this.props.style}>
          {this.props.profileDropdown()}
          <div className='dropdown-divider' />
          <li className='dropdown-item nav-link'>
            <a role='button' href='#' onClick={this._onLogout}>
              <i className='fa fa-fw fa-sign-out' /> Logout
            </a>
          </li>
        </ul>
      </li>
    )
  }
}

LoggedInUser.propTypes = {
  flushNotificationQueue: PropTypes.func.isRequired,
  isFlushingNotificationQueue: PropTypes.bool.isRequired,
  user: PropTypes.object,
  style: PropTypes.object
}

export default LoggedInUser
