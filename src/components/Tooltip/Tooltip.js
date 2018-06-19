import classNames from 'classnames'
import React from 'react'
import { Manager, Target, Popper, Arrow } from 'react-popper'
import PropTypes from 'prop-types'
import BaseComponent from '../BaseComponent'
import TooltipEditor from './TooltipEditorContainer'
import TooltipViewer from './TooltipViewer'
import '../../styles/Tooltip.css'

export default class Tooltip extends BaseComponent {
  constructor (props) {
    super(props)
    this.state = { show: false }
    this.bindFunctions()
  }

  _onEdit (tooltip) {
    this.props.beginEdit(tooltip)
  }

  _onMouseEnter () {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout)
      this.hideTimeout = undefined
    }
    this.showTimeout = setTimeout(this._showPopup, 500)
  }

  _onMouseLeave () {
    if (this.showTimeout) {
      clearTimeout(this.showTimeout)
      this.showTimeout = undefined
    }
    this.hideTimeout = setTimeout(this._hidePopup, 1000)
  }

  _showPopup () {
    if(this.hideTimeout){
      clearTimeout(this.hideTimeout)
      this.hideTimeout = undefined
    }
    
    this.setState({ show: true })
  }

  _hidePopup () {
    if(this.showTimeout){
      clearTimeout(this.showTimeout)
      this.showTimeout = undefined
    }
    if (this.props.isEditing !== true) {
      this.setState({ show: false })
    }
  }

  _togglePopup () {
    if (this.state.show === true) {
      this._hidePopup()
    } else {
      this._showPopup()
    }
  }

  render () {
    const canEdit = this.checkPermission('admin:edit-tooltips')

    if (this.props.tooltip.content || this.props.tooltip.link || canEdit === true) {
      const iconClasses = classNames('fa fa-info-circle fa-fw', {
        'text-muted': !this.props.tooltip.content && !this.props.tooltip.link
      })

      return (
          <Manager className='ims-tooltip-container'>
            <Target>
              <span className={iconClasses} onClick={this._togglePopup} onMouseEnter={this._onMouseEnter} onMouseLeave={this._onMouseLeave} />
            </Target>
            {this.renderPopup(canEdit)}
          </Manager>
      )
    } else {
      return null
    }
  }

  renderPopup (canEdit) {
    if (!this.state.show) {
      return null
    }

    const popperClasses = classNames('ims-tooltip clearfix', {
      editing: canEdit && this.props.isEditing
    })

    return (
      <div>
      <Popper placement='top' className={popperClasses} onMouseEnter={this._onMouseEnter} onMouseLeave={this._onMouseLeave}>
        <Arrow className='ims-tooltip-arrow' />
        {this.renderPopupContent(canEdit)}
      </Popper>
      </div>
    )
  }

  renderPopupContent (canEdit) {
    if (canEdit === true && this.props.isEditing === true) {
      return (
        <TooltipEditor
          tooltipId={this.props.id} />
      )
    } else {
      return (
        <TooltipViewer
          canEdit={canEdit}
          onEdit={this._onEdit}
          tooltip={this.props.tooltip} />
      )
    }
  }
}

Tooltip.propTypes = {
  beginEdit: PropTypes.func.isRequired,
  cancelEdit: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  isEditing: PropTypes.bool.isRequired,
  tooltip: PropTypes.shape({
    packageTooltipId: PropTypes.number,
    packageId: PropTypes.string.isRequired,
    tooltipId: PropTypes.string.isRequired,
    content: PropTypes.string,
    link: PropTypes.string
  }).isRequired,
  user: PropTypes.object
}
