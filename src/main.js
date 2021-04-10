import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import './helpers'
import store from './store'
import moment from 'moment'
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.config.productionTip = false
Vue.use(VueAxios, axios)
Vue.prototype.moment = moment

new Vue({
  store,
  render: (h) => h(App),
}).$mount('#app')
