const conf = require('./conf')
const eth = require('./eth')
const contract = require('./contract')

module.exports = {

  deployDAO: () => {
    return new Promise(async (resolve, reject) => {
      try {
        const { account } = await eth.init()
        const Kernel = await contract.get('Kernel')
        const DAOFactory = await contract.get('DAOFactory')
        const ACL = await contract.get('ACL')

        let kernelBase = await Kernel.new()
        let aclBase = await ACL.new()
        let factory = await DAOFactory.new(kernelBase.address, aclBase.address, '0x00')
        let receipt = await factory.newDAO(account)
        let dao = receipt.logs.filter(l => l.event === 'DeployDAO')[0].args.dao

        resolve(dao)
      } catch (err) {
        reject(err)
      }
    })
  },

  grantAppManagerRole: (account, dao) => {
    return new Promise(async (resolve, reject) => {
      try {
        const Kernel = await contract.get('Kernel')
        const ACL = await contract.get('ACL')

        let kernel = Kernel.at(dao)
        let acl = ACL.at(await kernel.acl())

        const APP_MANAGER_ROLE = await kernel.APP_MANAGER_ROLE()
        await acl.createPermission(account, kernel.address, APP_MANAGER_ROLE, account)

        resolve()
      } catch (err) {
        reject(err)
      }
    })
  },

  deployPandoApp: (dao) => {
    return new Promise(async (resolve, reject) => {
      try {
        const { hash } = require('eth-ens-namehash')
        const keccak256 = require('js-sha3').keccak_256
        const APP_BASE_NAMESPACE = '0x' + keccak256('base')
        const appId = hash('pando.aragonpm.test')
        const Pando = await contract.get('Pando')
        const Kernel = await contract.get('Kernel')
        const AppProxyUpgradeable = await contract.get('AppProxyUpgradeable')

        let kernel = Kernel.at(dao)
        let pando = await Pando.new()

        await kernel.setApp(APP_BASE_NAMESPACE, appId, pando.address)
        let initializationPayload = pando.contract.initialize.getData()
        let appProxy = await AppProxyUpgradeable.new(kernel.address, appId, initializationPayload, { gas: 5e6 })

        resolve(appProxy.address)
      } catch (err) {
        reject(err)
      }
    })
  },

  createPushRole: (account, kernelAddress, pandoAddress) => {
    return new Promise(async (resolve, reject) => {
      try {
        const Kernel = await contract.get('Kernel')
        const Pando = await contract.get('Pando')
        const ACL = await contract.get('ACL')
        const pando = Pando.at(pandoAddress)
        const PUSH = await pando.PUSH()
        const kernel = Kernel.at(kernelAddress)
        const acl = ACL.at(await kernel.acl())

        await acl.createPermission(account, pando.address, PUSH, account)

        resolve()
      } catch (err) {
        reject(err)
      }
    })
  },

  grantPushRole: (account, kernelAddress, pandoAddress) => {
    return new Promise(async (resolve, reject) => {
      try {
        const Kernel = await contract.get('Kernel')
        const Pando = await contract.get('Pando')
        const ACL = await contract.get('ACL')
        const pando = Pando.at(pandoAddress)
        const PUSH = await pando.PUSH()
        const kernel = Kernel.at(kernelAddress)
        const acl = ACL.at(await kernel.acl())

        await acl.grantPermission(account, pando.address, PUSH)

        resolve()
      } catch (err) {
        reject(err)
      }
    })
  },

  push: () => {
    return new Promise(async (resolve, reject) => {
      try {
        const pando = (await contract.get('Pando')).at(conf.getPandoAddress())
        let tx = await pando.setRepository(conf.getHead())
        resolve(tx)
      } catch (err) {
        reject(err)
      }
    })
  },

  clone: (address) => {
    return new Promise(async (resolve, reject) => {
      try {
        const Pando = await contract.get('Pando')
        let pando = await Pando.at(address)
        let cid = await pando.getRepository()
        resolve(cid)
      } catch (err) {
        reject(err)
      }
    })
  }

}
