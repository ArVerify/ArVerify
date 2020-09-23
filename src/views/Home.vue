<template>
  <div>
    <navigation></navigation>
    <wallet-information></wallet-information>
    <status></status>
  </div>
</template>

<script>
    import Navigation from "../components/Navigation";
    import WalletInformation from "../components/WalletInformation";
    import Status from "../components/Status";

    export default {
        name: "Home",
        components: {Status, WalletInformation, Navigation}
    }
</script>

<style scoped>

</style>