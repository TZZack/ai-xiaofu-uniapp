<template>
	<!-- <web-view :src="link"></web-view> -->
	<iframe id="iframeEl" src="" style="width: 100vw;height:100vh;border:none;"></iframe>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

const getArticle = async (link) => {

	const ret = await uniCloud.callFunction({
		name: 'get-wechat-article',
		data: {
			link
		}
	})
	let htmlStr = ret.result

	/**
	 * 这里的处理是
	 * 1、data-src转为src
	 * 2、去掉所有script标签
	 * 3、加个<meta name="referer" content="never">这里直接把之前的改掉即可
	 */
	htmlStr = htmlStr.replace(/data-src/g, "src")
		.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/g, '')
		.replace(/https/g, 'http')
		.replace(/content="strict-origin-when-cross-origin"/, 'content="never"');
	// 设置src
	let iframe = document.getElementById('iframeEl');
	iframe.src = htmlStr;
	// 将静态页面写入iframe中
	let doc = iframe.contentDocument || iframe.document;
	doc.write(htmlStr);
	// //通过延时获取文档高度赋值Iframe去除滚动条，根据实际情况增加延时时间
	// setTimeout(() => {
	// 	that.height = doc.documentElement.scrollHeight;
	// }, 500);
	doc.getElementById("js_content").style.visibility = "visible";
	// TODO：想要监听iframe的load事件再去hideLoading，但是没触发，暂时没搞明白，直接放这里效果也还可以
	uni.hideLoading()
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
</script>

<style>

</style>
