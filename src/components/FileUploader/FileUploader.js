import React from 'react'
import { upload } from '../../utils/upload'
import PropTypes from 'prop-types'
export default class FileUploader extends React.Component {
  constructor(props) {
    super(props)
    this.currentIndex = 0
  }
  render() {
    return (
      <div
        style={this.props.style}
        className={this.props.className}
        onDragOver={(e) => {
          return this._onDragOver(e)
        }}
        onDragEnd={(e) => {
          return this._onDragEnd(e)
        }}
        onDragEnter={(e) => {
          return this._onDragEnter(e)
        }}
        onDrop={(e) => {
          return this._onDrop(e)
        }}>
        {this.props.children || 'Drop attachments here'}
      </div>
    )
  }

  _onDragOver(e) {
    e = e || event
    if (e.preventDefault) {
      e.preventDefault() // Necessary. Allows us to drop.
    }
    if (e.stopPropagation) {
      e.stopPropagation() // stops the browser from redirecting.
    }
    try {
      e.dataTransfer.dropEffect = this.props.dropEffect || 'copy'
    } catch (err) {}
    return false
  }

  _onDragEnter(e) {
    e = e || event
    if (e.preventDefault) {
      e.preventDefault() // Necessary. Allows us to drop.
    }
    if (e.stopPropagation) {
      e.stopPropagation() // stops the browser from redirecting.
    }
    return false
  }

  _onDragEnd(e) {
    e = e || event
    if (e.preventDefault) {
      e.preventDefault() // Necessary. Allows us to drop.
    }
    if (e.stopPropagation) {
      e.stopPropagation() // stops the browser from redirecting.
    }
    return false
  }

  _onDrop(e) {
    e = e || event
    if (e.stopPropagation) {
      e.stopPropagation() // stops the browser from redirecting.
    }
    if (e.preventDefault) {
      e.preventDefault() // Necessary. Allows us to drop.
    }
    this.uploadFiles(e.dataTransfer.files)
  }

  uploadFile(file) {
    this.uploadFiles([file])
  }

  uploadFiles(files) {
    for (var i = 0; i < files.length; i++) {
      upload(
        this.props.uploadUrl,
        this.props.accessToken,
        files[i],
        this.currentIndex,
        this.props.onProgress || ((ev) => {})
      )
      this.currentIndex++
    }
  }
}

FileUploader.propTypes = {
  children: PropTypes.any,
  dropEffect: PropTypes.string,
  style: PropTypes.object,
  className: PropTypes.string,
  accessToken: PropTypes.string.isRequired,
  uploadUrl: PropTypes.string.isRequired,
  onProgress: PropTypes.func
}
