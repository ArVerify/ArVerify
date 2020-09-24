<template>
  <div class="p-4">
    <login></login>
    <navigation></navigation>
    <wallet-information></wallet-information>
    <h-bar></h-bar>
    <status></status>
    <h-bar></h-bar>
  </div>
</template>

<script>
    import Navigation from "../components/Navigation";
    import WalletInformation from "../components/WalletInformation";
    import Status from "../components/Status";
    import HBar from "../components/HBar";
    import Login from "../components/Login";

    export default {
        name: "Home",
        components: {Login, HBar, Status, WalletInformation, Navigation}
    }
</script>

<style scoped>

</style>