<template>
  <view class="login" :style="{ marginTop: iStatusBarHeight + 'px'}">
	
  	<view class="login-form">
			<view class="form-item">
				<input class="input" v-model="formLogin.account" maxlength="30" placeholder="账号" />
			</view>
			<view class="form-item">
				<input class="input" v-model="formLogin.password" maxlength="30" placeholder="密码" password />
			</view>
			<button type="primary" @tap="login">登录</button>	
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
			console.log(parames)
			this.$http.login( parames )
			.then(({data}) => {
				if (data.code == 0){
					let token = data.data.token
					//存储
					this.$store.state.user = data.data;
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
					//this.getMusicFormList();
				}
				else{//this.$myMsg.notify({content: data.msg, type: 'error'})
				}  
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
.login{
	position: absolute;
	top: 0;
	bottom: 0;
	width: 750rpx;
}
.login .login-form{
	margin: 20vh 50rpx 40vh 50rpx;
	width: 650rpx;
	height: 30vh;
}
.login .login-form .form-item{
	margin-bottom: 3vh;
	width: 650rpx;
	height: 8vh;
	border-bottom: 2rpx solid #242424;
}
.login .login-form .form-item .input{
	width: 650rpx;
	height: 8vh;
}
.login  .login-bottom-tip{
	display: block;
	width: 750rpx;
	font-size: 25rpx;
	text-align: center;
}
</style>
