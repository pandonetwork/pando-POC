const truffle = require('truffle-contract')
const eth = require('./eth')

const fix = (contract) => {
  if (typeof contract.currentProvider.sendAsync !== 'function') {
    contract.currentProvider.sendAsync = function () {
      return contract.currentProvider.send.apply(
        contract.currentProvider, arguments
      )
    }
  }
  return contract
}

const init = (json, provider, account) => {
  let contract = truffle(json)
  contract.setProvider(provider)
  contract = fix(contract)
  contract.defaults({ from: account, gas: 10000000 })

  return contract
}

module.exports = {

  get: (name) => {
    return new Promise(async (resolve, reject) => {
      try {
        let { account, provider } = await eth.init()
        let path = '../../build/contracts/' + name + '.json'
        let artifact = require(path)
        let contract = init(artifact, provider, account)
        resolve(contract)
      } catch (err) {
        reject(err)
      }
    })
  }

}
