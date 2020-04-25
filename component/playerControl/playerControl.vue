<template>
	<view class="play-control-bar">
		<view class="my-normal-btn play-btn">
			<i v-show="playState == 1" @click="play" class="icon-mini-play"></i>
			<i v-show="playState == 2" @click="play" class="icon-mini-pause"></i>
			<i v-show="playState == 3" class="icon-mini-loading"></i>
		</view>
		<view class="music-info" @click="toPlayInfo">
			<text class="music-name">{{selectMusic.name}}</text>
			<text class="singer">{{selectMusic.singer}}</text>
		</view>
		<view class="my-normal-btn menu-btn" @click="showPlayList">
			<i class="icon-mini-menu"></i>
		</view>
		
		<!-- 播放列表 -->
		<view class="play-list-bg" @click="showPlayList" v-show="isShowPlayList"></view>
		<view class="play-list" :style="{ height: playListHeight + 'rpx'}">
			<view class="play-list-head">
				<view class="play-list-title">播放列表/{{playList.length}}</view>
				<view class="play-list-btn my-normal-btn"><i class="icon-mini-clear"></i></view>
			</view>
			<view class="play-list-wrap">
				<view class="play-card" 
					@click="select(e, index)"
					v-for="(e, index) in playList" 
					:key="index">
					<view :class="{'play-list-music-info':true, 'active': index == activeIndex}">
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
export default {
	data() {
		return {
			//控制播放列表
			isShowPlayList: false,
			playListHeight: 0,
			selectMusic: '',
			test: '',
		}
	},
	mounted(){
		//this.$music.src = this.$global.musicUrl+'d570264198294d7fbe993cb018f7a80b.mp3'
	},
	computed:{
		playList(){
			let tempList = this.$store.state.playList;
			if(tempList.length == 0){
				return tempList==""?[]:tempList;
			}
			if(this.$music.src != "" || this.$music.src != null){//如果有歌就播放第一首
				this.select(tempList[0], 0);
			}
			return tempList;
		},
		activeIndex:{//当前播放列表下标
			get() {
				let index = this.$store.state.activeIndex;
				if( index != ''){
					this.select(this.playList[index], index);
					return index
				}
				return 0;
			},
			set(val) {
				this.$store.state.activeIndex = val;
			}
		},
		playState:{//1，没播放， 2 正在播放, 3加载中
			get() {
				return this.$store.state.playState||1
			},
			set(val) {
				this.$store.state.playState = val;
			}
		},
		music:{
			get(){
				return this.$store.state.music
			},
			set(val){
				this.$store.state.music = val
			}
		}
	},
	methods:{
		play(){
			if(this.$music.src==null){
				return
			}
			if( this.playState != 2 ){
        this.playState = 3
				this.$music.play();//播放音乐
				this.$music.onPlay(() => {
					this.playState = 2
				});
			}else{
        this.$music.pause();
        this.playState = 1;
      } 
		},
		//选中播放列表的音乐
		select(val, index){
			this.selectMusic = val;
			this.activeIndex = index;
			this.test = val.name;
			this.$music = uni.createInnerAudioContext();
			this.$music.src = this.$global.musicUrl+val.profileUrl;
			this.playState = 3
			this.$music.play();//播放音乐
			this.$music.onPlay(() => {
				this.playState = 2
			});
		},
		
		//跳转到播放详情页
		toPlayInfo(){
			//let id = this.playList[this.activeIndex].musicId;
			this.$global.music = this.$music

			uni.navigateTo({
			    url: '../../pages/play/play'//'B?id=1'
			});
		},

		//时间格式
		timeFormat: (val) => util.timeFormat(val),
		
		//显示播放列表
		showPlayList(){
			this.isShowPlayList = !this.isShowPlayList
			this.playListHeight = this.isShowPlayList?710:0;
		}
	}
}
</script>

<style>
.play-control-bar{
	position: fixed;
	display: flex;
	justify-content: center;
	z-index: 200;
	bottom: 0;
	height: 100rpx;
	width: 750rpx;
	background-color: #111214;
	color: #fff;
	font-size: 20rpx;
}
.play-control-bar .play-btn{
	margin: 30rpx 40rpx 0 40rpx;
}
.play-control-bar .menu-btn{
	margin: 30rpx 30rpx 0 25rpx;
}
.play-control-bar .music-info{
	display: inline-block;
	width: 545rpx;
	height: 100rpx;
	overflow: hidden;
}
.play-control-bar .music-info .music-name{
	display: block;
	color: #aaa;
	font-size: 30rpx;
	line-height: 60rpx;
}
.play-control-bar .music-info .singer{
	display: block;
	font-size: 20rpx;
	line-height: 30rpx;
	color: #666;
}
.play-control-bar .play-list{
	position: fixed;
	bottom: 100rpx;
	z-index: 20;
	width: 750rpx;
	height: 710rpx;
	background-color: #242424;
	border-bottom: 1rpx solid #aaa;
	overflow: hidden;
	transition-duration: .5s;
}
.play-control-bar .play-list-bg{
	position: fixed;
	top: 0;
	left: 0;
	z-index: 10;
	height: 100vh;
	width: 750rpx;
	background-color: rgba(0,0,0,.6);
}
.play-control-bar .play-list .play-list-head{
	display: block;
	width: 750rpx;
	height: 79rpx;
	color: #aaa;
	border-bottom: 1rpx solid #aaa;
	background-color: #111214;
}
.play-control-bar .play-list .play-list-head .play-list-title{
	display: inline-block;
	padding-left: 30rpx;
	color: #aaa;
	line-height: 79rpx;
	font-size: 30rpx;
}
.play-control-bar .play-list .play-list-head .play-list-btn{
	vertical-align: top;
	float: right;
	margin: 20rpx 30rpx 20rpx 0;
}
.play-control-bar .play-list .play-list-wrap{
	width: 750rpx;
	height: 640rpx;
	overflow-x: hidden;
	overflow-y: auto;
}
.play-control-bar .play-list-wrap .play-list-music-info{
	display: block;
	padding-left: 30rpx;
	width: 720rpx;
	height: 79rpx;
	font-size: 30rpx;
	line-height: 80rpx;
	border-bottom: 1rpx solid #666;
	color: #aaa;
}
.play-control-bar .play-list-wrap .play-list-music-info .info-wrap{
	float: left;
	width: 600rpx;
	height: 80rpx;
	overflow: hidden;
	white-space:nowrap;
	text-overflow:ellipsis;
}
.play-control-bar .play-list-wrap .play-list-music-info .time{
	float: right;
	margin-right: 30rpx;
}
.play-control-bar .play-list-wrap .play-list-music-info .singer{
	margin-left: 10rpx;
	font-size: 20rpx;
	color: #666;
}
.play-control-bar .play-list-wrap .active{
	color: #01e5ff;
	background-color: #353535;
}
</style>
