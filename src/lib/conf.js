const files = require('./files')

module.exports = {

  path: {
    root: '.pando',
    conf: '.pando/conf',
    tmp: '.pando/tmp',
    head: '.pando/head'
  },

  init: () => {
    return new Promise((resolve, reject) => {
      try {
        files.mkdir(module.exports.path.root)
        files.mkdir(module.exports.path.tmp)
        files.write(module.exports.path.head, 'undefined')
        resolve()
      } catch (err) {
        reject(err)
      }
    })
  },

  set: (conf) => {
    try {
      files.write(module.exports.path.conf, conf)
    } catch (err) {
      throw err
    }
  },

  get: () => {
    return files.read(module.exports.path.conf)
  },

  getCommitter: () => {
    let conf = files.read(module.exports.path.conf)
    if (typeof conf !== 'undefined') {
      return conf.committer
    } else {
      return undefined
    }
  },

  getIPFS: () => {
  },

  getNode: () => {
    let conf = files.read(module.exports.path.conf)
    if (typeof conf !== 'undefined' && typeof conf.remote !== 'undefined') {
      return conf.remote.node
    } else {
      return undefined
    }
  },

  getDAOAddress: () => {
    return files.read(module.exports.path.conf).remote.dao
  },

  getPandoAddress: () => {
    return files.read(module.exports.path.conf).remote.pando
  },

  getHead: () => {
    return files.read(module.exports.path.head).replace(/(\r\n|\n|\r)/gm, '')
  }

}
