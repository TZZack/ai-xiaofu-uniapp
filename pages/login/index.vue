<template>
	<view class="login-view"
		  :class="{
		  	  'pc-container': isPc
		  }">
		<view class="login__logo">
			<image src="/static/img/logo.jpg" style="width: 80px;height: 80px;"></image>
		</view>
		<uni-forms :modelValue="formData">
			<uni-forms-item>
				<uni-easyinput v-model="formData.account" placeholder="账号"></uni-easyinput>
			</uni-forms-item>
			<uni-forms-item>
				<uni-easyinput v-model="formData.pwd" placeholder="密码"></uni-easyinput>
			</uni-forms-item>
		</uni-forms>
		<button class="login__submit-button" type="primary" @click="submitForm">登录</button>
		<uni-popup ref="messageRef" type="top">
			<uni-popup-message :type="msgType" :message="msgText" :duration="2000"></uni-popup-message>
		</uni-popup>
	</view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useLogin } from '/hooks/login'

const {setLoginStatus} = useLogin()

// 是否pc端
const isPc = computed(() => {
	const deviceInfo = uni.getDeviceInfo()
	return deviceInfo.deviceType === 'pc'
})

// 防护gj，加个特定参数
onLoad((options) => {
	const hashVal = 'ef20a0514a4ef0393762565f2ffc23b47b3bfec411347097476680a947995046'
	if (!Object.keys(options).includes(hashVal)) {
		uni.switchTab({
			url: '/pages/index/index'
		})
	}
})

const formData = ref({
	account: '',
	pwd: ''
})
const messageRef = ref('')
const msgType = ref('success')
const msgText = ref('')
const submitForm = () => {
	if (formData.value.account === 'admin' && formData.value.pwd === 'Sangfor123.') {
		setLoginStatus(true)
		msgType.value = 'success'
		msgText.value = '登录成功，正在跳转...'
		messageRef.value.open()
		setTimeout(() => {
			uni.switchTab({
				url: '/pages/index/index'
			})
		}, 1000)
	} else {
		setLoginStatus(false)
		msgType.value = 'error'
		msgText.value = '登录失败，请重新输入'
		messageRef.value.open()
	}
}
</script>

<style lang="less">
.login-view {
	padding: 0 32px 32px;
	width: 100%;
	height: 100vh;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	justify-content: center;
	.login__logo {
		text-align: center;
		margin-bottom: 32px;
	}
	.login__submit-button {
		width: 30%;
	}
}
</style>
