const Web3 = require('web3')
const conf = require('./conf')

module.exports = {

  init: () => {
    return new Promise(async (resolve, reject) => {
      try {
        let node = conf.getNode() || 'http://localhost:8545'
        let committer = conf.getCommitter() || { address: (await module.exports.accounts)[0] }
        let web3 = new Web3(new Web3.providers.HttpProvider(node))
        let account = committer.address
        let provider = web3.currentProvider
        web3.eth.defaultAccount = account
        resolve({web3, account, provider})
      } catch (err) {
        reject(err)
      }
    })
  },

  accounts: (node) => {
    return new Promise(async (resolve, reject) => {
      let web3 = new Web3(new Web3.providers.HttpProvider(node))
      try {
        let accounts = await web3.eth.getAccounts()
        resolve(accounts)
      } catch (err) {
        reject(err)
      }
    })
  }

}
