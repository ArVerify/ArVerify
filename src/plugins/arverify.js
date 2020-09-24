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