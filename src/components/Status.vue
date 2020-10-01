<template>
  <div class="flex flex-col justify-center">
    <div class="text-center font-bold text-2xl">Your Status.</div>
    <div :class="`text-center font-bold text-2xl text-${mode.color}-700`">{{mode.statusText}}</div>
    <div>
      <div class="flex justify-center">
        <status-circle
            :color="mode.color"
            :button-html="mode.buttonHtml"
            :verified="verified"
            @clicked="verify"/>
      </div>
    </div>
  </div>
</template>

<script>
    import StatusCircle from "./StatusCircle";
    import {checkTipped, checkVerified, verifyAddress, requestURI, tipAuthNode} from "../plugins/arverify";
    import $ar, {getCurrentAddress} from "../plugins/vue-arweave";

    export default {
        name: "Status",
        components: {StatusCircle},
        data() {
            return {
                inProgress: undefined,
                errored: undefined,
                waitingForTip: undefined,
                waitingForSignIn: undefined,
                verified: undefined,
                tipped: undefined,
                address: undefined,
                status: {
                    unverified: {
                        color: "red",
                        statusText: "unverified",
                        buttonHtml: "Click here to verify"
                    },
                    waitingForTip: {
                        color: "orange",
                        statusText: "verification in progess",
                        buttonHtml: "Waiting for tip to complete"
                    },
                    waitingForSignIn: {
                        color: "orange",
                        statusText: "verification in progess",
                        buttonHtml: "Click here to sign in"
                    },
                    inProgress: {
                        color: "orange",
                        statusText: "verification in progess",
                        buttonHtml: "Verification is in progess"
                    },
                    verified: {
                        color: "green",
                        statusText: "verified",
                        buttonHtml: "You are verified"
                    },
                    errored: {
                        color: "red",
                        statusText: "Verification failed",
                        buttonHtml: "An error occurred"
                    }
                }
            }
        },
        methods: {
            async waitUntilTxProcessed(transactionId) {
                return await new Promise(resolve => {
                    $ar.transactions.getStatus(transactionId).then(response => {
                        if (response.status === 200) {
                            resolve('foo');
                        } else {
                            const interval = setInterval(() => {
                                console.log("Waiting for " + transactionId + "to be completed")
                                $ar.transactions.getStatus(transactionId).then(response => {
                                    if (response.status === 200) {
                                        resolve('foo');
                                        clearInterval(interval);
                                    }
                                })
                            }, 5000);
                        }
                    })
                });
            },
            async verify() {
                let verified;
                if (this.$route.query.txId) {
                    console.log(this.$route.query.txId)
                    this.inProgress = true
                    await this.waitUntilTxProcessed(this.$route.query.txId)
                    this.inProgress = false
                } else {
                    let verified = await checkVerified(this.address)
                    if (!verified) {
                        this.waitingForTip = true
                        let alreadyTipped = await checkTipped(this.address, "s-hGrOFm1YysWGC3wXkNaFVpyrjdinVpRKiVnhbo2so")
                        if (!alreadyTipped) {
                            let transaction = await tipAuthNode("s-hGrOFm1YysWGC3wXkNaFVpyrjdinVpRKiVnhbo2so")
                            await this.waitUntilTxProcessed(transaction.id)
                        }
                        console.log(alreadyTipped)
                        this.waitingForTip = false
                        this.tipped = true
                        let url = await requestURI(this.address, "https://afc0b97f16fc.ngrok.io")
                        console.log(url)
                        window.location = url
                    }
                }

                verified = await checkVerified(this.address)
                this.verified = verified
            }
        },
        computed: {
            mode() {
                if (this.errored) return this.status.errored
                if (this.verified) return this.status.verified
                if (this.tipped) return this.status.waitingForSignIn
                if (this.waitingForTip) return this.status.waitingForTip
                if (this.inProgress) return this.status.inProgress
                return this.status.unverified
            }
        },
        async mounted() {
            this.address = await getCurrentAddress()
            //this.verified = await checkVerified(this.address)
            //this.tipped = await checkTipped(this.address, "s-hGrOFm1YysWGC3wXkNaFVpyrjdinVpRKiVnhbo2so")
        }
    }
</script>

<style scoped>

</style>