const ipfsAPI = require('ipfs-api')
const files = require('./files')

const ipfs = ipfsAPI('localhost', '5001', {protocol: 'http'})

module.exports = {

  download: (path) => {
    return new Promise((resolve, reject) => {
      ipfs.files.get(path, async function (err, files_) {
        if (err) {
          reject(err)
        } else {
          files_.splice(0, 1)
          for (let file of files_) {
            let relative = file.path.substring(file.path.indexOf('/') + 1)
            if (typeof file.content !== 'undefined') {
              await files.cat(relative.toString(), file)
            } else {
              files.mkdir(relative.toString())
            }
          }
          resolve()
        }
      })
    })
  },

  get: (path) => {
    return new Promise((resolve, reject) => {
      ipfs.get(path, (err, files) => {
        if (err) {
          reject(err)
        } else {
          resolve(files)
        }
      })
    })
  },

  ls: (cid) => {
    return new Promise((resolve, reject) => {
      ipfs.ls(cid, (err, files) => {
        if (err) {
          reject(err)
        } else {
          resolve(files)
        }
      })
    })
  },

  put: (path) => {
    return new Promise((resolve, reject) => {
      ipfs.util.addFromFs(path, { 'recursive': true, hidden: true, ignore: [''] }, (err, result) => {
        if (err) {
          reject(err)
        } else {
          resolve(result)
        }
      })
    })
  },

  hash: (path) => {
    return new Promise((resolve, reject) => {
      ipfs.util.addFromFs(path, { 'only-hash': true, 'recursive': true, ignore: [''] }, (err, result) => {
        if (err) {
          reject(err)
        } else {
          resolve(result)
        }
      })
    })
  }

}
