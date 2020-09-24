<template>
  <div>
    <div class="flex items-stretch">
      <div class="w-1/2 text-6xl font-bold">ArVerify.</div>
      <div class="w-1/2 self-center text-right">
        <button @click="logout">Logout</button>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
        name: "Navigation",
        methods:{
            logout(){
                localStorage.removeItem("jwk")
                location.reload()
            }
        }
    }
</script>

<style scoped>

</style>