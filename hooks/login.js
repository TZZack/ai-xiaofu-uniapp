/**
 * 登录
 */
import { ref } from 'vue'

export function useLogin() {
	const sessionKey = 'status'

	const setLoginStatus = (status) => {
		window.sessionStorage.setItem(sessionKey, status ? '1' : '0')
		isLogin.value = status
	}
	const getLoginStatus = () => {
		return window.sessionStorage.getItem(sessionKey) === '1'
	}

	const isLogin = ref(getLoginStatus())
	
	return {
		isLogin,
		setLoginStatus,
		getLoginStatus
	}
}
