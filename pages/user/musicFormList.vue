<template>
	<view class="music-from-list">
		<view class="head">
			<image class="head-img" :src="$global.imgUrl+formInfo.posterUrl" mode="widthFix"></image>
			<text class="list-name">{{formInfo.formName}}</text>
		</view>
		<view class="content">
			<view class="play-list-wrap">
				<view class="play-card" 
					@click="select(e, index)"
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
	data(){
		return{
			iStatusBarHeight: "",
			formInfo: ''
		}
	},
	onLoad(val) {
		//this.iStatusBarHeight = uni.getSystemInfoSync().statusBarHeight;
		this.getMusicList(val.id)
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
	}
}
</script>

<style>
.music-from-list .head{
	position: relative;
	display: block;
	width: 750rpx;
	height: 40vh;
	overflow: hidden;
}
.music-from-list .head .head-img{
	width: 100%;
	height: 100%;
}
.music-from-list .head .list-name{
	position: absolute;
	z-index: 999;
	bottom: 0;
	left: 30rpx;
	line-height: 10vh;
	color: #00ACE9;
	font-weight: bold;
}
.music-from-list .play-list{
	position: fixed;
	bottom: 100rpx;
	z-index: 20;
	width: 750rpx;
	height: 710rpx;
	background-color: #fff;
	border-radius: 40rpx 40rpx 0 0;
	border-bottom: 1rpx solid #eee;
	overflow: hidden;
	transition-duration: .5s;
}

.music-from-list .play-list .play-list-head{
	display: block;
	width: 750rpx;
	height: 79rpx;
	color: #000;
	border-bottom: 1rpx solid #eee;
	background-color: #00ACE9;
}
.music-from-list .play-list .play-list-head .play-list-title{
	display: inline-block;
	padding-left: 30rpx;
	color: #fff;
	line-height: 79rpx;
	font-size: 30rpx;
}
.music-from-list .play-list .play-list-head .play-list-btn{
	vertical-align: top;
	float: right;
	margin: 20rpx 30rpx 20rpx 0;
}
.music-from-list .play-list .play-list-wrap{
	width: 750rpx;
	height: 640rpx;
	overflow-x: hidden;
	overflow-y: auto;
}
.music-from-list .play-list-wrap .play-list-music-info{
	display: block;
	padding-left: 30rpx;
	width: 720rpx;
	height: 79rpx;
	font-size: 30rpx;
	line-height: 80rpx;
	border-bottom: 1rpx solid #eee;
	color: #000;
}
.music-from-list .play-list-wrap .play-list-music-info .info-wrap{
	float: left;
	width: 600rpx;
	height: 80rpx;
	overflow: hidden;
	white-space:nowrap;
	text-overflow:ellipsis;
}
.music-from-list .play-list-wrap .play-list-music-info .time{
	float: right;
	margin-right: 30rpx;
}
.music-from-list .play-list-wrap .play-list-music-info .singer{
	margin-left: 10rpx;
	font-size: 20rpx;
	color: #666;
}
</style>
