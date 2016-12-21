import React from 'react'
import Modal from 'react-bootstrap-modal'
import classNames from 'classnames'
import * as ReactTree from 'gateway-react-tree'
import ErrorAlert from '../ErrorAlert'
import LoadingIndicator from '../LoadingIndicator'
import request from '../../utils/request'
import '../../styles/AreaPicker.css'

export class AreaPicker extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isLoading: true,
      show: false,
      treeData: [],
      tokens: props.tokens
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.tokens &&
      (!this.props.tokens || this.props.tokens.expires !== nextProps.tokens.expires ||
      this.props.tokens.accessToken !== nextProps.tokens.accessToken)) {
      this.setState({
        tokens: nextProps.tokens
      })
    }
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
      }),
      packageId: this.props.packageId,
      tokens: this.props.tokens,
      hubUrl: this.props.hubUrl
    }

    return request(`${this.props.hubUrl}/api/trees/areas`, requestOptions)
      .then((result) => {
        if (result && result.success === true) {
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
      this.props.onSelect(this.state.selectedNode)
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
          <div className='ims-area-picker-tree-container'>
            {this.renderModalBody()}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Modal.Dismiss className='btn btn-link'>
            <i className='fa fa-times' aria-hidden='true' /> Cancel
          </Modal.Dismiss>
          <button type='button' className='btn btn-primary' onClick={() => this._onSelect()}>
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
        header={this.renderTreeHeader()}
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
      <input
        className='ims-area-picker-tree-header'
        placeholder='Search...'
        ref='filter'
        onChange={(e) => { this.refs.activeTree.setFilter(e.target.value) }}
        type='text' />
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
  hubUrl: React.PropTypes.string.isRequired,
  onSelect: React.PropTypes.func,
  packageId: React.PropTypes.string.isRequired,
  size: React.PropTypes.oneOf([ 'sm', 'md', 'lg', 'xs' ]),
  tokens: React.PropTypes.shape({
    accessToken: React.PropTypes.string.isRequired,
    expires: React.PropTypes.number.isRequired,
    refreshToken: React.PropTypes.string.isRequired
  })
})

export default AreaPicker
