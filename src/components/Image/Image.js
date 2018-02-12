import React from 'react'
import PropTypes from 'prop-types'
export class Image extends React.Component {
  render () {
    const {
      src,
      height,
      width,
      ...props
    } = this.props

    let qs = []

    if (height > 0) {
      qs.push(`h=${height}`)
    }

    if (width > 0) {
      qs.push(`w=${width}`)
    }

    let imgUrl = src

    if (qs.length > 0) {
      imgUrl += `?${qs.join('&')}`
    }

    return (<img src={imgUrl} {...props} />)
  }
}

Image.propTypes = {
  src: PropTypes.string.isRequired,
  height: PropTypes.number,
  width: PropTypes.number
}

export default Image
