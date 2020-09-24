<template>
  <div class="p-4">
    <navigation></navigation>
    <div v-if="!loggedIn">
      <login></login>
    </div>
    <div v-else>
      <wallet-information></wallet-information>
      <h-bar></h-bar>
      <status></status>
      <h-bar></h-bar>
    </div>
  </div>
</template>

<script>
    import {loggedIn} from '../plugins/vue-arweave';
    import Navigation from "../components/Navigation";
    import WalletInformation from "../components/WalletInformation";
    import Status from "../components/Status";
    import HBar from "../components/HBar";
    import Login from "../components/Login";


    export default {
        name: "Home",
        components: {Login, HBar, Status, WalletInformation, Navigation},
        data(){
            return{
                loggedIn: loggedIn()
            }
        }
    }
</script>

<style scoped>

</style>