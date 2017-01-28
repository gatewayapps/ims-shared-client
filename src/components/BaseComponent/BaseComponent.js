import React from 'react'
import { PermissionHandler } from 'ims-shared-core'
import cookie from 'react-cookie'

var packageId = cookie.load('PACKAGE_ID') || __PACKAGE_ID__ || '__PACKAGE_ID__ NOT SET!!!'

const permHandler = new PermissionHandler({
  package: {
    id: packageId
  }
})

export default class BaseComponent extends React.Component {
  bindFunctions () {
    var keys = Object.getOwnPropertyNames(Object.getPrototypeOf(this))

    for (var i in keys) {
      var key = this[keys[i]]
      if (typeof key === 'function' && keys[i].indexOf('_') === 0) {
        this[keys[i]] = this[keys[i]].bind(this)
      }
    }
  }

  checkPermission (permission, userState) {
    const user = userState || this.props.user ? this.props.user : undefined

    if (!this._isUserInitialized(user)) {
      return false
    }

    return permHandler.checkPermission(permission, user.permissions)
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
