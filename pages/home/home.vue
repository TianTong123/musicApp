<template>
	<view class="home">
		<!-- 轮播图 -->
		<!-- <swiper class="home-swiper" 
			circular 
			:indicator-dots="true" 
			:autoplay="true" 
			:interval="5000" 
			:duration="500">
			<swiper-item
				v-for="(e, index) in slides"
				:key="index">
				<view class="swiper-item"><image class="swipe-item-image" :src="$global.imgUrl+e.picUrl"  mode="heightFix"></image></view>
			</swiper-item>
		</swiper> -->
		<bw-swiper 
			:swiperList="slides" 
			imageKey="picUrl"
			width="100"
			:swiperType="true"
			swiperHeight="360rpx"
			style="width:100%; margin: 40rpx 0;">
		</bw-swiper>
		
		<!-- 菜单横幅 -->
		<view class="menu-bar">
			<view class="menu-left-card">
					<image src="../../static/images/type3.png"></image>
			</view>
			<view class="menu-right-card">
				<view class="menu-card">
					歌手
					<view class="menu-btn"><i class="icon-music"></i></view>
				</view>
				<view class="menu-card">
					排行榜
					<view class="menu-btn"><i class="icon-rank"></i></view>
				</view>
			</view>
			
		</view>
		
		<!-- 热门推荐 -->
		<text class="big-title">热门推荐</text>
		<view class="card-wrap">
			<view class="card" v-for="e in hotList" :key="e.id" @tap="toPlay(e)">
				<view class="card-img-wrap " >
					<view class="my-mini-btn play-num-btn">
						<i class="icon-mini-play my-mini-btn"></i>
						{{e.playNum}}
					</view>
					<image class="card-img" :src="$global.imgUrl+e.posterUrl" mode="heightFix"></image>
				</view>
				<view class="card-text-wrap">
					{{e.name}}
				</view>
			</view>
		</view>
		
	</view>
</template>

<script>
import util from '@/util/utils.js';
import bwSwiper from '@/component/bw-swiper/bw-swiper.vue'
export default {
	components:{
		bwSwiper
	},
	data() {
		return {
			slides: [],
			hotList: [],
		}
	},
	mounted(){
		this.getSlides();
		this.getHotList();
	},
	methods: {
		//获取轮播图
		getSlides(){
			this.$http.getSwipeList().then(({data}) => {
				if (data.code == 0){
					this.slides = data.data;
				}else{
					//this.$myMsg.notify({content: data.msg, type: 'error'})
				}  
			})
		},
		
		//获取热门推荐
		getHotList(){
			this.$http.getHotRecommend().then(({data}) => {
				if (data.code == 0){
					this.hotList = data.data;
				}
				else{}  
			})
		},
		
		//播放
		toPlay: (val) => util.toPlay(val)
	}
}
</script>

<style>
@import url("../../static/css/home.css");
</style>
