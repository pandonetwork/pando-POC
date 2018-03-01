const inquirer = require('inquirer')
const eth = require('../eth')

module.exports = {

  askBase: () => {
    const questions = [
      {
        name: 'committer.name',
        type: 'input',
        message: 'Enter your name: ',
        validate: function (value) {
          if (value.length) {
            return true
          } else {
            return 'Please enter your name.'
          }
        }
      },
      {
        name: 'committer.email',
        type: 'input',
        message: 'Enter your email: ',
        validate: function (value) {
          if (value.length) {
            return true
          } else {
            return 'Please enter your email.'
          }
        }
      },
      // {
      //   name: 'ipfs.address',
      //   type: 'input',
      //   message: 'Enter the address of your ipfs daemon: ',
      //   validate: function (value) {
      //     if (value.length) {
      //       return true
      //     } else {
      //       return 'Please enter the address of your ipfs daemon.'
      //     }
      //   }
      // },
      // {
      //   name: 'ipfs.port',
      //   type: 'input',
      //   message: 'Enter the port of your ipfs daemon: ',
      //   validate: function (value) {
      //     if (value.length) {
      //       return true
      //     } else {
      //       return 'Please enter the port of your ipfs daemon.'
      //     }
      //   }
      // },
      // {
      //   name: 'ipfs.protocol',
      //   type: 'input',
      //   message: 'Enter the protocol of your ipfs daemon: ',
      //   validate: function (value) {
      //     if (value.length) {
      //       return true
      //     } else {
      //       return 'Please enter the protocol of your ipfs daemon.'
      //     }
      //   }
      // },
      {
        name: 'remote',
        type: 'list',
        message: 'Do you want to create a remote repository?',
        choices: ['yes', 'no'],
        default: 0
      }
    ]
    return inquirer.prompt(questions)
  },

  askRemote: () => {
    const questions = [
      {
        name: 'node',
        type: 'input',
        message: 'Enter a valid Ethereum node url: ',
        default: 'http://localhost:8545',
        validate: function (value) {
          const regex = new RegExp(/(?:^|\s)((https?:\/\/)?(?:localhost|[\w-]+(?:\.[\w-]+)+)(:\d+)?(\/\S*)?)/)
          if (value.match(regex)) {
            return true
          } else {
            return 'Please enter a valid Ethereum node url.'
          }
        }
      },
      {
        name: 'account',
        type: 'list',
        message: 'Select an account to identify yourself on the remote repository',
        choices () {
          return new Promise(async (resolve, reject) => {
            try {
              let accounts = await eth.accounts()
              resolve(accounts)
            } catch (err) {
              reject(err)
            }
          })
        },
        default: 0
      }
    ]
    return inquirer.prompt(questions)
  },

  askClone: () => {
    const questions = [
      {
        name: 'committer.name',
        type: 'input',
        message: 'Enter your name: ',
        validate: function (value) {
          if (value.length) {
            return true
          } else {
            return 'Please enter your name.'
          }
        }
      },
      {
        name: 'committer.email',
        type: 'input',
        message: 'Enter your email: ',
        validate: function (value) {
          if (value.length) {
            return true
          } else {
            return 'Please enter your email.'
          }
        }
      },
      {
        name: 'node',
        type: 'input',
        message: 'Enter a valid Ethereum node url: ',
        default: 'http://localhost:8545',
        validate: function (value) {
          const regex = new RegExp(/(?:^|\s)((https?:\/\/)?(?:localhost|[\w-]+(?:\.[\w-]+)+)(:\d+)?(\/\S*)?)/)
          if (value.match(regex)) {
            return true
          } else {
            return 'Please enter a valid Ethereum node url.'
          }
        }
      },
      {
        name: 'committer.address',
        type: 'list',
        message: 'Select an account to identify yourself on the remote repository',
        choices () {
          return new Promise(async (resolve, reject) => {
            try {
              let accounts = await eth.accounts()
              resolve(accounts)
            } catch (err) {
              reject(err)
            }
          })
        },
        default: 0
      }
    ]
    return inquirer.prompt(questions)
  }
}
