<template>
	<view class="user">
		<text class="user-title">我的歌单</text>
		<view class="music-form-wrap">
			<view 
				class="music-card-wrap" 
				v-for="(item, index) in musicFormList" 
				:key="index" 
				@click="toMusicList(item.id)">
				<view class="music-card-img-wrap">
					<image class="music-card-img" :src="$global.imgUrl+item.posterUrl" mode="widthFix"></image>
				</view>
				<text class="music-card-name">{{item.songFormName}}</text>
			</view>
		</view>
		
	</view>
</template>

<script>
export default {
	data() {
		return {
			musicFormList: [],
		}
	},
	mounted(){
		this.musicFormList = uni.getStorageSync('musicFormList');
	},
	methods: {
		//跳转到歌单页
		toMusicList(id){
			uni.navigateTo({
			  url: '../user/musicFormList?id=' + id
			});
		},
	}
}
</script>

<style>
.user{
	
}
.user .user-title{
	display: block;
	height: 7vh;
	width: 690rpx;
	margin: 0 auto;
	font-weight: bold;
	border-bottom: 1rpx solid #eee;
	line-height: 7vh;
}
.user .music-form-wrap{
	display: block;
	width: 690rpx;
	margin: 0 auto;
}
.user .music-form-wrap .music-card-wrap{
	position: relative;
	height: 10vh;
	width: 100%;
	border-bottom: 1rpx solid #eee;
}
.user .music-form-wrap .music-card-img-wrap{
	position: absolute;
	top: 50%;
	transform: translateY(-50%);
	height: 90rpx;
	width: 90rpx;
	border-radius: 15rpx;
	overflow: hidden;
}
.user .music-form-wrap .music-card-wrap .music-card-img{
	position: absolute;
	top: 50%;
	transform: translateY(-50%);
	height: 100%;
	width: 100%;
}
.user .music-form-wrap .music-card-wrap .music-card-name{
	position: absolute;
	left: 120rpx;
	line-height: 10vh;
	font-size: 30rpx;
}
</style>
