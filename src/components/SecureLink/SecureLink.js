import React from 'react'
import { Link } from 'react-router'
import BaseComponent from '../BaseComponent'
import PackageInformation from '../../PackageInformation'

export default class SecureLink extends BaseComponent {
  constructor (props) {
    super(props)
    super.bindFunctions()
  }

  render () {
    if (this.checkPermission(`+:${this.props.packageId || PackageInformation.packageId}:${this.props.role || 'user'}:${this.props.permission}:*:*`, this.props.user, true)) {
      return (
        <Link to={this.props.to} activeClassName='active'>{this.props.children}</Link>
      )
    } else {
      return <span />
    }
  }
}

SecureLink.propTypes = {
  children: React.PropTypes.any,
  packageId: React.PropTypes.string,
  user: React.PropTypes.object.isRequired,
  role: React.PropTypes.string,
  permission: React.PropTypes.string.isRequired,
  to: React.PropTypes.string.isRequired
}
