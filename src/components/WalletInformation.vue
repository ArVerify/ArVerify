<template>
  <div class="flex flex-col justify-center">
    <div class="flex justify-center">
      <div class="self-center px-6 font-bold text-3xl">{</div>
      <div class="self-center font-light">address</div>
      <div class="self-center px-6 font-bold text-3xl">}</div>
    </div>
    <h-bar/>
    <div class="px-48">
      <div class="text-center font-bold text-lg">Your Balance.</div>
      <div class="bg-gray-500 py-5">
        <div class="text-center text-white font-light text-2xl">0.01020102102012 AR</div>
      </div>
    </div>
  </div>
</template>

<script>
    import HBar from "./HBar";

    export default {
        name: "WalletInformation",
        components: {HBar}
    }
</script>

<style scoped>

</style>