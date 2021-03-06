import React from 'react'
import { Link } from 'react-router'
import BaseComponent from '../BaseComponent'
import FeedbackButton from '../FeedbackButton'
import ReleaseNotesButton from '../ReleaseNotesButton'
import PackagesDropdown from '../PackagesDropdown'
import PackageInformation from '../../PackageInformation'
import LoggedInUser from '../LoggedInUser'

class Header extends BaseComponent {
  constructor(props) {
    super(props)
    super.bindFunctions()
  }

  renderMenuItemChildren(parentText, children) {
    const linkChildren = children.map((link, li) => {
      const badge =
        link.badgeCount > 0 ? (
          <span className={`badge ${link.badgeClass}`}>{link.badgeCount}</span>
        ) : null

      return (
        <Link
          key={link.text}
          to={link.url}
          role="user"
          label={link.text}
          className="dropdown-item nav-link">
          <li key={`menu-${parentText}-${li}-${link.text}`}>
            <i className={link.faIcon} /> {link.text} {badge}
          </li>
        </Link>
      )
    })

    return (
      <ul
        style={{ backgroundColor: this.props.backgroundColor, borderColor: 'transparent' }}
        className="dropdown-menu"
        aria-labelledby={`${parentText}Dropdown`}>
        {linkChildren}
      </ul>
    )
  }

  renderMenuItems() {
    if (this.props.menuItems) {
      const linkElements = this.props.menuItems.map((link, lIndex) => {
        if (link.children && link.children.length > 0) {
          const badge =
            link.badgeCount > 0 ? (
              <span className={`badge ${link.badgeClass}`}>{link.badgeCount}</span>
            ) : null

          return (
            <li key={`menu-${link.text}-${lIndex}`} className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id={`${link.text}Dropdown`}
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false">
                <i className={link.faIcon} /> {link.text} {badge}
              </a>
              {this.renderMenuItemChildren(link.text, link.children)}
            </li>
          )
        } else {
          const badge =
            link.badgeCount > 0 ? (
              <span className={`badge ${link.badgeClass}`}>{link.badgeCount}</span>
            ) : null

          return (
            <Link key={link.text} to={link.url} className="nav-item nav-link" label={link.text}>
              <li key={`menu-${link.text}-${lIndex}`}>
                <i className={link.faIcon} aria-hidden="true" /> {link.text} {badge}
              </li>
            </Link>
          )
        }
      })

      return <ul className="nav navbar-nav">{linkElements}</ul>
    } else {
      return <ul className="nav navbar-nav" />
    }
  }

  renderActionIcons() {
    // this could eventually render an array of buttons
    return <li className="my-auto">{this.props.actionIcons}</li>
  }

  render() {
    const navBarStyle = {
      backgroundColor: this.props.backgroundColor || PackageInformation.color || 'black',
      color: this.props.foregroundColor || 'white'
    }

    return (
      <nav className="navbar navbar-expand-md navbar-dark" style={navBarStyle}>
        <PackagesDropdown />
        <button
          className="navbar-toggler navbar-toggler-right"
          type="button"
          data-toggle="collapse"
          data-target="#header-menu"
          aria-controls="header-menu"
          aria-expanded="false"
          aria-label="Toggle navigation">
          <span className="navbar-toggler-icon" />
        </button>

        <div
          id="header-menu"
          className="collapse navbar-collapse"
          style={{ backgroundColor: this.props.backgroundColor }}>
          {this.renderMenuItems()}
          <div style={{ flex: 1 }}>
            <ul className="navbar-nav justify-content-end">
              {this.renderActionIcons()}
              <li className="my-auto d-md-none d-lg-block">
                <ReleaseNotesButton
                  packageName={PackageInformation.name}
                  packageCommit={PackageInformation.commit}
                  packageVersion={PackageInformation.version}
                  buttonClassName="nav-link"
                  packageBuildTime={PackageInformation.buildTime}
                  releaseNotes={PackageInformation.releaseNotes || {}}
                />
              </li>
              <li className="my-auto d-md-none d-lg-block">
                <FeedbackButton
                  hubUrl={window.__HUB_URL__}
                  icon="fa-smile-o"
                  className="nav-link"
                  user={this.props.user}
                />
              </li>
              <LoggedInUser
                user={this.props.user}
                profileDropdownItems={this.props.profileDropdownItems}
                flushNotificationQueue={this.props.flushNotificationQueue}
                isFlushingNotificationQueue={this.props.isFlushingNotificationQueue}
              />
            </ul>
          </div>
        </div>
      </nav>
    )
  }
}

Header.propTypes = {}

export default Header
