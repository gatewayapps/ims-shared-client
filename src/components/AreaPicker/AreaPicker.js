import React from 'react'
import Modal from 'react-bootstrap-modal'
import classNames from 'classnames'
import * as ReactTree from 'gateway-react-tree'
import ErrorAlert from '../ErrorAlert'
import LoadingIndicator from '../LoadingIndicator'
import request from '../../utils/request'
import { getHubUrl } from '../../utils/cookies'
import '../../styles/AreaPicker.css'

export class AreaPicker extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isLoading: true,
      show: false,
      treeData: []
    }
  }

  _disableSelect () {
    return !(this.state.selectedNode && this.state.selectedNode.nodeId > 0)
  }

  _onEntering () {
    this.setState({
      isLoading: true,
      treeData: []
    })
    return this._loadAreaTreeData()
  }

  _loadAreaTreeData () {
    const that = this
    const requestOptions = {
      method: 'POST',
      body: JSON.stringify({
        nodeDetailTypes: [1]
      })
    }

    return request(`${getHubUrl()}/api/trees/areas`, requestOptions)
      .then((result) => {
        if (result && result.success === true) {
          if (Array.isArray(result.structure)) {
            for (let i = 0; i < result.structure.length; i++) {
              result.structure[i].open = true
            }
          }

          that.setState({
            isLoading: false,
            treeData: result.structure
          })
        } else {
          that.setState({
            isLoading: false
          })
        }
        return null
      })
      .catch((error) => {
        that.setState({
          isLoading: false,
          error: error.message
        })
      })
  }

  _onHide () {
    this.setState({ show: false })
  }

  _onSelect () {
    if (typeof this.props.onSelect === 'function') {
      const selectedNode = Object.assign({}, this.state.selectedNode, {
        children: undefined
      })
      this.props.onSelect(selectedNode)
    }
    this.setState({ show: false })
  }

  _showPicker () {
    this.setState({ show: true })
  }

  render () {
    const btnClasses = classNames('btn btn-link', {
      'btn-sm': this.props.size === 'sm',
      'btn-lg': this.props.size === 'lg',
      'btn-xs': this.props.size === 'xs'
    })

    return (
      <button {...this.props.buttonProps} className={btnClasses} onClick={() => this._showPicker()}>
        <i className='fa fa-sitemap' /> Choose Area
        {this.renderModal()}
      </button>
    )
  }

  renderModal () {
    return (
      <Modal
        show={this.state.show}
        onEntering={() => this._onEntering()}
        onHide={() => this._onHide()}
        aria-labelledby='areaPickerTitle'>
        <Modal.Header closeButton>
          <Modal.Title id='areaPickerTitle'>Select Area</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ErrorAlert message={this.state.error} />
          <div className='panel panel-default'>
            <div className='panel-heading ims-area-picker__tree-header-container'>
              <input
                className='form-control'
                placeholder='Search...'
                ref='filter'
                onChange={(e) => { this.refs.activeTree.setFilter(e.target.value) }}
                type='text' />
            </div>
            <div className='ims-area-picker__tree-container panel-body'>
              {this.renderModalBody()}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Modal.Dismiss className='btn btn-link'>
            <i className='fa fa-times' aria-hidden='true' /> Cancel
          </Modal.Dismiss>
          <button
            type='button'
            className='btn btn-primary'
            onClick={() => this._onSelect()}
            disabled={this._disableSelect()}>
            <i className='fa fa-link' aria-hidden='true' /> Select
          </button>
        </Modal.Footer>
      </Modal>
    )
  }

  renderModalBody () {
    if (this.state.isLoading) {
      return (<LoadingIndicator />)
    }

    return (
      <ReactTree.Tree
        nodes={this.state.treeData}
        ref='activeTree'
        renderNodeTitle={this._renderNodeTitle}
        renderNodeToggle={this._renderNodeToggle}
        titlePropertyPath='name'
        onToggleClick={(n) => this._onNodeToggle(n)}
        onNodeClick={(n) => this._onNodeSelect(n)} />
    )
  }

  renderTreeHeader () {
    return (
      <div className='ims-area-picker__tree-header-container'>
        
      </div>
    )
  }

  _renderNodeTitle (node) {
    return (
      <div className='react-tree-node-title'>{node.name}</div>
    )
  }

  _renderNodeToggle (node, clickHandler) {
    const toggleClasses = classNames('fa', {
      'fa-folder': !node.open,
      'fa-folder-open': node.open
    })
    return (
      <button className='btn btn-link btn-xs react-tree-node-toggle' onClick={clickHandler}>
        <i className={toggleClasses} />
      </button>
    )
  }

  _onNodeToggle (node) {
    node.open = !node.open
    this.setState({
      treeData: this.state.treeData
    })
    this._onNodeSelect(node)
  }

  _onNodeSelect (node) {
    if (this.state.selectedNode) {
      this.state.selectedNode.active = false
    }
    node.active = true
    this.setState({
      selectedNode: node
    })
  }
}

AreaPicker.propTypes = Object.assign({}, React.Component.propTypes, {
  buttonProps: React.PropTypes.object,
  onSelect: React.PropTypes.func,
  size: React.PropTypes.oneOf([ 'sm', 'md', 'lg', 'xs' ])
})

export default AreaPicker
