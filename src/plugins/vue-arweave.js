import Arweave from 'arweave';

const $ar = Arweave.init(
    {
        host: 'arweave.net',// Hostname or IP address for a Arweave host
        port: 443,          // Port
        protocol: 'https',  // Network protocol http or https
        timeout: 20000,     // Network request timeouts in milliseconds
        logging: false,     // Enable network request logging
    }
);

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