import PackageInformation from '../PackageInformation'

export function decodeJWT (token) {
  try {
    const parts = token.split('.')
    const buffer = Buffer.from(parts[1], 'base64')
    return JSON.parse(buffer.toString('utf8'))
  } catch (e) {
    return null
  }
}

export function getAuthorizeUrl (returnPath) {
  let authorizeUrl = `${window.__HUB_URL__}/users/authorize?packageid=${encodeURIComponent(PackageInformation.packageId)}`
  if (returnPath) {
    authorizeUrl += `&return=${encodeURIComponent(returnPath)}`
  }
  if (window.__DEV__) {
    authorizeUrl += `&redirect=${encodeURIComponent(location.origin)}`
  }
  return authorizeUrl
}
