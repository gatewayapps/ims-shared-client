import React from 'react'
import { Link, IndexLink } from 'react-router'
import PackageInformation from '../../PackageInformation'
import PackageTile from '../PackageTile'
export default class PackagesDropdown extends React.Component {
  render () {
    const packageIcon = `fa fa-fw ${PackageInformation.icon}`
    return (
      <li className='nav-item dropdown' style={{ display: 'flex' }}>
        <IndexLink to='/' className='navbar-brand nav-link dropdown-toggle' id='packageDropDownLink' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>
          <i className={packageIcon} aria-hidden='true' /> {PackageInformation.name}
          <span className='caret' />
        </IndexLink>
        <div className='dropdown-menu' aria-labelledby='packageDropDownLink' style={{ width: '356px', padding: '3px' }} >
          {this.props.packages.map((p, index) => <PackageTile key={`${index}`} package={p} />)}
        </div>

      </li>
    )
  }
}
