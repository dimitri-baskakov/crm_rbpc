import Vue from 'vue'
import store from './store'
import router from './router'
import './plugins/base'
import './plugins/chartist'
import './plugins/vee-validate'
import vuetify from './plugins/vuetify'
import i18n from './i18n'
import axios from 'axios'
import App from './App.vue'
import VueSwal from 'vue-swal'
import CKEditor from 'ckeditor4-vue';

Vue.use(CKEditor);
Vue.use(VueSwal)

if (!store.getters.locale) {
  store.commit('setLocale', i18n.locale)
}
const locale = store.getters.locale
i18n.locale = locale

Vue.config.productionTip = false
Vue.prototype.$http = axios;
Vue.prototype.$http.defaults.headers.common['Accept'] = "application/json";
Vue.prototype.$http.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
Vue.prototype.$http.defaults.headers.common['Content-Type'] = "application/json";
Vue.prototype.$http.defaults.headers.common['Accept-Language'] = locale;
Vue.prototype.$http.defaults.headers.common['Authorization'] = 'bearer ' + store.getters.token;
Vue.prototype.$http.defaults.baseURL =  process.env.VUE_APP_API_URL+ "/api/v1/admin";

Vue.prototype.$eventHandle = new Vue();

let locales = Object.keys(vuetify.framework.lang.locales)
Vue.prototype.$locales = locales.sort((a, b) => {
  if (a === locale) return -1
  return 0
});

new Vue({
  store,
  vuetify,
  i18n,
  router,
  render: h => h(App),
}).$mount('#app')
