import React from 'react'
import { Link } from 'react-router'
import FeedbackButton from '../FeedbackButton'
import ReleaseNotesButton from '../ReleaseNotesButton'
import PackagesDropdown from '../PackagesDropdown'
import PackageInformation from '../../PackageInformation'
import LoggedInUser from '../LoggedInUser'

class Bootstrap3Header extends React.PureComponent {
  componentDidMount () {
    console.log(this.props)
  }

  renderMenuItemChildren (parentText, children) {
    const linkChildren = children.map((link) => {
      const badge = link.badgeCount > 0 ? <span className={`badge ${link.badgeClass}`}>{link.badgeCount}</span> : null

      return (
        <li key={link.text} className='dropdown-item nav-link'>
          <Link key={link.text} to={link.url} label={link.text}>
            <i className={link.faIcon} /> {link.text} {badge}
          </Link>
        </li>
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
                <i className={link.faIcon} /> {link.text} {badge} <span className='caret' />
              </a>
              {this.renderMenuItemChildren(link.text, link.children)}
            </li>
          )
        } else {
          const badge = link.badgeCount > 0 ? <span className={`badge ${link.badgeClass}`}>{link.badgeCount}</span> : null

          return (
            <li key={link.text} className='nav-item'>
              <Link key={link.text} to={link.url} className='nav-link' label={link.text}>
                <i className={link.faIcon} aria-hidden='true' /> {link.text} {badge}
              </Link>
            </li>
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
      <li>
        {this.props.actionIcons}
      </li>
    )
  }

  render () {
    const navBarStyle = {
      backgroundColor: this.props.backgroundColor || PackageInformation.color || 'black',
      color: this.props.foregroundColor || 'white',
      paddingLeft: '1rem',
      paddingRight: '1rem'
    }

    const loggedInStyle = {
      backgroundColor: this.props.backgroundColor || PackageInformation.color || 'black',
      color: this.props.foregroundColor || 'white'
    }

    return (
      <nav className='navbar navbar-default' style={navBarStyle} >
        <div className='navbar-header'>
          <button className='navbar-toggle collapsed'
            type='button' data-toggle='collapse' data-target='#header-menu'
            aria-controls='header-menu' aria-expanded='false' aria-label='Toggle navigation'>
            <span className='sr-only'>Toggle navigation</span>
            <span className='icon-bar' />
            <span className='icon-bar' />
            <span className='icon-bar' />
          </button>
          <PackagesDropdown />
        </div>
        <div id='header-menu' className='collapse navbar-collapse' style={{ backgroundColor:this.props.backgroundColor }}>
          {this.renderMenuItems()}
          <ul className='nav navbar-nav navbar-right'>
            {this.renderActionIcons()}
            <li>
              <ReleaseNotesButton
                bootstrapVersion={this.props.bootstrapVersion}
                packageName={PackageInformation.name}
                packageCommit={PackageInformation.commit}
                packageVersion={PackageInformation.version}
                buttonClassName='nav-link'
                buttonStyle={{ textAlign:'left' }}
                packageBuildTime={PackageInformation.buildTime}
                releaseNotes={PackageInformation.releaseNotes || {}} />
            </li>
            <li>
              <FeedbackButton bootstrapVersion={this.props.bootstrapVersion}
                hubUrl={window.__HUB_URL__}
                style={{ textAlign:'left' }}
                icon='fa-smile-o' className='nav-link' user={this.props.user} />
            </li>
            <LoggedInUser
              bootstrapVersion={this.props.bootstrapVersion}
              user={this.props.user}
              style={loggedInStyle}
              profileDropdownItems={this.props.profileDropdownItems} />
          </ul>
        </div>
      </nav>
    )
  }
}

Bootstrap3Header.propTypes = {
  bootstrapVersion: React.PropTypes.number,
  user: React.PropTypes.object,
  profileDropdownItems: React.PropTypes.any,
  backgroundColor: React.PropTypes.string,
  foregroundColor: React.PropTypes.string,
  actionIcons: React.PropTypes.any,
  menuItems: React.PropTypes.array
}

export default Bootstrap3Header
