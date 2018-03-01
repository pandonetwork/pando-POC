const files = require('./files')
const conf = require('./conf')
const util = require('util')
const exec = util.promisify(require('child_process').exec)

module.exports = {

  put: (object) => {
    return new Promise(async (resolve, reject) => {
      try {
        let tmp = conf.path.tmp + '/tmp'
        files.write(tmp, object)
        let { stdout, stderr } = await exec('ipfs dag put ' + tmp)
        files.delete(tmp)
        if (stderr) {
          reject(stderr.replace(/(\r\n|\n|\r)/gm, ''))
        } else {
          resolve(stdout.replace(/(\r\n|\n|\r)/gm, ''))
        }
      } catch (err) {
        reject(err)
      }
    })
  },

  get: (cid) => {
    return new Promise(async (resolve, reject) => {
      try {
        let { stdout, stderr } = await exec('ipfs dag get ' + cid)
        if (stderr) {
          reject(stderr)
        } else {
          resolve(JSON.parse(stdout))
        }
      } catch (err) {
        reject(err)
      }
    })
  }

}
