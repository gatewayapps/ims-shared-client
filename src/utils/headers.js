import { Constants } from 'ims-shared-core'

export function createRequestHeader (packageId) {
  return {
    'accept': 'application/json',
    'content-type': 'application/json',
    [Constants.RequestHeaders.PackageId]: packageId
  }
}

export function createAuthenticatedRequestHeader (packageId, accessToken) {
  return Object.assign(createRequestHeader(packageId), {
    [Constants.RequestHeaders.Authorization]: `JWT ${accessToken}`
  })
}
