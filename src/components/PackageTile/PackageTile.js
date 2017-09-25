import React from 'react'
import '../../styles/PackageTile.css'
export default class PackageTile extends React.Component {
  render () {
    const packageIcon = `fa fa-fw ${this.props.package.icon}`
    const backgroundColor = this.props.package.color ? '#' + this.props.package.color.replace('#', '') : '#373737'
    return (
      <div className='package-tile' style={{ backgroundColor: backgroundColor, cursor: 'pointer' }}>
        <a className='package-tile-link' href={this.props.package.url} target='__blank'>
          <div className='package-tile-opacity' >
            <div className='package-tile-icon'><i className={packageIcon} /></div>
            <div className='package-tile-title'>{this.props.package.name}</div>

            {
              /* Badge support */
              this.props.package.badgeCount > 0
              ? <div className='package-tile-badge badge'>{this.props.package.badgeCount}</div>
              : null
            }
          </div>
        </a>
      </div>
    )
  }
}

PackageTile.propTypes = {
  package: React.PropTypes.object.isRequired
}
