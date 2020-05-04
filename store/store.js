import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    loading: false,
    user: null,
    playList: [],//播放列表
    activeIndex: 0,//选中的音乐
		playState: 1,//播放状态
		music: '',//音乐
		token: ''
  },
});
  
export default store;