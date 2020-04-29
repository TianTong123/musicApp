<template>
	<view class="home">
		<!-- 轮播图 -->
		<swiper class="home-swiper" 
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
		</swiper>
		
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
	import util from '@/util/utils.js'
	export default {
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
.home .menu-bar{
	display: flex;
	z-index: 999;
	margin:  0 30rpx;
	height: 300rpx;
	width: 690rpx;
	justify-content: center;
}
.home .menu-bar .menu-left-card{
	display: inline-block;
	margin-right: 10rpx;
	width: 296rpx;
	height: 296rpx;
	border-radius: 4rpx;
	border: 2rpx solid #aaa;
}
.home .menu-bar .menu-left-card image{
	width: 296rpx;
	height: 296rpx;
	overflow: hidden;
}
.home .menu-bar .menu-right-card{
	display: inline-block;
	width: 380rpx;
	height: 300rpx;
}
.home .menu-bar .menu-card{
	display: inline-block;
	width: 380rpx;
	height: 141rpx;
	font-size: 25rpx;
	line-height: 150rpx;
	text-align: right;
	border-radius: 4rpx;
	border: 2rpx solid #aaa;
	background-image: url(../../static/images/type1.png);
}
.home .menu-bar .menu-card:nth-of-type(2){
	margin-top: 11rpx;
	background-image: url(../../static/images/type2.png);
}
.home .menu-bar .menu-btn{
	display: inline-block;
	vertical-align: top;
	margin: 27.5rpx 20rpx;
	height: 80rpx;
	width: 80rpx;
	border-radius: 50rpx;
	overflow: hidden;
	background-color: #3a3a3c;
}
.home .menu-bar .menu-btn i{
	margin: 20rpx auto;
	display: block;
	height: 40rpx;
	width: 40rpx;
}
.home .home-swiper{
	display: block;
	margin: 40rpx auto;
	width: 690rpx;
	height: 360rpx;
	border-radius: 4rpx;
	border: 2rpx solid #aaa;
	overflow: hidden;
}
.home .home-swiper .swipe-item-image{
	width: 690rpx;
	height: 360rpx;
}
.home .uni-swiper-dot{
	background: #aaa;
}
.home .uni-swiper-dot-active{
	background-color: #c20c0c;
}
.home .big-title{
	display: block;
	margin: 15rpx 0;
	padding-top: 20rpx;
	padding-left: 25rpx;
	width: 750rpx;
	height: 40rpx;
	line-height: 40rpx;
	font-size: 35rpx;
	font-weight: bold;
}
.home .card-wrap{
	display: flex;
	justify-content: space-between;
	flex-wrap: wrap;
	justify-content: space-between;
	margin: 15rpx auto;
	width: 690rpx;
	height: 700rpx;
}
.home .card-wrap .card{
	position: relative;
	width: 226rpx;
	height: 180rpx;
	overflow: hidden;
}
.home .card-wrap .card .card-img-wrap{
	height: 146rpx;
	width: 222rpx;
	border-radius: 4rpx;
	border: 2rpx solid #aaa;
}
.home .card-wrap .card .card-img{
	height: 146rpx;
	width: 222rpx;
	overflow: hidden;
}
.home .card-text-wrap{
	position: absolute;
	display: block;
	font-size: 26rpx;
	line-height: 30rpx;
	word-break:normal; 
	white-space:nowrap;
}
.home .play-num-btn{
	position: absolute;
	display: block;
	z-index: 999;
	top: 10rpx;
	right: 10rpx;
	width: 100%;
	height: 25rpx;
	text-align: right;
	font-size: 20rpx;
	line-height: 25rpx;
	color: #fff;
}
.home .play-num-btn i{
	display: inline-block;
	vertical-align: top;
	margin-right: 10rpx;
	width: 20rpx;
	height: 20rpx;
}
</style>
