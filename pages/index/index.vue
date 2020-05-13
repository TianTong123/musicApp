<template>
	<view class="index">
		<view class="top-bar" :style="{ marginTop: iStatusBarHeight + 'px'}">
			<image @click="showLeft = true" class="menu" src="../../static/images/icon/menu.png"></image>
			<scroll-view 
				id="tab-bar" 
				class="nav" 
				:scroll-x="true" 
				:show-scrollbar="false" 
				:scroll-into-view="scrollInto" 
				style="text-align: center">
			    <view 
						v-for="(tab,index) in tabBars" 
						:key="tab.id" 
						:class="tabIndex==index ? 'uni-tab-item-active uni-tab-item' : 'uni-tab-item'" 
						:id="tab.id" 
						:data-current="index" 
						@click="ontabtap">
			      <text class="uni-tab-item-title" >{{tab.name}}</text>
			    </view>
			</scroll-view>
			<image class="menu" src="../../static/images/icon/search.png"></image>
		</view>
		<!-- 右边抽屉 -->
		<uni-drawer 
			:visible="showLeft"
			:bar-height="iStatusBarHeight" 
			mode="left" 
			@close="showLeft = false">
		</uni-drawer>
		<!-- 显示内容 -->
		<view class="content" :style="{ marginTop: iStatusBarHeight + 'px'}">
			<swiper 
				@change="onSwiperChange"
				:current="tabIndex" 
				class="swiper-box" 
				style="height: 100%;"
				:duration="300">
				<swiper-item class="swripe-item">
					<home></home>
				</swiper-item>
				<swiper-item class="swripe-item">
					<user></user>
				</swiper-item>
				<!-- <swiper-item class="swripe-item">
					<singer></singer>
				</swiper-item> -->
				<!-- <swiper-item class="swripe-item">
					<rank></rank>
				</swiper-item> -->	
			</swiper>
		</view>	
		
		<!-- 播放条 -->
		<player-control @showPlay="showPlay"></player-control>
		
	</view>
</template>

<script>
import uniDrawer from '@/component/drawer/drawer.vue';
import playerControl from '@/component/playerControl/playerControl.vue'
import home from '../home/home.vue';
import rank from '../rank/rank.vue';
import singer from '../singer/singer.vue';
import user from '../user/user.vue';

// 缓存每页最多
const MAX_CACHE_DATA = 100;
// 缓存页签数量
const MAX_CACHE_PAGE = 3;
export default {
  components: {
	  uniDrawer, home, rank, singer, user, playerControl
  },
  data() {
    return {
			scrollInto: "",
			tabIndex: 0,
			scrollInto: "",
			pageList: [],
			iStatusBarHeight:0,//通知栏高度
			tabBars: [{
				name: '首页',
				id: 'home'
			}, {
				name: '我的',
				id: 'user'
			}],
			showLeft: false,
			isShowPlay: false
		}
  },
  onLoad() {
		this.iStatusBarHeight = uni.getSystemInfoSync().statusBarHeight
  },
  methods: {
		//tab点击
		ontabtap(e) {
			let index = e.target.dataset.current || e.currentTarget.dataset.current;
			this.switchTab(index);
		},
		//滑动页面时
		onSwiperChange(val){
			let index = val.target.current || val.detail.current;
			this.switchTab(index);
			console.log(index)
		},
		//切换tab
		switchTab(index) {
			if (this.tabIndex === index) {
				 return;
			}

			this.tabIndex = index;
			this.scrollInto = this.tabBars[index].id;
		},
		
		//显示播放页
		showPlay(val){
			this.isShowPlay = true
		},
		//页面跳转
		// goTabPage(pageName){
		// 	uni.navigateTo({
		// 	    url: `/pages/${pageName}/${pageName}`
		// 	})
		// }
	}
}
</script>

<style>
@import url("../../static/css/index.css");
</style>
