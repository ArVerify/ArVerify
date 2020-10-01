import $ar from "./vue-arweave";


export async function tipAuthNode(authNodeAddress) {
    let fee = '0.0001'
    let key = JSON.parse(localStorage.getItem("jwk"))

    let transaction = await $ar.createTransaction({
        target: authNodeAddress,
        quantity: $ar.ar.arToWinston(fee)
    }, key)

    transaction.addTag('App-Name', 'ArVerifyDev');
    transaction.addTag('Type', 'Tip');

    await $ar.transactions.sign(transaction, key);
    await $ar.transactions.post(transaction);

    return transaction

}

export async function requestURI(address, authNodeURL) {
    try {
        let response = await axios.get(authNodeURL + "/verify", {params: {address: address}})
        return response.data.uri
    } catch (error) {
        console.log(error.response.data)
        throw Error(error.response.data.message)
    }
}

export async function verifyAddress(address, authNodeAddress) {
    //check if tip is stored in localStorage
    let tx = localStorage.getItem("tipped")
    if (!tx) {
        //check if tipped previously
        console.log("Checking Arweave for tip")
        tx = await checkTipped(address, authNodeAddress)
        console.log("Found tip: " + tx)

        if (!tx) {
            try {
                tx = await tipAuthNode(authNodeAddress)
                console.log(tx)
            } catch (e) {
                console.log(e)
                throw Error("Error while tipping")
            }
        }
        //if tipped set to localStorage
        localStorage.setItem("tipped", tx.id)
    }

    let status = await $ar.transactions.getStatus(tx)

    if (status.status === 410) {
        localStorage.removeItem("tipped")
        throw Error("Tipping was not successful")
    }
    if (status.status > 200) {
        console.log(status)
        throw Error("Tipping was not successful")
    }

    return tx
}

export async function checkTipped(userAddress, authNodeAddress) {
    try {
        let response = await axios({
            url: 'https://arweave.dev/graphql',
            method: 'post',
            data: {
                variables: {
                    owner: userAddress,
                    recipient: authNodeAddress
                },
                query: `
                                query transactions($owner: String!, $recipient: String!) {
                                  transactions(
                                    owners: [$owner]
                                    recipients: [$recipient]
                                    tags: [
                                      { name: "App-Name", values: ["ArVerifyDev"] },
                                      { name: "Type", values: ["Tip"] },
                                    ]
                                  ) {
                                    edges {
                                      node {
                                        quantity {
                                          ar
                                        }
                                      }
                                    }
                                  }
                                }
                                `
            }
        })

        console.log("TipTX: " + response.data)
        console.log(response.data)
        let edges = response.data.data.transactions.edges
        return edges[0].node.id
    } catch (e) {
        console.log(e)
        throw Error("No Tip Found")
    }

}

export function checkVerified(address) {
    return axios({
        url: 'https://arweave.dev/graphql',
        method: 'post',
        data: {
            variables: {
                address: address,
                authNodes: ["s-hGrOFm1YysWGC3wXkNaFVpyrjdinVpRKiVnhbo2so"],
            },
            query: `
                query transactions($authNodes: [String!], $address: String!) {
                  transactions(
                    owners: $authNodes
                    tags: [
                      { name: "App-Name", values: ["ArVerifyDev"] }
                      { name: "Type", values: ["Verification"] }
                      { name: "Address", values: [$address] }
                    ]
                  ) {
                    edges {
                      node {
                        id
                        tags {
                          name
                          value
                        }
                      }
                    }
                  }
                }
                `
        }
    }).then((result) => {
        console.log(result.data)
        let edges = result.data.data.transactions.edges
        return edges.length > 0
    });
}