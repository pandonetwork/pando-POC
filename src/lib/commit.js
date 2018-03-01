const satellizer = require('./satellizer')
const files = require('./files')
const ipfs = require('./ipfs')
const conf = require('./conf')

class Commit {
  constructor (message) {
    let committer = conf.getCommitter()
    this.data = {
      '@type': 'commit',
      'timestamp': '',
      'parent': { '/': conf.getHead() },
      'node': '',
      'author': committer.name + ' <' + committer.email + '>' + ' <' + committer.address + '>',
      'message': message
    }
  }

  static async get (cid) {
    return (satellizer.get(cid))
  }

  static async log () {
    let commits = []
    let head = conf.getHead()
    let commit = await satellizer.get(head)

    commit.cid = head

    while (typeof commit.parent !== 'undefined') {
      delete commit.node
      commits.push(commit)

      let cid = commit.parent['/']
      commit = await Commit.get(cid)
      commit.cid = cid
    }

    delete commit.node
    commits.push(commit)

    return commits
  }

  put () {
    return new Promise(async (resolve, reject) => {
      try {
        if (this.data.parent['/'] === 'undefined') {
          delete this.data.parent
        }
        let nodes = await ipfs.put('.')
        this.data.node = { '/': nodes[nodes.length - 1].hash }
        this.data.timestamp = Date.now()
        let cid = await satellizer.put(this.data)
        files.write(conf.path.head, cid)
        resolve(cid)
      } catch (err) {
        reject(err)
      }
    })
  }
}

module.exports = Commit
