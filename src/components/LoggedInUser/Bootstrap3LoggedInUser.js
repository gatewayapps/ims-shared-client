import React from 'react'
import classNames from 'classnames'
import styles from '../../styles/LoggedInUser.css'

export class Bootstrap3LoggedInUser extends React.PureComponent {
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
          <strong className='fa fa-fw fa-user-circle-o' />
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
      <li className='nav-item dropdown' style={{ cursor: 'pointer' }}>
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
          {this.props.profileDropdownItems()}
          <div className='dropdown-divider' />
          <li className='dropdown-item nav-link'>
            <a role='button' href='#' onClick={() => { this._onLogout() }}>
              <i className='fa fa-fw fa-sign-out' /> Logout
            </a>
          </li>
        </ul>
      </li>
    )
  }
}

Bootstrap3LoggedInUser.propTypes = {
  user: React.PropTypes.object,
  style: React.PropTypes.object,
  profileDropdownItems: React.PropTypes.any,
  logout: React.PropTypes.func
}

export default Bootstrap3LoggedInUser
