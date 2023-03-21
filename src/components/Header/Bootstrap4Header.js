import React from 'react'
import { Link } from 'react-router'
import FeedbackButton from '../FeedbackButton'
import ReleaseNotesButton from '../ReleaseNotesButton'
import PackagesDropdown from '../PackagesDropdown'
import PackageInformation from '../../PackageInformation'
import LoggedInUser from '../LoggedInUser'

class Bootstrap4Header extends React.PureComponent {
  renderMenuItemChildren (parentText, children) {
    const linkChildren = children.map((link) => {
      const badge = link.badgeCount > 0 ? <span className={`badge ${link.badgeClass}`}>{link.badgeCount}</span> : null

      return (
        <Link key={link.text} to={link.url} label={link.text}>
          <li key={link.text} className='dropdown-item nav-link'>

            <i className={link.faIcon} /> {link.text} {badge}

          </li>
        </Link>
      )
    })

    return (
      <ul style={{ backgroundColor:this.props.backgroundColor, borderColor:'transparent' }}
        className='dropdown-menu' aria-labelledby={`${parentText}Dropdown`}>
        {linkChildren}
      </ul>
    )
  }

  renderMenuItems () {
    if (this.props.menuItems) {
      const linkElements = this.props.menuItems.map((link) => {
        if (link.children && link.children.length > 0) {
          const badge = link.badgeCount > 0 ? <span className={`badge ${link.badgeClass}`}>{link.badgeCount}</span> : null

          return (
            <li className='nav-item dropdown'>
              <a className='nav-link dropdown-toggle' href='#' id={`${link.text}Dropdown`}
                data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>
                <i className={link.faIcon} /> {link.text} {badge}
              </a>
              {this.renderMenuItemChildren(link.text, link.children)}
            </li>
          )
        } else {
          const badge = link.badgeCount > 0 ? <span className={`badge ${link.badgeClass}`}>{link.badgeCount}</span> : null

          return (
            <Link key={link.text} to={link.url} className='nav-link' label={link.text}>
              <li key={link.text} className='nav-item'>

                <i className={link.faIcon} aria-hidden='true' /> {link.text} {badge}

              </li>
            </Link>
          )
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

  renderActionIcons () {
    // this could eventually render an array of buttons
    return (
      <li className='my-auto'>
        {this.props.actionIcons}
      </li>
    )
  }

  render () {
    const navBarStyle = {
      backgroundColor: this.props.backgroundColor || PackageInformation.color || 'black',
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
          {this.renderMenuItems()}
          <div style={{ flex: 1 }}>
            <ul className='navbar-nav justify-content-end'>
              {this.renderActionIcons()}
              <li className='my-auto d-md-none d-lg-block'>
                <ReleaseNotesButton
                  bootstrapVersion={this.props.bootstrapVersion}
                  packageName={PackageInformation.name}
                  packageCommit={PackageInformation.commit}
                  packageVersion={PackageInformation.version}
                  buttonClassName='nav-link'
                  packageBuildTime={PackageInformation.buildTime}
                  releaseNotes={PackageInformation.releaseNotes || {}} />
              </li>
              <li className='my-auto d-md-none d-lg-block'>
                <FeedbackButton bootstrapVersion={this.props.bootstrapVersion} hubUrl={window.__HUB_URL__}
                  icon='fa-smile-o' className='nav-link' user={this.props.user} />
              </li>
              <LoggedInUser
                bootstrapVersion={this.props.bootstrapVersion}
                user={this.props.user}
                logout={this.props.logout}

                profileDropdownItems={this.props.profileDropdownItems} />
            </ul>
          </div>
        </div>
      </nav>
    )
  }
}

Bootstrap4Header.propTypes = {
  bootstrapVersion: React.PropTypes.number,
  user: React.PropTypes.object,
  logout: React.PropTypes.func.isRequired,
  profileDropdownItems: React.PropTypes.any,
  backgroundColor: React.PropTypes.string,
  foregroundColor: React.PropTypes.string,
  actionIcons: React.PropTypes.any,
  menuItems: React.PropTypes.array
}

export default Bootstrap4Header