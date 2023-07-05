/**
 * 屏幕滑动时隐藏tabbar，停止滑动则恢复展示
 */
import { onUnmounted } from 'vue'

export function useTabbarControl(containerClass) {
	let timerId
	const containerEl = document.getElementsByClassName(containerClass)[0]
	if (!containerEl) {
		return
	}
	// touchmove时隐藏
	const hideTabbarFn = () => {
		if (timerId) {
			clearTimeout(timerId)
		}
		const tabbarEl = document.getElementsByClassName('uni-tabbar')[0]
		if (!tabbarEl) {
			return
		}
		// 动画
		tabbarEl.style.transform = 'translateY(100px)'
	}
	containerEl.addEventListener('touchstart', hideTabbarFn, {
		passive: false
	})
	
	const showTabbarFn = () => {
		timerId = setTimeout(() => {
			const tabbarEl = document.getElementsByClassName('uni-tabbar')[0]
			if (!tabbarEl) {
				return
			}
			// 动画
			tabbarEl.style.transform = 'translateY(0px)'
		}, 800)
	}
	containerEl.addEventListener('touchend', showTabbarFn, {
		passive: false
	})
	
	onUnmounted(() => {
		containerEl.removeEventListener('touchstart', hideTabbarFn)
		containerEl.removeEventListener('touchend', showTabbarFn)
	})
}
