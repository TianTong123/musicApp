<template>
	<view class="index">
		<scroll-view id="tab-bar" class="scroll-h" :scroll-x="true" :show-scrollbar="false" :scroll-into-view="scrollInto">
		    <view v-for="(tab,index) in tabBars" :key="tab.id" class="uni-tab-item" :id="tab.id" :data-current="index" @click="ontabtap">
		        <text class="uni-tab-item-title" :class="tabIndex==index ? 'uni-tab-item-title-active' : ''">{{tab.name}}</text>
		    </view>
		</scroll-view>
	</view>
</template>

<script>
	// 缓存每页最多
	const MAX_CACHE_DATA = 100;
	// 缓存页签数量
	const MAX_CACHE_PAGE = 3;
	export default {
		data() {
			return {
				scrollInto: "",
				tabIndex: 0,
				scrollInto: "",
				tabBars: [{
				    name: '首頁',
				    id: 'guanzhu'
				}, {
				   name: '歌手',
				   id: 'tuijian'
				}, {
				    name: '排行榜',
				    id: 'tiyu'
				}],
			}
		},
		onLoad() {

		},
		methods: {
			ontabtap(e) {
			    let index = e.target.dataset.current || e.currentTarget.dataset.current;
			    this.switchTab(index);
			},
			switchTab(index) {
			
			    if (this.tabIndex === index) {
			        return;
			    }
			
			    this.tabIndex = index;
			    this.scrollInto = this.tabBars[index].id;
			
			    // 释放 tabId
			    //if (this.cacheTab.length > MAX_CACHE_PAGE) {
			        //let cacheIndex = this.cacheTab[0];
			        //this.clearTabData(cacheIndex);
			        //this.cacheTab.splice(0, 1);
			        //console.log("remove cache index:: " + cacheIndex);
			    //}
			},
		}
	}
</script>

<style>
	.index {
		flex: 1;
		flex-direction: column;
		overflow: hidden;
		background-color: #ffffff;
		/* #ifdef MP-ALIPAY || MP-BAIDU */
		height: 100vh;
		/* #endif */
	}

	.scroll-h {
		width: 750rpx;
		height: 80rpx;
		flex-direction: row;
		/* #ifndef APP-PLUS */
		white-space: nowrap;
		/* #endif */
		/* flex-wrap: nowrap; */
		/* border-color: #cccccc;
		border-bottom-style: solid;
		border-bottom-width: 1px; */
	}
	.uni-tab-item {
		/* #ifndef APP-PLUS */
		display: inline-block;
		/* #endif */
		flex-wrap: nowrap;
		padding-left: 34rpx;
		padding-right: 34rpx;
	}

	.uni-tab-item-title {
		color: #555;
		font-size: 30rpx;
		height: 80rpx;
		line-height: 80rpx;
		flex-wrap: nowrap;
		/* #ifndef APP-PLUS */
		white-space: nowrap;
		/* #endif */
	}

	.uni-tab-item-title-active {
		color: #007AFF;
	}
</style>
