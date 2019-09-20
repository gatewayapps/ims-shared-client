import React from 'react'
import PropTypes from 'prop-types'
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'
import classNames from 'classnames'
import * as ReactTree from 'gateway-react-tree'
import ErrorAlert from '../ErrorAlert'
import LoadingIndicator from '../LoadingIndicator'
import request from '../../utils/request'
import { getHubUrl } from '../../utils/cookies'
import '../../styles/AreaPicker.css'

export class AreaPicker extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: true,
      show: false,
      treeData: []
    }
  }

  _disableSelect() {
    return !(this.state.selectedNode && this.state.selectedNode.nodeId > 0)
  }

  _onEntering() {
    this.setState({
      isLoading: true,
      treeData: []
    })
    return this._loadAreaTreeData()
  }

  _loadAreaTreeData() {
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

  _onHide() {
    this.setState({ show: false })
  }

  _onSelect() {
    if (typeof this.props.onSelect === 'function') {
      const selectedNode = Object.assign({}, this.state.selectedNode, {
        children: undefined
      })
      this.props.onSelect(selectedNode)
    }
    this.setState({ show: false })
  }

  _showPicker() {
    this.setState({ show: true })
  }

  render() {
    const btnClasses = classNames('btn btn-info', {
      'btn-sm': this.props.size === 'sm',
      'btn-lg': this.props.size === 'lg',
      'btn-xs': this.props.size === 'xs'
    })

    return (
      <button {...this.props.buttonProps} className={btnClasses} onClick={() => this._showPicker()}>
        <i className="fa fa-sitemap" /> Choose Area
        {this.renderModal()}
      </button>
    )
  }

  renderModal() {
    return (
      <Modal
        isOpen={this.state.show}
        onEnter={() => this._onEntering()}
        onExit={() => this._onHide()}
        aria-labelledby="areaPickerTitle">
        <ModalHeader toggle={this._onHide}>
          <div id="areaPickerTitle">Select Area</div>
        </ModalHeader>
        <ModalBody>
          <ErrorAlert message={this.state.error} />
          <div className="panel panel-default">
            <div className="panel-heading ims-area-picker__tree-header-container">
              <input
                className="form-control"
                placeholder="Search..."
                ref="filter"
                onChange={(e) => {
                  this.refs.activeTree.setFilter(e.target.value)
                }}
                type="text"
              />
            </div>
            <div className="ims-area-picker__tree-container panel-body">
              {this.renderModalBody()}
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <a className="btn btn-link" onClick={this._onHide}>
            <i className="fa fa-times" aria-hidden="true" /> Cancel
          </a>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => this._onSelect()}
            disabled={this._disableSelect()}>
            <i className="fa fa-link" aria-hidden="true" /> Select
          </button>
        </ModalFooter>
      </Modal>
    )
  }

  renderModalBody() {
    if (this.state.isLoading) {
      return <LoadingIndicator />
    }

    return (
      <ReactTree.Tree
        nodes={this.state.treeData}
        ref="activeTree"
        renderNodeTitle={this._renderNodeTitle}
        renderNodeToggle={this._renderNodeToggle}
        titlePropertyPath="name"
        onToggleClick={(n) => this._onNodeToggle(n)}
        onNodeClick={(n) => this._onNodeSelect(n)}
      />
    )
  }

  renderTreeHeader() {
    return <div className="ims-area-picker__tree-header-container"></div>
  }

  _renderNodeTitle(node) {
    const icon = node.nodeDetailTypeId === 1 ? 'fa fa-fw fa-folder-o' : null
    return (
      <div className="react-tree-node-title">
        {icon ? <i className={icon} /> : null} {node.name}
      </div>
    )
  }

  _renderNodeToggle(node, clickHandler) {
    const toggleClasses = classNames('fa', {
      'fa-caret-right': !node.open,
      'fa-caret-down': node.open
    })
    return (
      <button className="btn btn-link btn-xs react-tree-node-toggle" onClick={clickHandler}>
        <i className={toggleClasses} />
      </button>
    )
  }

  _onNodeToggle(node) {
    this._onNodeSelect(node)
  }

  _onNodeSelect(node) {
    node.open = !node.open
    this.setState({
      treeData: this.state.treeData
    })
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
  buttonProps: PropTypes.object,
  onSelect: PropTypes.func,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xs'])
})

export default AreaPicker
