import React from 'react'
import { Link } from 'react-router'
import BaseComponent from '../BaseComponent'
import cookie from 'react-cookie'

var packageId = cookie.load('PACKAGE_ID') || __PACKAGE_ID__ || '__PACKAGE_ID__ NOT SET!!!'

export default class SecureLink extends BaseComponent {
  constructor (props) {
    super(props)
    super.bindFunctions()
  }

  render () {
    if (this.checkPermission(`+:${this.props.packageId || packageId}:${this.props.role || 'user'}:${this.props.permission}:*:*`, this.props.user, true)) {
      return (
        <li><Link to={this.props.to} activeClassName='active'><i className={`fa ${this.props.icon}`} aria-hidden='true' /> {this.props.label}</Link></li>
      )
    }
  }
}

SecureLink.propTypes = {
  packageId: React.PropTypes.string,
  user: React.PropTypes.object.isRequired,
  role: React.PropTypes.string,
  permission: React.PropTypes.string.isRequired,
  icon: React.PropTypes.string.isRequired,
  label: React.PropTypes.string.isRequired,
  to: React.PropTypes.string.isRequired
}
