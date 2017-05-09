
class PackageInformation {

  configure (info) {
    if (!info.packageId) {
      throw new Error('You must provide a package id')
    }
    if (!info.version) {
      throw new Error('You must provide a version number')
    }
    if (!info.commit) {
      throw new Error('You must provide a commit hash')
    }
    Object.assign(this, info)
  }
}
export default new PackageInformation()
