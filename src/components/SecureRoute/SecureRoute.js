import React from 'react'
import _ from 'lodash'
import { createStructuredSelector } from 'reselect'
import { PermissionHandler } from 'ims-shared-core'
import PackageInformation from '../../PackageInformation'
import { getAuthorizeUrl } from '../../utils/auth'
import { selectCurrentUser, selectLocationState } from '../../app'

export default class SecureRoute {
  constructor (store, notAuthorizedUrl = '/notAuthorized') {
    this.store = store
    this.notAuthorizedUrl = notAuthorizedUrl
    this.permHandler = new PermissionHandler({
      package: {
        id: PackageInformation.packageId
      }
    })
  }

  onEnter (nextState, replace, callback) {
    const context = createStructuredSelector({
      route: selectLocationState(),
      currentUser: selectCurrentUser()
    })(this.store.getState())

    if (!context.currentUser.userAccountId) {
      // Use window.location here to force the request to go to the server. The server
      // handles "/users/authorize" will check windows and other auth before redirecting
      // to the local login page.
      let authorizeUrl = getAuthorizeUrl(context.route.locationBeforeTransitions.pathname)
      window.location = authorizeUrl
      return
    }

    if (_.isArray(this.requiredPermissions) && this.requiredPermissions.length > 0) {
      if (!this.permHandler.checkPermissions(this.requiredPermissions, context.currentUser.permissions)) {
        replace(this.notAuthorizedUrl)
      }
    } else {
      const requiredPermission = {
        role: this.authorize || 'user',
        action: this.permission || '*'
      }

      if (!this.permHandler.checkPermission(requiredPermission, context.currentUser.permissions)) {
        replace(this.notAuthorizedUrl)
      }
    }

    return callback()
  }
}
