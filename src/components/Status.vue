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
            @clicked="handleClick"/>
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
            async waitUntil(condition) {
                return await new Promise(resolve => {
                    const interval = setInterval(() => {
                        console.log("Waiting to be completed")
                        if (condition) {
                            resolve('foo');
                            clearInterval(interval);
                        }
                    }, 1000);
                });
            },
            async verify() {
                let verified = await checkVerified(this.address)
                if (!verified) {
                    this.waitingForTip = true
                    let alreadyTipped = await checkTipped(this.address, "s-hGrOFm1YysWGC3wXkNaFVpyrjdinVpRKiVnhbo2so")
                    if (!alreadyTipped) {
                        let transaction = await tipAuthNode("s-hGrOFm1YysWGC3wXkNaFVpyrjdinVpRKiVnhbo2so")
                        await this.waitUntil(await $ar.transactions.getStatus(transaction).status === 200)
                    }
                    this.waitingForTip = false
                }
            },
            async handleClick() {
                try {
                    this.waitingForTip = true
                    this.waitingForSignIn = await verifyAddress(this.address, "s-hGrOFm1YysWGC3wXkNaFVpyrjdinVpRKiVnhbo2so")
                    let url = await requestURI(this.address, "https://6660c0c3c602.ngrok.io")
                    window.location = url
                } catch (e) {
                    this.waitingForTip = false
                    this.tipped = false
                    this.errored = true
                }
            }
        },
        computed: {
            mode() {
                if (this.errored) return this.status.errored
                if (this.verified) return this.status.verified
                if (this.tipped) return this.status.waitingForSignIn
                if (this.waitingForTip) return this.status.waitingForTip
                return this.status.unverified
            }
        },
        async mounted() {
            this.address = await getCurrentAddress()
            this.verified = await checkVerified(this.address)
            this.tipped = await checkTipped(this.address, "s-hGrOFm1YysWGC3wXkNaFVpyrjdinVpRKiVnhbo2so")
        }
    }
</script>

<style scoped>

</style>