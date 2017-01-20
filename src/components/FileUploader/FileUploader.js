import React from 'react'
import { upload } from '../../utils/upload'

export default class FileUploader extends React.Component {
  constructor (props) {
    super(props)
    this.currentIndex = 0
  }
  render () {
    return (
      <div style={this.props.style} className={this.props.className}
        onDragOver={(e) => { this._onDragOver(e) }}
        onDragEnd={(e) => { this._onDragEnd(e) }}
        onDrop={(e) => { this._onDrop(e) }}>
        {this.props.children || 'Drop attachments here'}
      </div>
    )
  }

  _onDragOver (e) {
    if (e.preventDefault) {
      e.preventDefault() // Necessary. Allows us to drop.
    }
    if (e.stopPropagation) {
      e.stopPropagation() // stops the browser from redirecting.
    }
    e.dataTransfer.dropEffect = this.props.dropEffect || 'copy'
    return false
  }

  _onDragEnd (e) {
    return false
  }

  _onDrop (e) {
    if (e.stopPropagation) {
      e.stopPropagation() // stops the browser from redirecting.
    }
    if (e.preventDefault) {
      e.preventDefault() // Necessary. Allows us to drop.
    }
    for (var i = 0; i < e.dataTransfer.files.length; i++) {
      this.props.onProgress({ type: 'start', id: this.currentIndex })
      upload(this.props.uploadUrl, this.props.accessToken, e.dataTransfer.files[i], this.currentIndex, this.props.onProgress ||
      ((ev) => {
        console.log(ev)
      }))
      this.currentIndex++
    }

    return false
  }
}

FileUploader.propTypes = {
  children: React.PropTypes.any,
  dropEffect: React.PropTypes.string,
  style: React.PropTypes.object,
  className: React.PropTypes.string,
  accessToken: React.PropTypes.string.isRequired,
  uploadUrl: React.PropTypes.string.isRequired,
  onProgress: React.PropTypes.func
}

