import React from 'react'
import PropTypes from 'prop-types'
import '../../styles/UserAutosuggestItem.css'

export class UserAutosuggestItem extends React.Component {
  render () {
    return (
      <div className='ims-user-autosuggest-item__container'>
        <div className='ims-user-autosuggest-item__profile-image'>
          {this.renderProfileImage()}
        </div>
        <div className='ims-user-autosuggest-item__info-box'>
          <div className='ims-user-autosuggest-item__name'>{this.getUserName()}</div>
          <div className='ims-user-autosuggest-item__position'>{this.props.user.positionPath}</div>
        </div>
      </div>
    )
  }

  getUserName () {
    if (this.props.user.displayName) {
      return this.props.user.displayName
    } else {
      return this.props.user.firstName + ' ' + this.props.user.lastName
    }
  }

  renderProfileImage () {
    if (this.props.user.profileImageUrl) {
      return (<img className='img-circle' height={30} width={30} src={this.props.user.profileImageUrl} />)
    } else {
      return (<span><strong className='fa fa-user-o fa-2x' /></span>)
    }
  }
}

UserAutosuggestItem.propTypes = {
  user: PropTypes.shape({
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    displayName: PropTypes.string,
    positionPath: PropTypes.string,
    profileImageUrl: PropTypes.string
  }).isRequired
}

export default UserAutosuggestItem
