import Vue from 'vue'

import 'normalize.css/normalize.css'// A modern alternative to CSS resets

import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css' // element

import vuescroll from 'vuescroll/dist/vuescroll-native';
import 'vuescroll/dist/vuescroll.css'; // vuescroll

import '@/styles/index.scss' // global css

import App from './App'
import router from './router'
import store from './store'
import i18n from './lang' // Internationalization
import './icons' // icon
import './errorLog'// error log
import './permission' // permission control
import './mock' // simulation data
import * as filters from './filters' // global filters
import $ from 'jquery'
import 'font-awesome/css/font-awesome.css'
import 'vue-lunar-full-calendar'
import { codemirror } from 'vue-codemirror' // 代码编辑器
import 'codemirror/lib/codemirror.css'
import _ from 'lodash'
import echarts from 'echarts' // 引入echarts图表

Vue.use(codemirror)
Vue.use(vuescroll);
Vue.use(Element, {
  size: 'medium', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})

Vue.prototype.$echarts = echarts
// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  template: '<App/>',
  components: { App }
})
