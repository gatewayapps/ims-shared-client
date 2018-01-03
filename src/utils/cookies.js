import { Constants } from 'ims-shared-core'

export default {
  deleteCookie,
  getCookie,
  getHubUrl
}

export function deleteCookie (name) {
  document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;'
}

// #TODO
export function deleteSpecificCookie (name, domain) {
  document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;domain=' + domain
}

export function getCookie (name) {
  var re = new RegExp(name + '=([^;]+)')
  var value = re.exec(document.cookie)
  return (value != null) ? unescape(value[1]) : null
}

export function getHubUrl () {
  return getCookie(Constants.Cookies.HubUrl)
}
