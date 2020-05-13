import Vue from 'vue'
import App from './App'
import api from "@/service/api.js";
import global from './store/global.js' ; //全局变量
import store from './store/store.js'


Vue.config.productionTip = false;
Vue.prototype.$http = api;
Vue.prototype.$global = global;
Vue.prototype.$store = store;
Vue.prototype.$music =  uni.createInnerAudioContext(); //创建播放器对象

App.mpType = 'app'

const app = new Vue({
    ...App,
		store
})
app.$mount()

