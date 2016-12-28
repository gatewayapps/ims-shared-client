import React from 'react'
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
  equipment: React.PropTypes.shape({
    name: React.PropTypes.string.isRequired,
    equipmentType: React.PropTypes.string,
    areaPath: React.PropTypes.string
  }).isRequired
}

export default EquipmentAutosuggestItem
