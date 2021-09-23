import Vue from 'vue'
import App from './App.vue'
import router from "./routes"
import vuetify from './plugins/vuetify'
import store from "./store/store"
import Notifications from 'vue-notification'
import moment from 'moment'

Vue.config.productionTip = false

Vue.use(Notifications);
Vue.filter('formatdate', function (value) {
  if (!value) return ''
  value = value.toString()
  return moment(value).format("YYYY/MM/DD");   
})

new Vue({
  vuetify,
  store,
  router,
  render: h => h(App)
}).$mount('#app')
