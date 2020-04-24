<template>
	<view class="play">
		<view class="play-bg"><image class="bg-img" src="http://39.107.123.212:8848/tiantong/file/imgShow/b40c30d384454c53a5b45a5ebfecca91.jpg"></image></view>
		<view class="play-head" :style="{ marginTop: iStatusBarHeight + 'px'}">
			<view class="my-normal-btn title-btn" @click="showPlayList">
				<i class="icon-mini-return"></i>
			</view>
			<uni-notice-bar 
				:scrollable="false" 
				:single="true" 
				text="届かない恋 " />
		</view>
		
		
	</view>
</template>

<script>
import uniNoticeBar from '@/component/uni-notice-bar/uni-notice-bar.vue'
export default {
	components:{
		uniNoticeBar
	},
	data() {
		return {
			iStatusBarHeight:0,
		}
	},
	onLoad() {
		this.iStatusBarHeight = uni.getSystemInfoSync().statusBarHeight
	},
	methods: {
		
	}
}
</script>

<style>
.play{
	position: relative;
	width: 750rpx;
	height: 100vh;
}
.play .play-bg{
	position: absolute;
	top: 0;
	left: 0;
	width: 750rpx;
	height: 100vh;
	overflow: hidden;
}
.play .play-bg .bg-img{
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translateX(-50%) translateY(-50%);
	width: 800rpx;
	height: 120vh;
	filter: blur(100px);
}
.play .play-head{
	position: absolute;
	display: flex;
	flex-wrap: nowrap;
	z-index: 20;
	top: 0;
	left: 0;
	height: 100rpx;
	width: 750rpx;
	justify-content: ;
}
.play .title-btn{
	margin: 25rpx 40rpx;
}
</style>
