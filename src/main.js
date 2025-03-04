import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/styles/main.scss'
import './assets/styles/app.scss'

import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.use(VueAxios, axios)
Vue.use(Element)
Vue.config.productionTip = false
axios.defaults.baseURL = 'http://localhost:5000/api/';
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
