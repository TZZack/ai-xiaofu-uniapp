<template>
	<!-- <web-view :src="link"></web-view> -->
	<iframe id="iframeEl" src="" style="width: 100vw;height:100vh;border:none;"></iframe>
</template>

<script setup>
import { ref, onUnmounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

const getArticle = async (link) => {
	try {
		
		const ret = await uniCloud.callFunction({
			name: 'get-wechat-article',
			data: {
				link
			}
		})
		let htmlStr = ret.result

		// html处理
		htmlStr = htmlStr
			// 把image标签的data-src都改成src，微信公众号文章使用了data-src做图片懒加载，这里直接改回src让浏览器直接发送请求即可
			.replace(/data-src/g, "src")
			// .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/g, '')
			.replace(/https/g, 'http')
			// 把所有的image请求的referer都删掉，这样图片就能正常请求了
			// TODO:但如果是通过brackground-image设置的图片，加载时并不能通过这种方式去掉referer，需要再想办法
			.replace(/content="strict-origin-when-cross-origin"/, 'content="never"')

		// 设置srcdoc：使用srcdoc而不是write，因为write会导致ifram里面的<script type="module">js文件只加载不执行
		let iframe = document.getElementById('iframeEl');
		iframe.srcdoc = htmlStr;
		// 将静态页面写入iframe中
		let doc = iframe.contentDocument || iframe.document;
		// doc.write(htmlStr);
		if (doc.getElementById('js_content')) {
			doc.getElementById('js_content').style.visibility = 'visible';
		}
		// TODO：想要监听iframe的load事件再去hideLoading，但是没触发，暂时没搞明白，直接放这里效果也还可以
		uni.hideLoading()
	} catch (e) {
		// 这里的try catch防止加载iframe内容时切换页面导致上面逻辑报错
	}
}
onLoad((option) => {
	if (!option.link) {
		return
	}
	uni.showLoading({
		mask: true
	})
	getArticle(option.link)
})

onUnmounted(() => {
	// 确保loading隐藏掉了
	uni.hideLoading()
})
</script>

<style>

</style>
