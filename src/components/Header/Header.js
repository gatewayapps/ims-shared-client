import React from 'react'
import { Link } from 'react-router'
import SecureLink from '../SecureLink'
import BaseComponent from '../BaseComponent'
import FeedbackButton from '../FeedbackButton'
import ReleaseNotesButton from '../ReleaseNotesButton'
import PackagesDropdown from '../PackagesDropdown'
import PackageInformation from '../../PackageInformation'
import LoggedInUser from '../LoggedInUser'

class Header extends BaseComponent {
  constructor (props) {
    super(props)
    super.bindFunctions()
  }

  componentDidMount () {
    console.log(this.props)
  }

  renderLinkChildren (parentText, children) {
    const linkChildren = children.map((link) => {
      if (link.isSecure) {
        return (
          <li key={link.text} className='dropdown-item nav-link'>
            <SecureLink key={link.text} to={link.url} permission={link.permission} role={link.role} label={link.text} user={this.props.user}>
              <i className={link.faIcon} /> {link.text}
            </SecureLink>
          </li>
        )
      } else {
        return (
          <li key={link.text} className='dropdown-item nav-link'>
            <Link key={link.text} to={link.url} permission='can-view-trees' role='user' label={link.text}>
              <i className={link.faIcon} /> {link.text}
            </Link>
          </li>
        )
      }
    })

    return (
      <ul style={{ backgroundColor:this.props.backgroundColor, borderColor:'transparent' }}
        className='dropdown-menu' aria-labelledby={`${parentText}Dropdown`}>
        {linkChildren}
      </ul>
    )
  }

  renderLinks () {
    if (this.props.links) {
      const linkElements = this.props.links.map((link) => {
        if (link.children && link.children.length > 0) {
          return (
            <li className='nav-item dropdown'>
              <a className='nav-link dropdown-toggle' href='#' id={`${link.text}Dropdown`}
                data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>
                <i className={link.faIcon} /> {link.text}
              </a>
              {this.renderLinkChildren(link.text, link.children)}
            </li>
          )
        } else {
          if (link.isSecure) {
            return (
              <li key={link.text} className='nav-item'>
                <SecureLink key={link.text} to={link.url} className='nav-link' label={link.text} permission={link.permission} role={link.role}>
                  <i className={link.faIcon} aria-hidden='true' user={this.props.user} /> {link.text}
                </SecureLink>
              </li>
            )
          } else {
            return (
              <li key={link.text} className='nav-item'>
                <Link key={link.text} to={link.url} className='nav-link' label={link.text}>
                  <i className={link.faIcon} aria-hidden='true' /> {link.text}
                </Link>
              </li>
            )
          }
        }
      })

      return (
        <ul className='nav navbar-nav'>
          { linkElements }
        </ul>
      )
    } else {
      return (
        <ul className='nav navbar-nav' />
      )
    }
  }

  renderExtraButtons () {
    // this could eventually render an array of buttons
    return (
      <li className='my-auto'>
        {this.props.extraButton}
      </li>
    )
  }

  render () {
    const navBarStyle = {
      backgroundColor: this.props.backgroundColor || 'black',
      color: this.props.foregroundColor || 'white'
    }

    return (
      <nav className='navbar navbar-expand-md navbar-dark' style={navBarStyle} >
        <PackagesDropdown />
        <button className='navbar-toggler navbar-toggler-right'
          type='button' data-toggle='collapse' data-target='#header-menu'
          aria-controls='header-menu' aria-expanded='false' aria-label='Toggle navigation'>
          <span className='navbar-toggler-icon' />
        </button>

        <div id='header-menu' className='collapse navbar-collapse' style={{ backgroundColor:this.props.backgroundColor }}>
          {this.renderLinks()}
          <div style={{ flex: 1 }}>
            <ul className='navbar-nav justify-content-end'>
              {this.renderExtraButtons()}
              <li className='my-auto'>
                <ReleaseNotesButton
                  packageName={PackageInformation.name}
                  packageCommit={PackageInformation.commit}
                  packageVersion={PackageInformation.version}
                  buttonClassName='nav-link'
                  packageBuildTime={PackageInformation.buildTime}
                  releaseNotes={PackageInformation.releaseNotes || {}} />
              </li>
              <li className='my-auto'>
                <FeedbackButton hubUrl={window.__HUB_URL__} icon='fa-smile' className='nav-link' user={this.props.user} />
              </li>
              <LoggedInUser user={this.props.user}
                style={navBarStyle}
                Permissions={this.props.Permissions}
                profileDropdown={this.props.profileDropdown}
                flushNotificationQueue={this.props.flushNotificationQueue}
                isFlushingNotificationQueue={this.props.isFlushingNotificationQueue} />
            </ul>
          </div>
        </div>
      </nav>
    )
  }
}

Header.propTypes = {

}

export default Header
