<template>
	<view class="play">
		<!-- 背景 -->
		<view class="play-bg"><image class="bg-img" :src="$global.imgUrl+musicInfo.songImg"></image></view>
		<!-- 头部 -->
		<view class="play-head" :style="{ marginTop: iStatusBarHeight + 'px'}">
			<view class="my-normal-btn title-btn" @click="showPlayList">
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
		<view class="play-poster" :style="{ marginTop: iStatusBarHeight + 'px'}" v-show="false">
			<view class="poster-wrap"><image class="poster" :src="$global.imgUrl+musicInfo.songImg"></image></view>
			<view class="btn-bar">
				<view class="my-normal-btn title-btn"><i class="icon-like"></i></view>
				<view class="my-normal-btn title-btn"><i class="icon-collect"></i></view>
				<view class="my-normal-btn title-btn"><i class="icon-islike"></i></view>
				<view class="my-normal-btn title-btn"><i class="icon-mini-menu"></i></view>
			</view>
		</view>
		<!-- 歌词 -->
		<view class="lyric" :style="{ marginTop: iStatusBarHeight + 'px'}">
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
			<view class="progress-bar">
				<text class="p-time" style="left: 30rpx;">{{playTime}}</text>
				<view class="progress-bg">
					<view class="progress-value" :style="{width: progresValue + 'rpx'}">
						<view class="progress-icon"></view>
					</view>
				</view>
				<text class="p-time" style="right: 30rpx;">{{totalDuration}}</text>
			</view>
			<!-- 按钮 -->
			<view class="play-btn-wrap">
				<view class="small-btn my-normal-btn"><i class="icon-playPrv"></i></view>
				<view class="play-btn my-normal-btn">
					<i v-show="playState == 1" class="icon-play" @click="play"></i>
					<i v-show="playState == 2" class="icon-pause" @click="play"></i>
					<i v-show="playState == 3" class="icon-loading"></i>
				</view>
				<view class="small-btn my-normal-btn"><i class="icon-playNext"></i></view>
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
			iStatusBarHeight:0,
			progresValue: 0,//进度条长度，总长度为530
			totalDuration: "00:00",//总播放时间
			playTime: "00:00",//当前播放时长
			mLength: 0,//音乐时长
			nowPlayTime: "",//当前播放毫秒数
			lyricIndex: 0,//当前歌词激活的下标
			lyric: [],
			scrollTop: 0,
		}
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
		}
	},
	onLoad() {
		this.iStatusBarHeight = uni.getSystemInfoSync().statusBarHeight;
		this.$music = this.$global.music;
		this.getMusic(6, true)
	},
	methods: {
		//获取音乐信息
		getMusic(id, type=false){
			let parames = {
				musicId: 6,
			}
			// if(id){
			// 	parames.musicId = id
			// }
			this.$http.getMusic( parames ).then(({data}) => {
				if (data.code == 0){
					this.musicInfo = data.data;
					this.lyric = data.data.lrc; 
					this.mLength = data.data.timeLength;
					this.totalDuration = util.timeFormat(this.mLength);
					if( type ){
						this.$music = uni.createInnerAudioContext();
						this.$music.src = this.$global.musicUrl+data.data.profileUrl;
						this.play()
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
				return
		  }
			
			
			this.$music.onTimeUpdate(() => {
				//时间处理
				let mLength = this.$music.currentTime;
				this.nowPlayTime =  parseInt( mLength  * 1000);
				this.playTime = util.timeFormat(mLength);

				//进度条处理
				/*进度条百分比计算*/
				var long = mLength * 530 / this.mLength;//得到进度条长度，650是进度条总长度
				this.progresValue = long;


				 //结束处理
				// if( this.music.ended ){//归零
				// 	 this.music.currentTime = 0;
				// 	 this.nowPlayTime = 0;
				// 	 this.changeMusic(false);
				//  }
			});
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
				if(this.lyric[i].TimeMs >= this.nowPlayTime){
					this.lyricIndex = i;
					break;
				}
			}

			//计算歌词整体高度
			let tempHeight = 0;
			for(let i = 0; i <this.lyricIndex; i ++){
				tempHeight += (60 + Math.ceil(this.lyric[i].LrcLine.length / 18 - 1) * 30)
			}
			
	
			this.scrollTop = - tempHeight + 350;//150是初始高度.有过渡动画
			//this.$refs.lyricWrap.scrollTop =  tempHeight - 150;//没过渡动画的
		},

		//初始化参数
		initParames(){
			//赋值
			this.nowPlayTime = 0;
			this.progresValue = 0;
			//当音乐是暂停
			if( this.playState == 1){ 
			  //时间处理
				let mLength = this.$music.currentTime;
				this.nowPlayTime =  parseInt( mLength  * 1000);
				this.playTime = util.timeFormat(mLength);
				
				/*进度条百分比计算*/
				let longer = mLength * 530 / this.mLength;//得到进度条长度，650是进度条总长度
				this.progresValue = longer
			}
			//如果是在播放或者加载
			else{
				//启动时间监听钩子
				this.$music.onTimeUpdate(() =>{
					//时间处理
					let mLength = this.$music.currentTime;
					this.nowPlayTime =  parseInt( mLength  * 1000);
					this.playTime = util.timeFormat(mLength);
					
					/*进度条百分比计算*/
					let longer = mLength * 530 / this.$music.duration;//得到进度条长度，650是进度条总长度
					this.progresValue = longer
					// //结束处理
					// if( this.music.ended ){//归零
					// 	this.music.currentTime = 0;
					// 	this.nowPlayTime = 0;
					// 	this.changeMusic(false);
					// }
				})
			}

			if(this.lyric == null){//纯音乐打断
				return
			}
			
			//初始化歌词位置
			let firsIndex = "";
			for(let i = 0; i <this.lyric.length; i ++){
				if(this.lyric[i].type == 5){
					firsIndex = i;
					break;
				}
			}
			//每一行的高度为60，高亮位置放在100，所以把第一条歌词放在100 -60
			let lHeight = 100-firsIndex*60;
			this.scrollTop  = -lHeight;//下面注释的，是为了适配所有情况要用的(暂时不写，没时间啊)
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
		//旋转
		rotatePoster() {
			this.animation.rotate(Math.random() * 720 - 360).step()
			this.animationData = this.animation.export()
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
	margin: 2.85vh auto;
	width: 530rpx;
	height: 0.3vh;
	background-color: #fff;
	border-radius: 0.15vh;
}
.play .progress-bar .progress-bg .progress-value{
	position: relative;
	height: .3vh;
	border-radius: 0.15vh;
	background-color: #c20c0c;
}
.play .progress-bar .progress-bg .progress-value .progress-icon{
	position: absolute;
	top: 50%;
	right: 0;
	transform: translateY(-50%);
	margin-right: -9rpx;
	height: 18rpx;
	width: 18rpx;
	border-radius: 9rpx;
	background-color: #C20C0C;
}
.play .progress-bar .p-time{
	position: absolute;
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
	top: 0;
	width: 750rpx;
	padding-bottom: 80vh;
	transition-duration: .3s;
}
.play .lyric .lyric-wrap .text{
	display: block;
	margin: 30rpx auto;
	width: 600rpx;
	font-size: 25rpx;
	text-align: center;
	line-height: 30rpx;
	white-space: nowrap;
	color: #fff;
}
.play .lyric .lyric-wrap .active-line{
	color: #01e5ff;
	font-size: 30rpx;
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
