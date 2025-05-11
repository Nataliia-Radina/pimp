import { ref } from 'vue'
import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import { SAPPHIRE_TESTNET } from '../config/network'

const wallet = ref(null)
const address = ref(null)
const chainId = ref(null)
const error = ref(null)

const web3Modal = new Web3Modal({
  cacheProvider: true,
  providerOptions: {}
})

export function useWallet() {
  const connect = async () => {
    try {
      const instance = await web3Modal.connect()
      const provider = new ethers.providers.Web3Provider(instance)
      const signer = provider.getSigner()
      const addr = await signer.getAddress()
      const network = await provider.getNetwork()

      wallet.value = signer
      address.value = addr
      chainId.value = network.chainId

      // Switch to Sapphire Testnet if not already on it
      if (network.chainId !== parseInt(SAPPHIRE_TESTNET.chainId)) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: SAPPHIRE_TESTNET.chainId }],
          })
        } catch (switchError) {
          // If the chain hasn't been added to MetaMask
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [SAPPHIRE_TESTNET],
            })
          } else {
            throw switchError
          }
        }
      }

      error.value = null
      return true
    } catch (e) {
      console.error('Connect error:', e)
      error.value = e.message
      return false
    }
  }

  const disconnect = async () => {
    await web3Modal.clearCachedProvider()
    wallet.value = null
    address.value = null
    chainId.value = null
    error.value = null
  }

  return {
    wallet,
    address,
    chainId,
    error,
    connect,
    disconnect,
  }
}
