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
				this.$music.offPlay();
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
			this.playMusic();
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
	z-index: 20;
	top: 0;
	left: 0;
	height: 7.5vh;
	width: 750rpx;
}
.play .title-btn{
	margin: 2.25vh 3vh;
}
.play .singer{
	position: absolute;
	display: block;
	bottom: 0;
	left: 120rpx;
	height: 4vh;
	line-height: 4vh;
	font-size: 25rpx;
	color: #eee;
}
.play .play-poster{
	position: absolute;
	top: 7.5vh;
	bottom: 18.75vh;
	width: 750rpx;
}
.play .play-poster .poster-wrap{
	position: absolute;
	top: 45%;
	left: 50%;
	margin-top: -225rpx;
	margin-left: -225rpx;
	height: 450rpx;
	width: 450rpx;
	border: 10rpx solid rgba(238, 238, 238, .5);
	border-radius: 225rpx;
	overflow: hidden;
	animation: loading 26s linear infinite;
}
.play .play-poster .poster-wrap-no-ani{
	position: absolute;
	top: 45%;
	left: 50%;
	margin-top: -225rpx;
	margin-left: -225rpx;
	height: 450rpx;
	width: 450rpx;
	border: 10rpx solid rgba(238, 238, 238, .5);
	border-radius: 225rpx;
	overflow: hidden;
}
.play .play-poster .poster-wrap .poster{
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translateX(-50%) translateY(-50%);
	height: 100%;
}
.play .play-poster .btn-bar{
	position: absolute;
	bottom: 0;
	width: 750rpx;
	height: 7.5vh;
	text-align: center;
}

/* 控制条 */
.play .play-control-bar{
	position: absolute;
	z-index: 9999;
	bottom: 0;
	height: 18.75vh;
	width: 750rpx;
}
.play .play-control-bar .progress-bar{
	position: absolute;
	top: 0;
	width: 750rpx;
	height: 6vh;
}
.play .progress-bar .progress-bg{
	margin: 1.65vh auto;
	width: 530rpx;
	height: 2.7vh;
}
.play .progress-bar .p-time{
	position: absolute;
	margin-top: .3vh;
	top: 0;
	width: ;
	font-size: 20rpx;
	line-height: 6vh;
	color: #fff;
}

/* 下面按钮 */
.play .play-btn-wrap{
	position: absolute;
	display: flex;
	top: 6vh;
	width: 750rpx;
	height: 12.75vh;
	justify-content: center;
}
.play .play-btn-wrap .play-btn{
	margin: 0.75vh 100rpx;
	height: 100rpx;
	width: 100rpx;
}
.play .play-btn-wrap .play-btn i{
	display: inline-block;
	width: 100rpx;
	height: 100rpx;
}
.play .play-btn-wrap .small-btn{
	margin: 1.875vh 0;
	height: 70rpx;
	width: 70rpx;
}
.play .play-btn-wrap .small-btn i{
	display: inline-block;
	width: 70rpx;
	height: 70rpx;
}

/* 歌词部分 */
.play .lyric{
	position: absolute;
	top: 7.5vh;
	bottom: 25vh;
	width: 750rpx;
	overflow-y: auto;
}
.play .lyric .lyric-wrap{
	position: absolute;
	top: 50%;
	width: 750rpx;
	padding-bottom: 80vh;
	transition-duration: .3s;
}
.play .lyric .lyric-wrap .text{
	display: block;
	margin: 30rpx auto;
	width: 600rpx;
	font-size: 30rpx;
	text-align: center;
	line-height: 30rpx;
	white-space: nowrap;
	color: #fff;
}
.play .lyric .lyric-wrap .active-line{
	color: #01e5ff;
	font-size: 30rpx;
}

.play .play-list{
	position: fixed;
	bottom: 0;
	z-index: 10000;
	width: 750rpx;
	height: 710rpx;
	background-color: #242424;
	border-bottom: 1rpx solid #333;
	overflow: hidden;
	transition-duration: .5s;
}
.play .play-list-bg{
	position: fixed;
	top: 0;
	left: 0;
	z-index: 10;
	height: 100vh;
	width: 750rpx;
	background-color: rgba(0,0,0,.6);
}
.play .play-list .play-list-head{
	display: block;
	width: 750rpx;
	height: 79rpx;
	color: #aaa;
	border-bottom: 1rpx solid #333;
	background-color: #111214;
}
.play .play-list .play-list-head .play-list-title{
	display: inline-block;
	padding-left: 30rpx;
	color: #aaa;
	line-height: 79rpx;
	font-size: 30rpx;
}
.play .play-list .play-list-head .play-list-btn{
	vertical-align: top;
	float: right;
	margin: 20rpx 30rpx 20rpx 0;
}
.play .play-list .play-list-wrap{
	width: 750rpx;
	height: 640rpx;
	overflow-x: hidden;
	overflow-y: auto;
}
.play .play-list-wrap .play-list-music-info{
	display: block;
	padding-left: 30rpx;
	width: 720rpx;
	height: 79rpx;
	font-size: 30rpx;
	line-height: 80rpx;
	border-bottom: 1rpx solid #333;
	color: #aaa;
}
.play .play-list-wrap .play-list-music-info .info-wrap{
	float: left;
	width: 600rpx;
	height: 80rpx;
	overflow: hidden;
	white-space:nowrap;
	text-overflow:ellipsis;
}
.play .play-list-wrap .play-list-music-info .time{
	float: right;
	margin-right: 30rpx;
}
.play .play-list-wrap .play-list-music-info .play-list-singer{
	margin-left: 10rpx;
	font-size: 20rpx;
	color: #666;
}
.play .play-list-wrap .active{
	color: #01e5ff;
	background-color: #353535;
}
@keyframes loading{
  0%{
    transform: rotateZ(0deg);
  }
  100%{
    transform: rotateZ(360deg);
  }
}
</style>
