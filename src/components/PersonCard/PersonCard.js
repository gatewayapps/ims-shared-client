import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import moment from 'moment'
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
    const subtitleClasses = classNames('ims-card__subtitle ims-person-card__subtitle', {
      'ims-person-card__subtitle--double': this.props.showHireDate || this.props.showPositionStartDate
    })

    const hireDate = this.props.showHireDate && this.props.person.hireDate
      ? (<span>Hired {moment(this.props.person.hireDate).format('M/D/YYYY')}</span>)
      : null

    const positionDate = this.props.showPositionStartDate && this.props.person.showPositionStartDate
      ? (<span>Position {moment(this.props.person.positionStartDate).format('M/D/YYYY')}</span>)
      : null

    return (
      <div className={'ims-person-card__header-container'}>
        <div className={'ims-person-card__header-left-container'}>
          <UserProfileImage src={this.props.person.profileImageUrl} />
        </div>
        <div className={'ims-person-card__header-right-container'}>
          <div className={'ims-card__title'}>
            <DisplayName user={this.props.person} />
          </div>
          <div className={subtitleClasses}>
            <div className={'ims-person-card__text-ellipsis'} title={this.props.person.positionPath}>
              <NodePath path={this.props.person.positionPath} removeFirst />
            </div>
            <div>
              {hireDate} {positionDate}
            </div>
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
  person: PropTypes.shape({
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    displayName: PropTypes.string,
    positionPath: PropTypes.string,
    hireDate: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(moment),
      PropTypes.object
    ]),
    positionStartDate: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(moment),
      PropTypes.object
    ])
  }).isRequired,
  showHireDate: PropTypes.bool,
  showPositionStartDate: PropTypes.bool
})

export default PersonCard
