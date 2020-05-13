<template>
	<view class="play">
		<!-- 背景 -->
		<view class="play-bg"><image class="bg-img" :src="$global.imgUrl+musicInfo.songImg"></image></view>
		<!-- 头部 -->
		<view class="play-head" :style="{ marginTop: iStatusBarHeight + 'px'}">
			<view class="my-normal-btn title-btn" @click="goIndex">
				<i class="icon-mini-return"></i>
			</view>
			<uni-notice-bar 
				style="position: absolute; top: 0; left: 120rpx;"
				:scrollable="false" 
				:single="true" 
				:text="musicInfo.name" />
			<text class="singer">{{musicInfo.singer}}</text>
		</view>
		
		<!--封面 -->
		<view class="play-poster" :style="{ marginTop: iStatusBarHeight + 'px'}" v-show="!isHiddenPoster">
			<view :class="{'poster-wrap': playState != 1, 'poster-wrap-no-ani': playState == 1}"  @click="isHiddenPoster = true">
				<image mode="aspectFill" :src="$global.imgUrl+musicInfo.songImg"></image>
			</view>
			<view class="btn-bar">
				<view class="my-normal-btn title-btn"><i class="icon-like"></i></view>
				<view class="my-normal-btn title-btn"><i class="icon-collect"></i></view>
				<view class="my-normal-btn title-btn"><i class="icon-islike"></i></view>
				<view class="my-normal-btn title-btn"  @click="showPlayList"><i class="icon-mini-menu"></i></view>
			</view>
		</view>
		<!-- 歌词 -->
		<view class="lyric" :style="{ marginTop: iStatusBarHeight + 'px'}" @click="isHiddenPoster = false" v-show="isHiddenPoster">
			<view class="lyric-wrap" :style="{marginTop: scrollTop + 'rpx'}">
				<text v-show="false">纯音乐</text>
				<text
					:class="{'active-line': activeLine(e, index, nowPlayTime), 'text': true}" 
					v-for="(e, index) in lyric" 
					:key="index"
					v-html="fontFormat(e.LrcLine)"
				></text>
			</view>
		</view>

		<!-- 控制条 -->
		<view class="play-control-bar">
					
			<!-- 进度条 -->
			<view class="progress-bar" @click="progressDrag" @touchmove="progressDrag">
				<text class="p-time" style="left: 30rpx;">{{playTime}}</text>
				<slider
					class="progress-bg"
					min="0"
					:max="mLength"
					:value="nowPlayTime/1000"
					activeColor="#c20c0c"
					backgroundColor="#fff"
					block-size="12"
					@change="progressDrag"/>
				<text class="p-time" style="right: 30rpx;">{{totalDuration}}</text>
			</view>
			<!-- 按钮 -->
			<view class="play-btn-wrap">
				<view class="small-btn my-normal-btn"><i class="icon-playPrv"></i></view>
				<view class="play-btn my-normal-btn">
					{{test}}
					<i v-show="playState == 1" class="icon-play" @click="playMusic"></i>
					<i v-show="playState == 2" class="icon-pause" @click="playMusic"></i>
					<i v-show="playState == 3" class="icon-loading"></i>
				</view>
				<view class="small-btn my-normal-btn"><i class="icon-playNext"></i></view>
			</view>
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
					@click="selectMuc(e, index)"
					v-for="(e, index) in playList" 
					:key="index">
					<view :class="{'play-list-music-info':true, 'active': index == activeIndex}">
						<text class="info-wrap">{{index+1}}、{{e.name}}
							<text class="play-list-singer">-{{e.singer}}</text>
						</text>
						<text class="time">{{timeFormat(e.timeLength)}}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import uniNoticeBar from '@/component/uni-notice-bar/uni-notice-bar.vue';
