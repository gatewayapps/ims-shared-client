import React from 'react'
import { PermissionHandler } from 'ims-shared-core'
import PackageInformation from '../../PackageInformation'

export default class BaseComponent extends React.Component {
  constructor (props) {
    super(props)
    this.permHandler = new PermissionHandler({
      package: {
        id: PackageInformation.packageId
      }
    })
  }
  bindFunctions () {
    var keys = Object.getOwnPropertyNames(Object.getPrototypeOf(this))

    for (var i in keys) {
      var key = this[keys[i]]
      if (typeof key === 'function' && keys[i].indexOf('_') === 0) {
        this[keys[i]] = this[keys[i]].bind(this)
      }
    }
  }

  checkPermission (permission, userState, skipTreeNodeCheck) {
    const user = userState || this.props.user ? this.props.user : undefined

    if (!this._isUserInitialized(user)) {
      return false
    }

    return this.permHandler.checkPermission(permission, user.permissions, skipTreeNodeCheck)
  }

  _isUserInitialized (user) {
    return user && user.permissions
  }
}

BaseComponent.propTypes = {
  user: React.PropTypes.shape({
    permissions: React.PropTypes.array
  })
}
