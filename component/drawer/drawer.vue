<template>
	<view 
		v-if="visibleSync" 
		:class="{ 'uni-drawer--visible': showDrawer }" 
		class="uni-drawer" 
		@touchstart="touchStart" 
		@touchend="touchEnd"
		@touchmove="touchMove">
		<view class="uni-drawer__mask" :class="{ 'uni-drawer__mask--visible': showDrawer && mask }" @tap="close" />
		<view 
			ref="drawer"
		  :style="{left: moveLeft +'px'}"
		  class="uni-drawer__content" 
			:class="{'uni-drawer--right': rightMode,'uni-drawer--left': !rightMode, 'uni-drawer__content--visible': showDrawer}">
			<view class="drawer-head">
				<view class="user-head">
					<image class="head-user-img" src="../../static/icon/user-head.png" mode="widthFix"></image>
				</view>
				<view class="msg-box">
					<text class="user-name">甜筒</text>
					<text class="user-info">这是个爱吃甜筒的人</text>
				</view>
			</view>
			<view class="list-wrap">
				<view class="list-item">
					<text class="list-text">用户登录</text>
				</view>
				<view class="list-item">
					<text class="list-text">用户注册</text>
				</view>
				<view class="list-item">
					<text class="list-text">退出登录</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
/**
 * Drawer 抽屉
 * @description 抽屉侧滑菜单
 * @tutorial https://ext.dcloud.net.cn/plugin?id=26
 * @property {Boolean} visible = [true|false] Drawer的显示状态
 * @property {Boolean} mask = [true | false] 是否显示遮罩
 * @property {Boolean} mode = [left | right] Drawer 滑出位置
 * @value left 从左侧滑出
 * @value right 从右侧侧滑出
 * @event {Function} close 组件关闭时触发事件
 */
export default {
	name: 'drawer',
	props: {
		/**
		 * 显示状态
		 */
		visible: {
			type: Boolean,
			default: false
		},
		/**
		 * 显示模式（左、右），只在初始化生效
		 */
		mode: {
			type: String,
			default: ''
		},
		/**
		 * 蒙层显示状态
		 */
		mask: {
			type: Boolean,
			default: true
		}
	},
	data() {
		return {
			visibleSync: false,
			showDrawer: false,
			rightMode: false,
			watchTimer: null,
			moveLeft: 0,
			startLeft: 0,
			flag: true
		}
	},
	watch: {
		visible(val) {
			if (val) {
				this.open()
			} else {
				this.close()
			}
		}
	},
	created() {
		this.visibleSync = this.visible
		setTimeout(() => {
			this.showDrawer = this.visible
		}, 100)
		this.rightMode = this.mode === 'right'
	},
	methods: {
		close() {
			this._change('showDrawer', 'visibleSync', false)
		},
		open() {
			this._change('visibleSync', 'showDrawer', true)
		},
		_change(param1, param2, status) {
			this[param1] = status
			if (this.watchTimer) {
				clearTimeout(this.watchTimer)
			}
			this.watchTimer = setTimeout(() => {
				this[param2] = status
				this.$emit(status ? 'open' : 'close')
			}, status ? 50 : 300)
		},
		touchStart(event){
			this.startLeft =  event.touches[0].pageX||0
		},
		touchMove(event){
			let currentX = event.touches[0].pageX;
			if( currentX - this.startLeft < 0 ){
				this.close()
			}
			
		},
		touchEnd(event){
			this.startLeft = 0;
			this.moveLeft = 0;
		}
	}
}
</script>

<style scoped>
/* 抽屉宽度
 */
	.uni-drawer {
		/* #ifndef APP-NVUE */
		display: block;
		/* #endif */
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		overflow: hidden;
		z-index: 999;
		background-color: rgba(0,0,0,.2);
	}

	.uni-drawer__content {
		/* #ifndef APP-NVUE */
		display: block;
		/* #endif */
		position: absolute;
		top: 0;
		width: 550rpx;
		bottom: 0;
		transition: transform 0.3s ease;
		background-color: #242424;
	}

	.uni-drawer--left {
		left: 0;
		transform: translateX(-550rpx);
	}

	.uni-drawer--right {
		right: 0;
		transform: translateX(550rpx);
	}

	.uni-drawer__content--visible {
		transform: translateX(0px);
	}


	.uni-drawer__mask {
		/* #ifndef APP-NVUE */
		display: block;
		/* #endif */
		opacity: 0;
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		background-color: rgba(0, 0, 0, 0.4);
		transition: opacity 0.3s;
	}

	.uni-drawer__mask--visible {
		/* #ifndef APP-NVUE */
		display: block;
		/* #endif */
		opacity: 1;
	}
	.drawer-head{
		position: absolute;
		top: 0rpx;
		height: 35vh;
		width: 100%;
		background-color: #353535;
	}
	.drawer-head .user-head{
		position: relative;
		left: 50rpx;
		margin-top: 10vh;
		width: 150rpx;
		height: 150rpx;
		border-radius: 75rpx;
		border: 1rpx solid #ccc;
		overflow: hidden;
	}
	.drawer-head .user-head .head-user-img{
		position: absolute;
		z-index: 3;
		top: 50%;
		transform: translateY(-50%);
		width: 100%;
	}
	.msg-box{
		margin: 10rpx 0 0 50rpx;
		color: #fff;
	}
	.msg-box .user-name{
		display: block;
		font-weight: 600;
	}
	.msg-box .user-info{
		font-size: 22rpx;
	}
	.list-wrap{
		margin-top: 35vh;
		width: 100%;
	}
	.list-wrap .list-item{
		height: 85rpx;
		margin: 0 50rpx;
		line-height: 85rpx;
		border-bottom: 1rpx solid #333;
	}
	.list-wrap .list-text{
		font-size: 30rpx;
		color: #aaa;
	}
</style>