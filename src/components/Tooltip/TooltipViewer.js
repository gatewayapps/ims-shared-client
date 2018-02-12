import React from 'react'
import PropTypes from 'prop-types'
import ReactMarkdown from 'react-markdown'

export default class TooltipViewer extends React.Component {
  render () {
    if (!this.props.tooltip.content && !this.props.tooltip.link && this.props.canEdit === true) {
      return (
        <a className='btn btn-link btn-sm' onClick={() => this.props.onEdit(this.props.tooltip)}>
          Click to edit content
        </a>
      )
    } else {
      return (
        <div className='clearfix'>
          {this.props.canEdit === true && this.renderEditButton()}
          <div className='ims-tooltip-content'>
            {this.props.tooltip.content && (<ReactMarkdown source={this.props.tooltip.content || ''} />)}
            {this.props.tooltip.link && (<a href={this.props.tooltip.link} target='_blank'>more info</a>)}
          </div>
        </div>
      )
    }
  }

  renderEditButton () {
    return (<a className='btn btn-link btn-sm pull-right' onClick={() => this.props.onEdit(this.props.tooltip)}><i className='fa fa-fw fa-pencil' /></a>)
  }
}

TooltipViewer.propTypes = {
  canEdit: PropTypes.bool,
  onEdit: PropTypes.func,
  tooltip: PropTypes.shape({
    packageTooltipId: PropTypes.number,
    packageId: PropTypes.string.isRequired,
    tooltipId: PropTypes.string.isRequired,
    content: PropTypes.string,
    link: PropTypes.string
  }).isRequired
}
