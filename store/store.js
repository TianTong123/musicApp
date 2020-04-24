import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    loading: false,
    user: '',
    playList: [],//播放列表
    activeIndex: 0,//选中的音乐
  },
});
  
export default store;