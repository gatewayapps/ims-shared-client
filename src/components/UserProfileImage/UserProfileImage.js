import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import '../../styles/UserProfileImage.css'

export class UserProfileImage extends React.Component {
  render () {
    if (this.props.src) {
      const imgClasses = classNames('img-circle', 'ims-user-profile-image__profile-image')
      return (<img className={imgClasses} height={30} width={30} src={this.props.src} />)
    } else {
      return (<span><strong className='fa fa-user-o fa-2x' /></span>)
    }
  }
}

UserProfileImage.propTypes = {
  src: PropTypes.string
}

export default UserProfileImage
