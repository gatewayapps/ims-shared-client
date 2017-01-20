var UploadRequests = {}
// fix sendAsBinary for chrome
try {
  if (typeof XMLHttpRequest.prototype.sendAsBinary === 'undefined') {
    XMLHttpRequest.prototype.sendAsBinary = function (text) {
      var data = new ArrayBuffer(text.length)
      var ui8a = new Uint8Array(data, 0)
      for (var i = 0; i < text.length; i++) ui8a[i] = (text.charCodeAt(i) & 0xff)
      this.setRequestHeader('Content-Length', ui8a.length)
      this.send(ui8a)
    }
  }
} catch (e) { }

export function cancel (id) {
  if (UploadRequests[id]) {
    const req = UploadRequests[id]
    // Is the request already completed?  If so, no need for abort
    if (req.readyState !== 4) {
      req.abort()
    } else {
      delete UploadRequests[id]
    }
  } else {
    console.log('Attempted to cancel an invalid request')
  }
}

export function upload (url, accessToken, file, id, callback) {
  const reader = new FileReader()
  reader.onloadend = (e) => {
    const bin = e.target.result
    var formData = new FormData()
    console.log(file)
    formData.append('file', new Blob([bin]), file.name)
    const onProgress = (e) => {
      if (e.lengthComputable) {
        callback({ type: 'progress', complete: (e.loaded / e.total) * 100, id: id })
      }
    }
    const onComplete = (e) => {
      var result = JSON.parse(e.target.response)
      if (result.success) {
        callback({ type: 'complete', uploadId: id, ...result })
      } else {
        callback({ type: 'complete', uploadId: id, ...result })
      }
    }

    const req = new XMLHttpRequest()
    UploadRequests[id] = req
    req.withCredentials = true
    req.upload.addEventListener('progress', onProgress, false)
    req.addEventListener('load', onComplete, false)

    req.open('POST', url)
    req.setRequestHeader('x-file-size', file.size)
    req.setRequestHeader('x-ims-authorization', `JWT ${accessToken}`)
  // req.setRequestHeader('Content-Disposition', `attachment; name="file"; filename="${file.name}"`)
    req.send(formData)
  }

  reader.readAsArrayBuffer(file)
}

