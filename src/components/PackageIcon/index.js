import React from 'react'
import PropTypes from 'prop-types'

export default class PackageIcon extends React.PureComponent {
  render() {
    switch (this.props.package.iconSource) {
      case 'fa': {
        return <i className={`fa fa-fw ${this.props.package.icon}`} />
      }
      case 'img': {
        const imageSources = [
          `${this.props.package.url}/icons/tile-64.png`,
          `${this.props.package.url}/icons/tile-128.png 1.5x`,
          `${this.props.package.url}/icons/tile-256.png 2x`,
          `${this.props.package.url}/icons/tile-512.png 3x`
        ]
        return (
          <img
            className="package-tile-image"
            src={imageSources[0]}
            srcSet={imageSources.join(', ')}
            alt={this.props.package.name}
          />
        )
      }
      default: {
        return null
      }
    }
  }
}

PackageIcon.propTypes = {
  package: PropTypes.object.isRequired
}
