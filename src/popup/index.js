import Vue from 'vue'
import 'bulma-fluent/bulma.sass'
import '../assets/styles/index.css'

// https://github.com/shakee93/vue-toasted
import Toasted from 'vue-toasted'
// https://github.com/Inndy/vue-clipboard2
import VueClipboard from 'vue-clipboard2'

Vue.use(Toasted)
Vue.use(VueClipboard)

import App from './App.vue'

Vue.config.productionTip = false

// eslint-disable-next-line
new Vue({
  el: '#app',
  render: h => h(App),
})
