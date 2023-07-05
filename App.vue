<script>
	export default {
		onLaunch: function() {

		},
		onShow: function() {

		},
		onHide: function() {

		}
	}
</script>

<style lang="scss">
	
	/*每个页面公共css */
	@import '@/uni_modules/uni-scss/index.scss';
	
	/* #ifndef APP-NVUE */
	// 设置整个项目的背景色
	page {
		background-color: #f3f3f3;
		font-family: 'PingFang SC Regular', Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif;
	}

	/* #endif */
	.example-info {
		font-size: 14px;
		color: #333;
		padding: 10px;
	}
	
	/* 解决 H5 下scroll-view的滚动条问题，H5下不展示滚动条 */
	/* #ifdef H5 */
	uni-scroll-view .uni-scroll-view::-webkit-scrollbar {
		/* 隐藏滚动条，但依旧具备可以滚动的功能 */
		display: none;
		width: 0 !important;
		height: 0 !important;
		-webkit-appearance: none;
		background: transparent;
		color: transparent;
	}
	/* #endif */
	
	/* tabbar样式定制 */
	.uni-tabbar-bottom {
		bottom: 12px;
		.uni-tabbar {
			width: 186px;
			height: 60px;
			border-radius: 100px;
			box-shadow: 0px 0px 10px 1px rgba(0, 0, 0, 0.15);
			bottom: calc(12px + env(safe-area-inset-bottom)) !important;
			left: 0;
			right: 0;
			margin: auto;
			transition: transform 0.5s ease-in-out;
			padding-bottom: 0 !important;
		}
	}
	.uni-app--showtabbar uni-page-wrapper::after {
		display: none;
	}
	
	/* 公共样式 */
	.pc-container {
		max-width: 677px;
		margin-left: auto;
		margin-right: auto;
	}
	
	/**
	 * 解决报错[Intervention] Unable to preventDefault inside passive event listener due to target being treated as passive.
	 * addEventListener的passive配置为false也还是有报错，只能通过这个全局样式来规避
	 * */
	* {
	  touch-action: pan-y pan-x;
	}
</style>