import util from '@/util/utils.js'
export default {
	components:{
		uniNoticeBar
	},
	data() {
		return {
			musicInfo: '',
			iStatusBarHeight: 0,
			totalDuration: "00:00",//总播放时间
			playTime: "00:00",//当前播放时间，格式 dd:ss
			mLength: 0,//音乐时长
			nowPlayTime: "",//当前播放毫秒数
			lyricIndex: 0,//当前歌词激活的下标
			lyric: [],//歌词列表
			scrollTop: 0,//滚动高度
			isHiddenPoster: false, //true为隐藏封面， false为显示封面
			playListHeight: 0,
			isShowPlayList: false,
			test: '',
		}
	},
	computed:{
		playList(){
			let tempList = this.$store.state.playList;
			if(tempList.length == 0){
				return tempList==""?[]:tempList;
			}
			return tempList;
		},
		activeIndex:{//当前播放列表下标
			get() {
				return this.$store.state.activeIndex;
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
		}
	},
	onLoad(val) {
		this.iStatusBarHeight = uni.getSystemInfoSync().statusBarHeight;
		this.$music = this.$global.music;
		this.getMusic(val.id, false);
		// 保持屏幕常亮
		uni.setKeepScreenOn({
		    keepScreenOn: true
		});
	},
	methods: {
		//获取音乐信息
		getMusic(id, type=false){
			let parames = {
				musicId: id,
			}
			this.$http.getMusic( parames ).then(({data}) => {
				if (data.code == 0){
					this.musicInfo = data.data;
					this.lyric = data.data.lrc; 
					this.mLength = data.data.timeLength;
					this.totalDuration = util.timeFormat(this.mLength);
					if( type ){
						if(this.$music.src != null || this.$music.src != '') {
							this.$music.pause()
						}
						this.playState = 3
						this.$music = null
						this.$music = uni.createInnerAudioContext();
						this.$music.src = this.$global.musicUrl+data.data.profileUrl;
						this.playMusic()
					}
					this.initParames()
					//增加播放量
					//this.$http.addMusicPlayNum({musicId: this.musicInfo.id});
					//this.musicInfo.playNum ++;
				}
				//错误处理
				else{}  
			})
		},
		
		//播放方法
		playMusic(){
			if( this.playState != 2 ){
				this.playState = 3
				this.$music.play();//播放音乐
				this.$music.onPlay(() => {
					this.playState = 2
				});
			}else{
		    this.$music.pause();
		    this.playState = 1;
				return
		  }
		},
		
		//激活歌词
		activeLine(e, index, time){
			if(index+1 >= this.lyric.length){
				return
			}
			let timeFlag = time >= e.TimeMs && time < this.lyric[index+1].TimeMs;
			if( e.type == 5 && timeFlag ){
				this.lyricIndex = index;
				return true;
			}

			return false;
		},
		
		//歌词滚动计算方法
		lyricScoll(){
			if(this.lyric == null){//纯音乐打断
				return
			}
			
			// if(this.preViewLyrc){//预览歌词打断
			// 	return
			// }

			//计算当前歌词播放行
			let mLength = this.$music.currentTime;   
			this.nowPlayTime =  parseInt( mLength  * 1000);
			for(let i = 0; i <this.lyric.length; i ++){
				if(this.lyric[i] == null){ //判空
					break
				}
				if(this.lyric[i].TimeMs > this.nowPlayTime && this.nowPlayTime < this.lyric[i+1].TimeMs){
					this.lyricIndex = i-1;
					break;
				}
			}
			
			//计算歌词滚动整体高度
			let tempHeight = 0;
			for(let i = 0; i <this.lyricIndex; i ++){
				tempHeight += (60 + Math.ceil(this.lyric[i].LrcLine.length / 18 - 1) * 30)
			}
	
			this.scrollTop = -tempHeight;
		},
		
		//进度条拖动
		progressDrag(event){
			this.$music.seek(event.detail.value);
			//this.playMusic();
		},
				
		//初始化参数
		initParames(){
			//赋值
			this.nowPlayTime = 0;
			//当音乐是暂停
			if( this.playState == 1){ 
			  //时间处理
				let mLength = this.$music.currentTime;
				this.nowPlayTime =  parseInt( mLength  * 1000);
				this.playTime = util.timeFormat(mLength);
			}
			//如果是在播放或者加载
			else{
				//启动时间监听钩子
				this.$music.onTimeUpdate(() =>{
					//时间处理
					let mLength = this.$music.currentTime;
					this.nowPlayTime =  parseInt( mLength  * 1000);
					this.playTime = util.timeFormat(mLength);
					// //结束处理
					// if( this.music.ended ){//归零
					// 	this.music.currentTime = 0;
					// 	this.nowPlayTime = 0;
					// 	this.changeMusic(false);
					// }
				})
			}
		},
	
		//选中播放列表的音乐
		selectMuc(val, index){
			this.selectMusic = val;
			this.activeIndex = index;
			this.getMusic(val.musicId, true)
		},
		
		//固定字数
		fontFormat(val){   
			if(val.length < 18){
				return val
			}

			let font = '';
			for(let i = 0; i < val.length; i+=18){
				if(val.length > i*(i/18)){
					font += val.substring(i, i +18) + '<br>' +'\r\n'
				}
				else{
					font += val.substring(i, val.length - 1);
				}
			}
			return font
		},
		
		//时间格式
		timeFormat: (val) => util.timeFormat(val),
		
		//显示播放列表
		showPlayList(){
			this.isShowPlayList = !this.isShowPlayList
			this.playListHeight = this.isShowPlayList?710:0;
		},
		
		goIndex(){
			uni.navigateBack()
		}
	},
	watch:{
    //监听激活的歌词是否变化，如果有变化就移动歌词
    lyricIndex(){
      //滚动歌词
      //this.$refs.lyricWrap.scrollTop  += 35;
      this.lyricScoll();
			
    },
  }
}
</script>

<style>
@import url("../../static/css/play.css");
</style>
