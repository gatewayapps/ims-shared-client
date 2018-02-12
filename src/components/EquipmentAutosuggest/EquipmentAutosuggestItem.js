import React from 'react'
import PropTypes from 'prop-types'
import '../../styles/EquipmentAutosuggestItem.css'

export class EquipmentAutosuggestItem extends React.Component {
  render () {
    return (
      <div className='ims-equipment-autosuggest-item__container'>
        <div className='ims-equipment-autosuggest-item__name'>{this.props.equipment.name}</div>
        <div className='ims-equipment-autosuggest-item__area-path'>{this.props.equipment.areaPath}</div>
      </div>
    )
  }
}

EquipmentAutosuggestItem.propTypes = {
  equipment: PropTypes.shape({
    name: PropTypes.string.isRequired,
    equipmentType: PropTypes.string,
    areaPath: PropTypes.string
  }).isRequired
}

export default EquipmentAutosuggestItem
