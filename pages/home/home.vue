<template>
	<view class="home">
		<swiper class="home-swiper" 
			circular 
			:indicator-dots="true" 
			:autoplay="true" 
			:interval="5000" 
			:duration="500">
			<swiper-item
				v-for="(e, index) in slides"
				:key="index">
				<view class="swiper-item"><image :src="$global.imgUrl+e.picUrl" ></image></view>
			</swiper-item>
		</swiper>
		<text class="big-title">热门推荐</text>
		<view class="card-wrap">
			<view class="card" v-for="e in hotList" :key="e.id" @click="toPlay(e)">
				<view class="card-img-wrap">
					<image :src="$global.imgUrl+e.posterUrl" mode="widthFix"></image>
				</view>
				<view class="card-text-wrap">
					<text>{{e.name}}</text>
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
				hotList: []
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
					else{this.$myMsg.notify({content: data.msg, type: 'error'})}  
				})
			},
			//播放
			toPlay: (val) => util.toPlay(val)
		}
	}
</script>

<style>
.home .home-swiper{
	display: block;
	margin: 30rpx auto;
	width: 700rpx;
	height: 360rpx;
}
.home .home-swiper image{
	width: 100%;
}
.home .big-title{
	display: block;
	margin: 45rpx 0 15rpx 0;
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
	width: 750rpx;
	height: 600rpx;
}
.home .card-wrap .card{
	position: relative;
	margin:5rpx 25rpx;
	width: 200rpx;
	height: 200rpx;
	overflow: hidden;
}
.home .card-wrap .card image{
	z-index: 3;
	left: 50%;
	transform: translateX(-50%);
	height: 200rpx;
	width: 200rpx;
}
.home .card-text-wrap{
	position: absolute;
	bottom: 30rpx;
	height: 30rpx;
	font-size: 26rpx;
	line-height: 30rpx;
	overflow: hidden;
}

</style>
