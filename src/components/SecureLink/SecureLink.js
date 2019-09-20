import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import BaseComponent from '../BaseComponent'
import PackageInformation from '../../PackageInformation'

export default class SecureLink extends BaseComponent {
  constructor(props) {
    super(props)
    super.bindFunctions()
  }

  render() {
    if (
      this.checkPermission(
        `+:${this.props.packageId || PackageInformation.packageId}:${this.props.role || 'user'}:${
          this.props.permission
        }:*:*`,
        this.props.user,
        true
      )
    ) {
      return (
        <Link to={this.props.to} activeClassName="active" className={this.props.className}>
          {this.props.children}
        </Link>
      )
    } else {
      return null
    }
  }
}

SecureLink.propTypes = {
  children: PropTypes.any,
  packageId: PropTypes.string,
  user: PropTypes.object.isRequired,
  role: PropTypes.string,
  permission: PropTypes.string.isRequired,
  className: PropTypes.any,
  to: PropTypes.string.isRequired
}
