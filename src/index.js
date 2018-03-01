#!/usr/bin/env node

const program = require('commander')
const files = require('./lib/files')
const conf = require('./lib/conf')
const ipfs = require('./lib/ipfs')
const Commit = require('./lib/commit')
const pando = require('./lib/pando')
const inquirer = require('./lib/ui/inquirer')
const spinners = require('./lib/ui/spinners')

const init = async () => {
  if (!files.exists(conf.path.root)) {
    let configuration

    try {
      await conf.init()
      configuration = await inquirer.askBase()
    } catch (err) {
      console.log('Failed to init repository: ' + err)
    }

    if (configuration.remote === 'yes') {
      let remote = await inquirer.askRemote()
      configuration.committer.address = remote.account
      configuration.remote = { node: remote.node }
      conf.set(configuration)

      let dao, repo

      try {
        spinners.dao.start()
        dao = await pando.deployDAO()
        spinners.dao.succeed(dao)
      } catch (err) {
        spinners.dao.fail(err)
      }

      try {
        spinners.appManagerRole.start()
        await pando.grantAppManagerRole(configuration.committer.address, dao)
        spinners.appManagerRole.succeed(configuration.committer.address, dao)
      } catch (err) {
        spinners.appManagerRole.fail(err)
      }

      try {
        spinners.pando.start()
        repo = await pando.deployPandoApp(dao)
        spinners.pando.succeed(repo)
      } catch (err) {
        spinners.pando.fail(err)
      }

      try {
        spinners.pushRole.start()
        await pando.createPushRole(configuration.committer.address, dao, repo)
        spinners.pushRole.succeed(configuration.committer.address, repo)
      } catch (err) {
        spinners.pushRole.fail(err)
      }

      configuration.remote = { node: remote.node, dao: dao, pando: repo }
    }
    conf.set(configuration)
  } else {
    console.log('A repository already exists in the current working directory.')
  }
}

const push = async () => {
  try {
    spinners.push.start()
    let tx = await pando.push()
    spinners.push.succeed(tx.tx)
  } catch (err) {
    spinners.push.fail(err)
  }
}

const log = async () => {
  let commits = await Commit.log()
  commits.forEach(commit => {
    console.log(`commit  ${commit.cid}`.bold.green)
    console.log(`Author: ${commit.author}`)
    console.log(`Date: ${(new Date(commit.timestamp)).toJSON()}`)
    console.log(`Message: ${commit.message}`)
    console.log(``)
  })
}

const revert = async (cid) => {
  try {
    spinners.revert.start(cid)
    let commit = await Commit.get(cid)
    let node = commit.node['/']
    await files.clean()
    await ipfs.download(node)
    files.write(conf.path.head, cid)
    spinners.revert.succeed(cid)
  } catch (err) {
    spinners.revert.fail(err)
  }
}

const commit = async (message) => {
  try {
    spinners.commit.start()
    let commit = new Commit(message)
    let cid = await commit.put()
    spinners.commit.succeed(cid)
  } catch (err) {
    spinners.commit.fail(err)
  }
}

const clone = async (address) => {
  try {
    let prompt = await inquirer.askClone()
    let configuration = { committer: prompt.committer, remote: { node: prompt.node } }

    spinners.clone.start(address)
    let cid = await pando.clone(address)
    let commit = await Commit.get(cid)
    let node = commit.node['/']

    await ipfs.download(node)
    configuration.remote.dao = conf.getDAOAddress()
    configuration.remote.pando = conf.getPandoAddress()
    conf.set(configuration)
    files.write(conf.path.head, cid)
    spinners.clone.succeed(address)
  } catch (err) {
    spinners.clone.fail(err)
  }
}

const grant = async (account) => {
  try {
    spinners.pushRole.start()
    let dao = conf.getDAOAddress()
    let repo = conf.getPandoAddress()
    await pando.grantPushRole(account, dao, repo)
    spinners.pushRole.succeed(account, repo)
  } catch (err) {
    spinners.pushRole.fail(err)
  }
}

const fetch = async () => {
  try {
    spinners.fetch.start()
    let config = conf.get()
    let repo = conf.getPandoAddress()
    let cid = await pando.clone(repo)
    let commit = await Commit.get(cid)
    let node = commit.node['/']

    await files.clean()
    await ipfs.download(node)

    conf.set(config)
    files.write(conf.path.head, cid)
    spinners.fetch.succeed()
  } catch (err) {
    spinners.fetch.fail(err)
  }
}

program
  .command('init')
  .description('create an empty pando repository')
  .action(init)
program
  .command('commit <message>')
  .description('commit changes')
  .action(commit)
program
  .command('push')
  .description('push changes to remote repository')
  .action(push)
program
  .command('log')
  .description('show pasts commits')
  .action(log)
program
  .command('revert <cid>')
  .description('revert to a previous commit')
  .action(revert)
program
  .command('clone <address>')
  .description('clone a remote repository')
  .action(clone)
program
  .command('grant <address>')
  .description('grant PUSH rights to address')
  .action(grant)
program
  .command('fetch')
  .description('fetch sources from remote repository')
  .action(fetch)

program.parse(process.argv)
