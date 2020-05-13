<template>
	<view class="music-from-list">
		<view class="head">
			<view class="my-normal-btn title-btn" @click="back">
				<i class="icon-mini-return"></i>
			</view>
			<image class="head-img" :src="$global.imgUrl+formInfo.posterUrl" mode="widthFix"></image>
			<text class="list-name">{{formInfo.formName}}</text>
		</view>
		<view class="content">
			<view class="play-list-wrap">
				<view class="play-card" 
					@click="toPlay(e)"
					v-for="(e, index) in formInfo.musicList" 
					:key="index">
					<view class="play-list-music-info">
						<text class="info-wrap">{{index+1}}、{{e.name}}
							<text class="singer">-{{e.singer}}</text>
						</text>
						<text class="time">{{timeFormat(e.timeLength)}}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import util from '@/util/utils.js'
export default{
	props:{
		id: {
			type: Number,
			default: 1
		}
	},
	data(){
		return{
			iStatusBarHeight: "",
			formInfo: ''
		}
	},
	mounted(){
		this.getMusicList(this.id)
	},
	methods:{
		//获取音乐列表
		getMusicList(id){
			let parames = {
				formId: id,
			}
			this.$http.getMusicList( parames )
			.then(({data}) => {
				if (data.code == 0){
					this.formInfo = data.data
				}
				else{}  
			})
		},
		
		//时间格式
		timeFormat: (val) => util.timeFormat(val),
		
		//播放
		toPlay: (val) => util.toPlay(val),
		
		//返回
		back(){
			this.$emit('close', true)
		}
	}
}
</script>

<style>
@import url("../../static/css/musicFormList.css");
</style>
