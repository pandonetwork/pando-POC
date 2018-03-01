const fs = require('fs')
const path = require('path')
const jsonfile = require('jsonfile')
const touch = require('touch')
const rmdir = require('rmdir')

module.exports = {

  cwd: () => {
    return path.basename(process.cwd())
  },

  clean: () => {
    return new Promise((resolve, reject) => {
      rmdir('.', function (err, dirs, files) {
        if (err) {
          reject(err)
        } else {
          resolve({ dirs, files })
        }
      })
    })
  },

  touch: (path) => {
    return touch.sync(path)
  },

  mkdir: (path) => {
    return fs.mkdirSync(path)
  },

  exists: (path) => {
    return fs.existsSync(path)
  },

  read: (path) => {
    try {
      return jsonfile.readFileSync(path)
    } catch (err) {
      return undefined
    }
  },

  write: (path, object) => {
    jsonfile.writeFileSync(path, object)
  },

  cat: (path, file) => {
    return new Promise((resolve, reject) => {
      fs.writeFile(path, file.content, (err) => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  },

  delete: (path) => {
    fs.unlinkSync(path)
  }

}
