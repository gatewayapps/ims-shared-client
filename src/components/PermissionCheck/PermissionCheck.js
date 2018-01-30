import React from 'react'
import PropTypes from 'prop-types'
import request from '../../utils/request'
export class PermissionCheck extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      permissionChecked: false,
      permissionGranted: false,
      nodeId: props.nodeId
    }
  }

  componentWillReceiveProps (nextProps) {
    if (this.state.nodeId !== nextProps.nodeId) {
      this.checkPermissions(nextProps.nodeId)
    }
  }

  checkPermissions (nodeId) {
    this.setState({
      nodeId: nodeId,
      permissionChecked: false,
      permissionGranted: false
    })
    var url = '/api/user/hasPermission/'
    if (this.props.permission) {
      url += this.props.permission + '/'
    }
    if (nodeId) {
      url += nodeId + '/'
    }

    return request(url, { method: 'GET' }).then((response) => {
      this.setState({ permissionChecked: true, permissionGranted: response, nodeId: nodeId })
    })
  }

  componentDidMount () {
    this.checkPermissions(this.props.nodeId)
  }

  render () {
    if (!this.state.permissionChecked || !this.state.permissionGranted) {
      return <span />
    } else {
      return this.props.children
    }
  }
}

PermissionCheck.propTypes = Object.assign({}, React.Component.propTypes, {
  permission: PropTypes.string,
  nodeId: PropTypes.string,
  children: PropTypes.any
})

export default PermissionCheck
