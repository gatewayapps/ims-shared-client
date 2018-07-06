import React from 'react'
import classNames from 'classnames'
import styles from '../../styles/LoggedInUser.css'

export class Bootstrap4LoggedInUser extends React.PureComponent {
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
    const profileItems = this.props.profileDropdownItems && this.props.profileDropdownItems()

    return (
      <li className='nav-item dropdown' style={{ cursor: 'pointer' }}>
        <a
          className={anchorClasses}
          data-toggle='dropdown'
          role='button'
          aria-haspopup='true'
          aria-expanded='false'>
          {this._renderProfileImage()} {this.props.user.displayName} <span className='caret' />
        </a>
        <ul className='dropdown-menu' style={this.props.style}>
          {profileItems}
          {profileItems && <div className='dropdown-divider' />}
          <a role='button' onClick={() => { this._onLogout() }}>
            <li className='dropdown-item nav-link'>

              <i className='fa fas fa-fw fa-sign-out' /> Logout

          </li>
          </a>
        </ul>
      </li>
    )
  }
}

Bootstrap4LoggedInUser.propTypes = {
  user: React.PropTypes.object,
  style: React.PropTypes.object,
  profileDropdownItems: React.PropTypes.any,
  logout: React.PropTypes.any
}

export default Bootstrap4LoggedInUser
