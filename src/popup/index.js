import Vue from 'vue'
import 'bulma-fluent/bulma.sass'
import '../assets/styles/index.css';

import App from './App.vue'

Vue.config.productionTip = false;

// eslint-disable-next-line
new Vue({
  el: '#app',
  render: h => h(App),
})
