import classNames from 'classnames'
import React from 'react'
import PropTypes from 'prop-types'
import FormGroup from '../FormGroup'
import TooltipViewer from './TooltipViewer'

export default class TooltipEditor extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      tab: 'edit'
    }
  }

  _setTab (tab) {
    this.setState({ tab: tab })
  }

  render () {
    const navButtonDefaultClasses = 'ims-tab'
    const editNavClasses = classNames(navButtonDefaultClasses, {
      selected: this.state.tab === 'edit'
    })
    const previewNavClasses = classNames(navButtonDefaultClasses, {
      selected: this.state.tab === 'preview'
    })
    return (
      <div className='ims-tooltip-editor'>
        <nav className='ims-tab-nav'>
          <a role='button' className={editNavClasses} onClick={() => { this._setTab('edit') }}>
            Edit
          </a>
          <a role='button' className={previewNavClasses} onClick={() => { this._setTab('preview') }}>
            Preview
          </a>
        </nav>
        <section>
          {this.state.tab === 'edit' && this.renderEdit()}
          {this.state.tab === 'preview' && this.renderPreview()}
        </section>
        <footer>
          <button className='btn btn-sm btn-link' onClick={() => { this.props.cancelEdit(this.props.tooltipId) }}>
            Cancel
          </button>
          <button className='btn btn-sm btn-primary' disabled={this.props.isSaving} onClick={() => this.props.saveTooltip(this.props.tooltip)}>
            Save
          </button>
        </footer>
      </div>
    )
  }

  renderEdit () {
    return (
      <div className='ims-tooltip-edit-page'>
        <FormGroup>
          <label htmlFor='content' className='control-label'>Content</label>
          <textarea
            name='content'
            className='form-control'
            rows={4}
            value={this.props.tooltip.content || ''}
            onChange={(e) => { this.props.changeContent(this.props.tooltipId, e.target.value) }} />
        </FormGroup>
        <FormGroup>
          <label htmlFor='link' className='control-label'>Link</label>
          <input
            type='url'
            name='link'
            className='form-control'
            value={this.props.tooltip.link || ''}
            onChange={(e) => { this.props.changeLink(this.props.tooltipId, e.target.value) }} />
        </FormGroup>
      </div>
    )
  }

  renderPreview () {
    return (
      <div className='ims-tooltip-edit-preview-page'>
        <TooltipViewer tooltip={this.props.tooltip} />
      </div>
    )
  }
}

TooltipEditor.propTypes = {
  cancelEdit: PropTypes.func.isRequired,
  changeContent: PropTypes.func.isRequired,
  changeLink: PropTypes.func.isRequired,
  isSaving: PropTypes.bool.isRequired,
  saveTooltip: PropTypes.func.isRequired,
  tooltipId: PropTypes.string.isRequired,
  tooltip: PropTypes.shape({
    packageTooltipId: PropTypes.number,
    packageId: PropTypes.string.isRequired,
    tooltipId: PropTypes.string.isRequired,
    content: PropTypes.string,
    link: PropTypes.string
  }).isRequired
}