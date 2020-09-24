import $ar from "./vue-arweave";


async function tipAuthNode(authNodeAddress) {
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


}

function requestURI(address, authNodeURL) {
    return axios.get(authNodeURL + "/verify",
        {
            params: {address: address}
        }
    ).then(response => {
        console.log(response)
        return response.data.uri
    }).catch(error => {
        console.log(error.response.data)
    })
}

export function verifyAddress(address, authNodeAddress) {
    //check if tip is stored in localStorage
    let tipped = !!localStorage.getItem("tipped")
    if (!tipped) {
        //check if tipped previously
        tipped = checkTipped(address, authNodeAddress)

        if (!tipped) {
            let tx = tipAuthNode(authNodeAddress)
            tipped = true
        }

        //if tipped set to localStorage
        localStorage.setItem("tipped", tx.id)
    }

    return requestURI(address)
}

export function checkTipped(userAddress, authNodeAddress) {
    return axios({
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
    }).then((result) => {
        console.log(result.data)
        let edges = result.data.data.transactions.edges
        return edges.length > 0
    });

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