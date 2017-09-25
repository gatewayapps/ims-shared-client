import React from 'react'
import { Link, IndexLink } from 'react-router'
import PackageInformation from '../../PackageInformation'
import PackageTile from '../PackageTile'
export default class PackagesDropdown extends React.Component {
  render () {
    const packageIcon = `fa fa-fw ${PackageInformation.icon}`
    let badgeCount = 0
    for (var i = 0; i < this.props.packages.length; i++) {
      if (this.props.packages[i].badgeCount && this.props.packages[i].id !== PackageInformation.packageId) {
        badgeCount += this.props.packages[i].badgeCount
      }
    }
    return (
      <li className='nav-item dropdown' style={{ display: 'flex' }}>
        <IndexLink to='/' className='navbar-brand nav-link dropdown-toggle' id='packageDropDownLink' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>
          <i className={packageIcon} aria-hidden='true' /> {PackageInformation.name}
          <span className='caret' />
          {
            badgeCount > 0
            ? <span className='badge badge-danger'>{badgeCount}</span>
            : undefined
          }
        </IndexLink>
        <div className='dropdown-menu' aria-labelledby='packageDropDownLink' style={{ width: '356px', padding: '3px' }} >
          {this.props.packages.map((p, index) => <PackageTile key={`${index}`} package={p} />)}
        </div>

      </li>
    )
  }
}
