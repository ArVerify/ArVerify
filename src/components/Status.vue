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
            @test="handleClick"/>
      </div>
    </div>
  </div>
</template>

<script>
    import StatusCircle from "./StatusCircle";
    import {checkTipped, checkVerified} from "../plugins/arverify";
    import {getCurrentAddress} from "../plugins/vue-arweave";

    export default {
        name: "Status",
        components: {StatusCircle},
        data() {
            return {
                verified: undefined,
                tipped: undefined,
                status: {
                    unverified: {
                        color: "red",
                        statusText: "unverified",
                        buttonHtml: "Click here to verify"
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
                    }
                }
            }
        },
        methods: {
            handleClick() {
                console.log("TEST")
            }
        },
        computed: {
            mode() {
                if (this.verified) return this.status.verified
                if (this.tipped) return this.status.inProgress
                return this.status.unverified
            }
        },
        async mounted() {
            let address = await getCurrentAddress()
            this.verified = await checkVerified(address)
            this.tipped = await checkTipped(address, "s-hGrOFm1YysWGC3wXkNaFVpyrjdinVpRKiVnhbo2so")
        }
    }
</script>

<style scoped>

</style>