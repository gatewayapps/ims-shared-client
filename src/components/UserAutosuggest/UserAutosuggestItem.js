import React from 'react'
import classNames from 'classnames'
import '../../styles/UserAutosuggestItem.css'

export class UserAutosuggestItem extends React.Component {
  render () {
    const containerClasses = classNames('ims-user-autosuggest-item__container', this.props.className)

    return (
      <div className={containerClasses}>
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

UserAutosuggestItem.propTypes = Object.assign({}, React.Component.propTypes, {
  user: React.PropTypes.shape({
    firstName: React.PropTypes.string.isRequired,
    lastName: React.PropTypes.string.isRequired,
    displayName: React.PropTypes.string,
    positionPath: React.PropTypes.string,
    profileImageUrl: React.PropTypes.string
  }).isRequired
})

export default UserAutosuggestItem
