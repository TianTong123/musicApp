<template>
  <view class="login" :style="{ marginTop: iStatusBarHeight + 'px'}">
		<view class="title">登录</view>
  	<view class="login-form" >
			<view class="form-item">
				<input class="input" v-model="formLogin.account" maxlength="30" placeholder="账号" />
			</view>
			<view class="form-item">
				<input class="input" v-model="formLogin.password" maxlength="30" placeholder="密码" password />
			</view>
			<button type="primary" @tap="login">确认</button>	
		</view>
		
		<view class="welcome" v-if="isShowWelcome">
			<image class="wel1" src="../../static/images/welcome1.png"></image>
			<image class="wel2" src="../../static/images/welcome2.png"></image>
		</view>
		<text class="login-bottom-tip">十分感谢仓鼠团的大家。ありがと</text>		
</view>
</template>

<script>
export default{
	data(){
		return{
			formLogin:{
				account: '',
				password: ''
			},
			iStatusBarHeight: 0,
			isShowWelcome: false,
		}
	},
	onLoad() {
		this.iStatusBarHeight = uni.getSystemInfoSync().statusBarHeight
	},
	methods:{
		//登录
		login(){
			if(this.accountFormat(this.formLogin.account) || this.pwdFormat(this.formLogin.password)){
				return
			}
			let parames = {
				...this.formLogin
			}
			this.$http.login(parames)
			.then(({data}) => {
				if (data.code == 0){
					//存储
					this.$store.state.user = data.data;
					uni.setStorageSync('user', data.data);
					this.$store.state.token = data.data.token;
					uni.setStorageSync('token', data.data.token);
					this.isShowWelcome = true;
					uni.setScreenBrightness({
					  value: 0.5,
						success: function () {
								console.log('success');
						}
					});
					this.getMusicFormList();
					setTimeout(()=>{
						uni.navigateBack();
					}, 2000)
					//uni.navigateBack();
					//util.saveStorage("token", token);
					//util.saveStorage('user', data.data);
					//this.show = false;
					//this.$myMsg.notify({content: "登录成功",type: 'success'});
					//模拟菜单管理
					//let menuList = data.data.menuList;     
					//util.saveStorage("menuList", menuList);
					if(data.data.type == 1){ //歌手就跳转用户页
						//router.push({name:'user'});
					} 
					
				}
				else{//this.$myMsg.notify({content: data.msg, type: 'error'})
				}  
			})
		},
		
		//获取歌单
		getMusicFormList(){
			let parames = {
				accountId: this.$store.state.user.id,
			}
			this.$http.getMusicFormList( parames )
			.then(({data}) => {
				if (data.code == 0){
					uni.setStorageSync("musicFormList", data.data);
				}
				else{}  
			})
		},
		
		//输入验证
		inputFormat(val, tip){
			let rs = false;
			if(val == null || val == ''){
				//this.$myMsg.notify({content: tip+"不能为空",type: 'error'});
				rs = true;
			}  
			var reg = /[\u4E00-\u9FA5\uF900-\uFA2D]/;
			var reg1 = /[\uFF00-\uFFEF]/
			if (reg.test(val) || reg1.test(val)){
				//this.$myMsg.notify({content: tip+"不能有中文或者中文符号",type: 'error'});
				rs = true;
			}
			return rs
		},
		
		//账号验证
		accountFormat(val){
			return this.inputFormat(val, '账号');
		},

		//密码验证
		pwdFormat(val){
			return this.inputFormat(val, '密码');
		},
	}
}
</script>

<style>
@import url("../../static/css/login.css");
</style>
