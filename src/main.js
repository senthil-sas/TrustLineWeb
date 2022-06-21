import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './styles/common.css';
import vuetify from './plugins/vuetify'

// customized toasts
import { default as notification } from "./components/notification/index.js";
Vue.prototype.$notification = notification;
Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
