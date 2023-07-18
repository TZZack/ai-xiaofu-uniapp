<template>
	<view class="container"
		  :class="{
			  'pc-container': isPc
		  }">
		<uni-skeleton v-show="!hasLoaded" :rows="6" animated :loading="!hasLoaded" />
		<swiper
			v-show="hasLoaded"
			vertical
			next-margin="14%"
			class="article-swiper"
			:current="currentIndex"
			@change="onSwiperChange">
			<swiper-item
				v-for="article in articleList"
				:key="article._id"
				class="article-swiper-item">
				<uni-card
					class="article-card"
					:border="false"
					:is-shadow="false"
					@click="jumpPage(article.link)">
					<template #title>
						<!-- 规避：这里给title再加一个click是因为uni-card的title使用插槽时click事件没有冒泡上来 -->
						<view @click.stop="jumpPage(article.link)">
							<image
								v-if="article.imgSrc"
								:src="article.imgSrc"
								mode="aspectFill"
								class="article-header__img"></image>
						</view>
					</template>
					<view class="article-content-wrap">
						<view class="article-summary"
							:style="{
								'-webkit-line-clamp': webkitLineClamp
							}"><text selectable>{{article.summary}}</text></view>
						<view class="article-from">
							<view class="article-from__label">来自：</view>
							<text class="article-from__title-link">{{article.title}}</text>
						</view>
						<view class="article-footer">
							<view class="article-footer__official-account">
								<image :src="article.official_account_logo"
									class="official-account-logo"></image>
								<text class="official-account-name">{{article.official_account_name || ''}}</text>
							</view>
							<view class="article-footer__time">{{article.timeFlag}}</view>
						</view>
					</view>
					
					<!-- 超级权限 -->
					<view v-if="isLogin"
						class="admin-toolbar"
						:class="article.isDeleted ? 'admin-toolbar--deleted' : ''"
						@click.stop="onAdminClick(article)">
						<uni-icons :type="article.isDeleted ? 'refreshempty' : 'trash'" size="26"></uni-icons>
						<view v-if="article.isDeleted" class="admin-toolbar__deleted-msg">已删除</view>
					</view>

				</uni-card>
			</swiper-item>
		</swiper>
		<uni-popup ref="confirmDialog" type="dialog">
			<uni-popup-dialog
				type="warn"
				:content="confirmContent"
				calcelText="取消"
				confirmText="确定"
				@confirm="onAdminConfirm" />
		</uni-popup>
	</view>
</template>

<script setup>
import {ref, onMounted, computed, nextTick} from 'vue'
import { encodeDate, timeTransform } from '../../utils/format'
import UniSkeleton from '../../components/skeleton/index.vue'
import { useLogin } from '/hooks/login'

const articleList = ref([])

// 是否pc端
const isPc = computed(() => {
	const deviceInfo = uni.getDeviceInfo()
	return deviceInfo.deviceType === 'pc'
})

// 计算webkitLineClamp，不同分辨率内容区域的高度不一样（因为要尽量把内容区域最大化，用了flex:1）
const webkitLineClamp = ref(0)
const calcLineClamp = () => {
	const textContainer = document.querySelector('.article-summary')
	webkitLineClamp.value = Math.round(textContainer.clientHeight / 30)
}

const hasLoaded = ref(false) // 是否已经加载了数据
const isNoMore = false // 是否没有更多
let pageNo = 1
const pageSize = 20

const {isLogin} = useLogin()
onMounted(() => {
	getArticles()
})


const getArticles = async () => {
	if (isNoMore) {
		return
	}

	const ret = await uniCloud.callFunction({
		name: 'articles',
		data: {
			isAdmin: isLogin.value,
			type: 'getList',
			pageNo,
			pageSize,
		}
	})
	const data = ret.result.data || []
	articleList.value.push(...dataHandler(data))
	
	hasLoaded.value = true

	// 判断是否没有更多数据了
	if (data.length < pageSize || !data.length) {
		isNoMore = true
	}
	
	// 等待渲染完数据后（dom），才来计算多少行显示省略号
	await nextTick()
	calcLineClamp()
}

const dataHandler = (data) => {
	data.forEach(article => {
		
		// 不在template里面调用函数，先js处理在回填（防止出现nan）
		article.timeFlag = timeTransform(article.push_time)
	})
	return data
}

