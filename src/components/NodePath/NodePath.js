import React from 'react'

export class NodePath extends React.Component {
  _getNodePath () {
    if (this.props.removeFirst === true) {
      const startIdx = this.props.path.indexOf(' / ')
      if (startIdx >= 0) {
        return this.props.path.slice(startIdx + 3)
      } else {
        return this.props.path
      }
    } else {
      return this.props.path
    }
  }

  render () {
    if (!this.props.path || this.props.path.length === 0) {
      return null
    }

    return (<span>{this._getNodePath()}</span>)
  }
}

NodePath.propTypes = {
  path: React.PropTypes.string,
  removeFirst: React.PropTypes.bool
}

export default NodePath
