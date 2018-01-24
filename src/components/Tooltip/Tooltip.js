import React from 'react'
import PropTypes from 'prop-types'
import BaseComponent from '../BaseComponent'
import '../../styles/Tooltip.css'

export default class Tooltip extends BaseComponent {
  constructor (props) {
    super(props)
    this.state = { show: false }
    this.bindFunctions()
  }

  _showPopup () {
    this.setState({ show: !this.state.show })
  }

  render () {
    const canEdit = this.checkPermission('admin:edit-tooltips')

    if (this.props.tooltip.content || this.props.tooltip.link || canEdit === true) {
      return (
        <div className='ims-tooltip-container'>
          <span className='fa fa-info-circle fa-fw' onClick={this._showPopup} />
          {this.renderPopup(canEdit)}
        </div>
      )
    } else {
      return null
    }
  }

  

  renderPopup (canEdit) {
    if (!this.state.show) {
      return null
    }
    
    return (
      <div className='ims-tooltip-popup clearfix'>
        {canEdit === true && this.renderEditButton()}
        <div className='ims-tooltip-popup-content'>
          {this.props.tooltip.content && (<div>{this.props.tooltip.content}</div>)}
          {this.props.tooltip.link && (<a href={this.props.tooltip.link} target='_blank'>more info</a>)}
        </div>
      </div>
    )
  }

  renderEditButton () {
    return (<a className='btn btn-link btn-sm pull-right' onClick={() => alert('Edit clicked for ' + this.props.id)}><i className='fa fa-fw fa-pencil' /></a>)
  }
}

Tooltip.propTypes = {
  id: PropTypes.string.isRequired,
  user: PropTypes.object,
  tooltip: PropTypes.shape({
    packageTooltipId: PropTypes.number,
    packageId: PropTypes.string.isRequired,
    tooltipId: PropTypes.string.isRequired,
    content: PropTypes.string,
    link: PropTypes.string
  }).isRequired
}
