import React from 'react'
import BaseComponent from '../BaseComponent'
import Card from '../Card'
import DisplayName from '../DisplayName'
import NodePath from '../NodePath'
import UserProfileImage from '../UserProfileImage'
import '../../styles/PersonCard.css'

export class PersonCard extends BaseComponent {
  constructor (props) {
    super(props)
    this.bindFunctions()
  }

  _renderPersonHeader () {
    return (
      <div className={'ims-person-card__header-container'}>
        <div className={'ims-person-card__header-left-container'}>
          <UserProfileImage src={this.props.person.profileImageUrl} />
        </div>
        <div className={'ims-person-card__header-right-container'}>
          <div className={'ims-card__title'}>
            <DisplayName user={this.props.person} />
          </div>
          <div className={'ims-card__subtitle'}>
            <NodePath path={this.props.person.positionPath} removeFirst />
          </div>
        </div>
      </div>
    )
  }

  render () {
    return (
      <Card style={this.props.style} renderHeader={this._renderPersonHeader} {...this.props} />
    )
  }
}

PersonCard.propTypes = Object.assign({}, React.Component.propTypes, {
  style: React.PropTypes.object,
  person: React.PropTypes.shape({
    firstName: React.PropTypes.string.isRequired,
    lastName: React.PropTypes.string.isRequired,
    displayName: React.PropTypes.string,
    positionPath: React.PropTypes.string
  }).isRequired
})

export default PersonCard
