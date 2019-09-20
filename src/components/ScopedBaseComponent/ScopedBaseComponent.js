'use strict'
import PropTypes from 'prop-types'
import React from 'react'
import { PermissionHandler } from 'ims-shared-core'
import ScopedComponent from '../ScopedComponent'
import PackageInformation from '../../PackageInformation'

export default class ScopedBaseComponent extends ScopedComponent {
  constructor(props, scopedProps) {
    super(props, scopedProps)
    this.permHandler = new PermissionHandler({
      package: {
        id: PackageInformation.packageId
      }
    })
  }

  bindFunctions() {
    var keys = Object.getOwnPropertyNames(Object.getPrototypeOf(this))

    for (var i in keys) {
      var key = this[keys[i]]
      if (typeof key === 'function' && keys[i].indexOf('_') === 0) {
        this[keys[i]] = this[keys[i]].bind(this)
      }
    }
  }

  checkPermission(permission, userState) {
    const user = userState || this.props.user ? this.props.user : undefined

    if (!this._isUserInitialized(user)) {
      return false
    }

    return this.permHandler.checkPermission(permission, user.permissions, true)
  }

  _isUserInitialized(user) {
    return user && user.permissions
  }
}

ScopedBaseComponent.propTypes = {
  user: PropTypes.object
}
