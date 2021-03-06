import abi from 'human-standard-token-abi'
import { request } from 'helpers'
import { getState } from 'redux/core'
import web3 from 'helpers/web3'
import reducers from 'redux/core/reducers'
import config from 'app-config'


const login = (privateKey, contractAddress, nameContract) => {
  let data
  if (privateKey) {
    data = web3.eth.accounts.privateKeyToAccount(privateKey)
  } else {
    console.info('Created account ETH Token ...')
    data = web3.eth.accounts.create()
    web3.eth.accounts.wallet.add(data)
  }

  web3.eth.accounts.wallet.add(data.privateKey)
  console.info('Logged in with ETH Token', data)


  setupContract(data.address, contractAddress, nameContract)
}


const setupContract = (ethAddress, contractAddress, nameContract) => {
  if (!web3.eth.accounts.wallet[ethAddress]) {
    throw new Error('web3 does not have given address')
  }

  const data = {
    address: ethAddress,
    balance: 0,
    name: nameContract,
    currency: nameContract.toUpperCase(),
    contractAddress,
  }

  reducers.user.setTokenAuthData({ name: data.name, data })
}


const getBalance = (contractAddress, name) => {
  const { user: { ethData: { address } } } = getState()
  const url = `${config.api.etherscan}?module=account&action=tokenbalance&contractaddress=${contractAddress}&address=${address}`

  return request.get(url)
    .then(({ result: amount }) => {
      reducers.user.setTokenBalance({ name, amount })
    }).catch(r => console.error('Token service isn\'t available, try later'))
}

const fetchBalance = (address) =>
  request.get(`https://rinkeby.etherscan.io/api?module=account&action=tokenbalance&contractaddress=0x60c205722c6c797c725a996cf9cca11291f90749&address=${address}`)
    .then(({ result }) => result)


const getTransaction = (contractAddress) =>
  new Promise((resolve) => {
    const { user: { ethData: { address } } } = getState()

    const url = [
      `https://api-rinkeby.etherscan.io/api?module=account&action=tokentx`,
      `&contractaddress=${contractAddress}`,
      `&address=${address}`,
      `&startblock=0&endblock=99999999`,
      `&sort=asc&apikey=${config.apiKeys.blocktrail}`,
    ].join('')

    let transactions

    request.get(url)
      .then((res) => {
        console.log(res)
        if (res.status) {
          transactions = res.result
            .filter((item) => item.value > 0).map((item) => ({
              confirmations: item.confirmations > 0 ? 'Confirm' : 'Unconfirmed',
              type: item.tokenName,
              hash: item.hash,
              contractAddress: item.contractAddress,
              status: item.blockHash != null ? 1 : 0,
              value: item.value,
              address: item.to,
              date: item.timeStamp * 1000,
              direction: address.toLowerCase() === item.to.toLowerCase() ? 'in' : 'out',
            }))
          resolve(transactions)
          console.log('TOKEN', transactions)
        } else { console.error('res:status ETH false', res) }
      })
  })


const send = (from, to, amount) => {
  const { user: { ethData: { address } } } = getState()
  let tokenContract

  const options = {
    from: address,
    gas: `${config.services.web3.gas}`,
    gasPrice: `${config.services.web3.gasPrice}`,
  }

  tokenContract = new web3.eth.Contract(abi, from, options)

  return new Promise((resolve, reject) =>
    tokenContract.methods.transfer(to, amount).send()
      .then(receipt => {
        resolve(receipt)
      })
  )
}


export default {
  login,
  getBalance,
  getTransaction,
  send,
  fetchBalance,
}
