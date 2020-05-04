<template>
	<view class="user">
		<uni-title>我的歌单</uni-title>
		<view class="music-form-wrap">
			<view class="music-card-wrap" v-for="(item, index) in musicFormList" :key="index">
				<text>{{item.songFormName}}</text>
			</view>
		</view>
		
	</view>
</template>

<script>
export default {
	data() {
		return {
			musicFormList: []
		}
	},
	mounted(){
		this.musicFormList = uni.getStorageSync('musicFormList');
	},
	methods: {
		
	}
}
</script>

<style>
.user{
	
}
.user  .music-form-wrap{
	
}
</style>
