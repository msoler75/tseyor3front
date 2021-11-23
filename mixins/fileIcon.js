export default {
  methods: {
    getExtension (name) {
      const idx = name.lastIndexOf('.')
      return idx > -1 ? name.substr(idx) : name
    },
    iconFromExt (ext) {
      const idx = ext.lastIndexOf('.')
      if (idx > -1) ext = ext.substr(idx + 1)
      switch (ext.toLowerCase()) {
        case 'pdf':
          return 'file-pdf'
        case 'doc':
        case 'docx':
          return 'file-word'
        case 'txt':
        case 'rtf':
          return 'file-alt'
        case 'mp3':
        case 'au':
        case 'wma':
        case 'm4a':
        case 'wav':
        case 'aac':
        case 'opus':
        case 'flac':
          return 'file-audio'
        case 'mp4':
        case 'avi':
          return 'file-video'
        case 'ppt':
        case 'pps':
        case 'pptx':
        case 'ppsx':
          return 'file-powerpoint'
        case 'zip':
        case 'rar':
          return 'file-archive'
        case 'jpeg':
        case 'jpg':
        case 'webp':
        case 'svg':
        case 'png':
        case 'gif':
          return 'file-image'
        default:
          return 'file'
      }
    }
  }
}
