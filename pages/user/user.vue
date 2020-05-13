<template>
	<view class="user">
		<text class="user-title" v-show="!isShowMusicForm">我的歌单</text>
		<view class="music-form-wrap" v-show="!isShowMusicForm">
			<view 
				class="music-card-wrap" 
				v-for="(item, index) in musicFormList" 
				:key="index" 
				@click="showMusicForm(item.id)">
				<view class="music-card-img-wrap">
					<image class="music-card-img" :src="$global.imgUrl+item.posterUrl" mode="widthFix"></image>
				</view>
				<text class="music-card-name">{{item.songFormName}}</text>
			</view>
		</view>
		
		<music-form v-if="isShowMusicForm" :id="selcetId" @close="close"></music-form>
	</view>
</template>

<script>
import musicForm from './musicFormList.vue'
	
export default {
	components:{ musicForm },
	data() {
		return {
			musicFormList: [],
			isShowMusicForm: false,
			selcetId: 0,
		}
	},
	mounted(){
		this.musicFormList = uni.getStorageSync('musicFormList');
	},
	methods: {
		//跳转到歌单页
		showMusicForm(id){
			this.selcetId = id;
			this.isShowMusicForm = true;
		},
		close(val){
			this.isShowMusicForm = false;
		}
	}
}
</script>

<style>
@import url("../../static/css/user.css");
</style>
