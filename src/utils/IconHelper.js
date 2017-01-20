module.exports = {
  getIconForMimeType: (mimeType) => {
    mimeType = mimeType.trim().toLowerCase()
    switch (mimeType) {
      // Microsoft Office Word Mimetypes - http://filext.com/faq/office_mime_types.php
      case 'application/msword':
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.template':
      case 'application/vnd.ms-word.document.macroEnabled.12':
      case 'application/vnd.ms-word.template.macroEnabled.12': {
        return 'file-word-o'
      }

      // Microsoft Office Excel Mimetypes
      case 'application/vnd.ms-excel':
      case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
      case 'application/vnd.openxmlformats-officedocument.spreadsheetml.template':
      case 'application/vnd.ms-excel.sheet.macroEnabled.12':
      case 'application/vnd.ms-excel.template.macroEnabled.12':
      case 'application/vnd.ms-excel.addin.macroEnabled.12':
      case 'application/vnd.ms-excel.sheet.binary.macroEnabled.12': {
        return 'file-excel-o'
      }

      // Microsoft Office PowerPoint Mimetypes
      case 'application/vnd.ms-powerpoint':
      case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
      case 'application/vnd.openxmlformats-officedocument.presentationml.template':
      case 'application/vnd.openxmlformats-officedocument.presentationml.slideshow':
      case 'application/vnd.ms-powerpoint.addin.macroEnabled.12':
      case 'application/vnd.ms-powerpoint.presentation.macroEnabled.12':
      case 'application/vnd.ms-powerpoint.template.macroEnabled.12':
      case 'application/vnd.ms-powerpoint.slideshow.macroEnabled.12': {
        return 'file-powerpoint-o'
      }

      // Video
      case 'video/x-flv':
      case 'video/mp4':
      case 'application/x-mpegURL':
      case 'video/MP2T':
      case 'video/3gpp':
      case 'video/quicktime':
      case 'video/x-msvideo':
      case 'video/x-ms-wmv': {
        return 'file-video-o'
      }

      // Images
      case 'image/bmp':
      case 'image/gif':
      case 'image/png':
      case 'image/jpeg':
      case 'image/tiff': {
        return 'file-image-o'
      }

      // Audio
      case 'audio/basic':
      case 'audio/L24':
      case 'audio/mid':
      case 'audio/mpeg':
      case 'audio/mp4':
      case 'audio/x-aiff':
      case 'audio/x-mpegurl':
      case 'audio/vnd.rn-realaudio':
      case 'audio/ogg':
      case 'audio/vorbis':
      case 'audio/vnd.wav': {
        return 'file-audio-o'
      }

      // Miscellaneous
      case 'application/zip': {
        return 'file-archive-o'
      }
      case 'application/pdf': {
        return 'file-pdf-o'
      }
      case 'text/plain': {
        return 'file-text-o'
      }
      default: {
        return 'file-o'
      }

    }
  }
}