// 上拉加载更多
const currentIndex = ref(0) // swiper的当前索引，单向
const loadMore = () => {
	if (isNoMore) {
		return
	}
	pageNo++
	getArticles()
}
const onSwiperChange = (e) => {
	const {detail} = e
	const {current} = detail
	if (current >= articleList.value.length - 3) {
		// 因为swiper组件的current是单向的，更新了数组后会按照传入的current重新渲染，所以这里也同步修改下current，防止跳到第一个
		currentIndex.value = current
		loadMore()
	}
}

const jumpPage = (link) => {
	if (!link) {
		return
	}

	window.open(link)
}

// admin管理相关
const confirmDialog = ref('')
const confirmContent = ref('')
let selectedArticle = ''
const onAdminClick = async (article) => {
	if (!article?._id) {
		return
	}
	selectedArticle = article
	confirmContent.value = article.isDeleted === 1 ? '确定恢复？' : '确定删除？'
	confirmDialog.value.open()
}
const onAdminConfirm = async () => {
	if (!selectedArticle?._id) {
		return
	}
	const newDeleteStatus = selectedArticle.isDeleted === 1 ? 0 : 1
	await uniCloud.callFunction({
		name: 'articles',
		data: {
			type: 'updateDeleteStatus',
			id: selectedArticle._id,
			isDeleted: newDeleteStatus
		}
	})

	selectedArticle.isDeleted = newDeleteStatus
}
</script>

<style lang="less">
.container {
	font-size: 14px;
	line-height: 24px;
	height: 100vh;
	width: 100%;
	display: flex;
	flex-direction: column;
	box-sizing: border-box;
}

.article-swiper {
	height: 100%;
	width: 100%;
	padding: 0 16px;
	box-sizing: border-box;
}

.article-card {
	height: calc(100% - 12px); // 12是margin-top
	margin: 12px 0 0 0 !important;
	padding: 0 !important;
	cursor: pointer;
	border-radius: 8px;
	// 覆盖
	font-family: 'PingFang SC Regular', Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif !important;
	
	.article-header__img {
		display: block;
		width: 100%;
		height: 360rpx;
	}
	:deep(.uni-card__content) {
		padding: 0 !important;
		height: calc(100% - 360rpx);
	}
	
	.article-content-wrap {
		padding: 144rpx 64rpx 20rpx;
		position: relative;
		display: flex;
		flex-direction: column;
		height: 100%;
		box-sizing: border-box;
	}
	.article-content-wrap::before {
		content: '';
		width: 40px;
		height: 40px;
		background: url(/static/img/left-quote.svg) no-repeat center;
		position: absolute;
		left: 30rpx;
		top: 48rpx;
	}
	
	// 文章简介/总结
	.article-summary {
		font-size: 15px;
		line-height: 30px;
		color: #000;
		font-weight: 500;
		flex: 1;
		text-align: justify;
		// // 超过n行显示...
		white-space: pre-line;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		// -webkit-line-clamp: 5;
		-webkit-box-orient: vertical;
	}
	
	// 文章出处
	.article-from {
		display: flex;
		align-items: baseline;
		font-size: 12px;
		line-height: 20px;
		margin-top: 24px;
		flex: 0 0 204rpx;
		&__label {
			// display: inline-block;
			flex: 0 0 46px;
			color: #86909C;
		}
		&__title-link {
			color: #165DFF;
			flex: 1;
			// 超过两行显示...
			white-space: pre-line;
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-line-clamp: 2;
			-webkit-box-orient: vertical;
		}
	}
	
	// 文章footer：公众号名称、时间
	.article-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex: 0 0 60rpx;
		position: relative;
		&__official-account {
			display: flex;
			align-items: center;
			.official-account-logo {
				width: 24px;
				height: 24px;
				margin-right: 8px;
			}
			.official-account-name {
				font-size: 12px;
				font-weight: 500;
				line-height: 16px;
				color: #1D2129;
			}
		}
		&__time {
			font-size: 12px;
			font-weight: 500;
			line-height: 16px;
			color: #C9CDD4;
		}
	}
	.article-footer::after {
		content: '';
		width: 40px;
		height: 40px;
		background: url(/static/img/right-quote.svg) no-repeat center;
		position: absolute;
		right: -40rpx;
		bottom: 94rpx;
	}
}

.admin-toolbar {
	padding: 0 20px;
	height: 36px;
	line-height: 36px;
	background-color: #a9c9ff;
	border-radius: 4px;
	cursor: pointer;
	display: flex;
	justify-content: center;
	position: relative;
	&--deleted {
		background-color: #d3d4d8;
	}
	.admin-toolbar__deleted-msg {
		position: absolute;
		right: 10px;
		color: #e43d33;
	}
}
</style>
