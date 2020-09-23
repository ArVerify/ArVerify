import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import './assets/tailwind.css'

Vue.config.productionTip = false

new Vue({
  router,
  render: function (h) { return h(App) }
}).$mount('#app')
