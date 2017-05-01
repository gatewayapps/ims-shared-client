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
        onDragOver={(e) => { return this._onDragOver(e) }}
        onDragEnd={(e) => { return this._onDragEnd(e) }}
        onDragEnter={(e) => { return this._onDragEnter(e) }}
        onDrop={(e) => { return this._onDrop(e) }}>
        {this.props.children || 'Drop attachments here'}
      </div>
    )
  }

  _onDragOver (e) {
    e = e || event
    if (e.preventDefault) {
      e.preventDefault() // Necessary. Allows us to drop.
    }
    if (e.stopPropagation) {
      e.stopPropagation() // stops the browser from redirecting.
    }
    try {
      e.dataTransfer.dropEffect = this.props.dropEffect || 'copy'
    } catch (err) {

    }
    return false
  }

  _onDragEnter (e) {
    e = e || event
    if (e.preventDefault) {
      e.preventDefault() // Necessary. Allows us to drop.
    }
    if (e.stopPropagation) {
      e.stopPropagation() // stops the browser from redirecting.
    }
    return false
  }

  _onDragEnd (e) {
    e = e || event
    if (e.preventDefault) {
      e.preventDefault() // Necessary. Allows us to drop.
    }
    if (e.stopPropagation) {
      e.stopPropagation() // stops the browser from redirecting.
    }
    return false
  }

  _onDrop (e) {
    e = e || event
    if (e.stopPropagation) {
      e.stopPropagation() // stops the browser from redirecting.
    }
    if (e.preventDefault) {
      e.preventDefault() // Necessary. Allows us to drop.
    }
    this._onDropFiles(e)
    // for (var i = 0; i < e.dataTransfer.files.length; i++) {
    //   upload(this.props.uploadUrl, this.props.accessToken, e.dataTransfer.files[i], this.currentIndex, this.props.onProgress ||
    //   ((ev) => {
    //     console.log(ev)
    //   }))
    //   this.currentIndex++
    // }
  }

  _onDropFiles (e) {
    e.preventDefault()

    var items = e.dataTransfer.items
    for (var i = 0; i < items.length; i++) {
    // webkitGetAsEntry is where the magic happens
      var item = items[i].webkitGetAsEntry()
      if (item) {
        this._traverseFiles(item)
      }
    }
  }

  _traverseFiles (item, path) {
    path = path || ''
    var that = this
    if (item.isFile) {
    // Get file
      item.file(function (file) {
        upload(that.props.uploadUrl, that.props.accessToken, file, that.currentIndex, that.props.onProgress ||
        ((ev) => {
          console.log(ev)
        }))
        that.currentIndex++
      })
    } else if (item.isDirectory) {
    // Get folder contents
      var dirReader = item.createReader()
      dirReader.readEntries(function (entries) {
        for (var i = 0; i < entries.length; i++) {
          that._traverseFiles(entries[i], path + item.name + '/')
        }
      })
    }
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
