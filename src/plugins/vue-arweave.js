import Arweave from 'arweave';

// Since v1.5.1 you're now able to call the init function for the web version without options. The current path will be used by default, recommended.
const $ar = Arweave.init();

export function loggedIn() {
    return !!localStorage.getItem('jwk')
}

export async function getCurrentAddress() {
    let key = JSON.parse(localStorage.getItem("jwk"))
    if (key) {
        return await $ar.wallets.jwkToAddress(key)
    }
    else return undefined
}

export async function getBalance() {
    let address = await getCurrentAddress()
    if (address) {
        let balance = await $ar.wallets.getBalance(address)
        return $ar.ar.winstonToAr(balance)
    }
    else return undefined
}

export default $ar