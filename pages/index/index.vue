<template>
	<view class="container"
		  :class="{
			  'pc-container': isPc
		  }">
		<TabBar v-model="activeCategory"
				:dataSource="categoryList"
				style="flex: 0 0 44px;"
				@change="onCategoryChange"></TabBar>
		<scroll-view
			class="article-scroll-view"
			scroll-y
			@scrolltolower="onScrollToLower"
			@touchstart="onTouchStart"
			@touchend="onTouchEnd"
			@touchmove.stop
		>
			<uni-skeleton v-show="!hasLoaded" :rows="6" animated :loading="!hasLoaded" />
			<template v-show="hasLoaded" v-for="article in articleList">
				<uni-card
					v-if="article.type !== 'date'"
					:key="article._id"
					class="article-card"
					:border="false"
					:is-shadow="false"
					@click="jumpPage(article.link)">
					<template #title>
						<!-- 规避：这里给title再加一个click是因为uni-card的title使用插槽时click事件没有冒泡上来 -->
						<view @click.stop="jumpPage(article.link)">
							<image
								v-if="!article.isSquare && article.imgSrc"
								:src="article.imgSrc"
								mode="aspectFill"
								class="article-header__img"></image>
							<view class="article-header__title-wrap"
								  :class="{
									  'article-header__title-wrap--small': article.isSquare
								  }">
								<text
									selectable
									class="article-header__title"
									:class="!article.isSquare && article.imgSrc ? '' : 'article-header__title-small'">{{article.title}}</text>
								<image
									v-if="article.isSquare && article.imgSrc"
									:src="article.imgSrc"
									mode="aspectFit"
									class="article-header__img-small"></image>
							</view>
						</view>
					</template>
					<view class="article-summary"><text selectable>{{article.summary}}</text></view>
					<view class="article-footer">
						<view class="article-footer__time">{{article.timeFlag}}</view>
						<view class="article-footer__icon"></view>
					</view>
				</uni-card>
				<view v-else :key="article.value" class="article-date">{{ article.value }}</view>
			</template>
			<uni-load-more
				v-if="isLoadingMore || loadMoreStatus === LOAD_MORE_STATUS.noMore"
				:status="loadMoreStatus"
				:content-text="loadMoreTextObj" />
		</scroll-view>
	</view>
</template>

<script setup>
import {ref, onMounted, computed} from 'vue'
import { encodeDate, timeTransform } from '../../utils'
import UniSkeleton from '../../components/skeleton/index.vue'
import TabBar from '../../components/tabBar.vue'
import { useTabbarControl } from '../../hooks/tabbarControl.js'

const ALL_TYPE = {
	alias: '全部',
	value: -1
}
const LOAD_MORE_STATUS = {
	loading: 'loading',
	noMore: 'noMore'
}

const articleList = ref([])
const categoryList = ref([])
const activeCategory = ref(ALL_TYPE.value)

// 是否pc端
const isPc = computed(() => {
	const deviceInfo = uni.getDeviceInfo()
	return deviceInfo.deviceType === 'pc'
})

const hasLoaded = ref(false) // 是否已经加载了数据
const isLoadingMore = ref(false) // 是否正在加载更多
const loadMoreStatus = ref(LOAD_MORE_STATUS.loading) // loading和noMore，more这个加载前状态就不用了，只用前面两个状态就够了
let pageNo = 1
const pageSize = 20

// load-more组件各状态的文字
const loadMoreTextObj = {
	contentrefresh: ' ', // 使用空格，空字符串还是会显示默认的“正在加载”
	contentnomore: '没有更多数据了',
}

onMounted(() => {
	useTabbarControl('article-scroll-view')
	getCategoryList()
	getArticles()
})

const getCategoryList = async () => {
	const ret = await uniCloud.callFunction({
		name: 'articles',
		data: {
			type: 'getTypes'
		}
	})
	const list = ret.result.data || []
	list.unshift(ALL_TYPE)
	categoryList.value = list
}
const getArticles = async (isLoadMore = false) => {
	if (loadMoreStatus.value === LOAD_MORE_STATUS.noMore) {
		return
	}

	// 不是加载更多时，则展示全局isLoadingMore
	// 加载更多时，通过isLoadingMore控制加载更多图标的展示
	if (isLoadMore) {
		isLoadingMore.value = true
	}

	const ret = await uniCloud.callFunction({
		name: 'articles',
		data: {
			type: 'getList',
			category: activeCategory.value,
			pageNo,
			pageSize,
		}
	})
	const data = ret.result.data || []
	articleList.value.push(...dataHandler(data))
	
	hasLoaded.value = true

	// 判断是否没有更多数据了
	if (data.length < pageSize || !data.length) {
		loadMoreStatus.value = LOAD_MORE_STATUS.noMore
	}

	if (isLoadMore) {
		isLoadingMore.value = false
	}
}

const dataHandler = (data) => {
	let ret = []
	data.forEach(article => {
		article.labels = article.labels ? article.labels.split(',') : []
		article.push_time = encodeDate(new Date(article.push_time), 'Y-m-d H:i')
		const articleDate = article.push_time.split(' ')[0] // 获取年月日
		// 判断并插入新的日期节点
		if (![...articleList.value, ...ret].some(item => item.type === 'date' && item.value === articleDate)) {
			ret.push({
				type: 'date',
				value: articleDate
			})
		}
		
		// 不在template里面调用函数，先js处理在回填（防止出现nan）
		article.timeFlag = timeTransform(article.push_time)

		ret.push(article)
	})
	return ret
}

// 切换类型的操作
const onCategoryChange = () => {
	reloadList()
}
const reloadList = () => {
	// 重置参数
	hasLoaded.value = false
	articleList.value = []
	pageNo = 1
	loadMoreStatus.value = LOAD_MORE_STATUS.loading
	
	getArticles()
}

// 上拉加载更多
const onScrollToLower = () => {
	if (loadMoreStatus.value === LOAD_MORE_STATUS.noMore) {
		return
	}
	pageNo++
	getArticles(true)
}

const jumpPage = (link) => {
	if (!link) {
		return
	}

	window.location.href = link
	// window.open(link)
}

// 左右滑动切换类别
let touchStartX = 0;
let touchStartY = 0;
const onTouchStart = (e) => {
	touchStartX = e.touches[0].clientX;
	touchStartY = e.touches[0].clientY;
}
const onTouchEnd = (e) => {
	const deltaX = e.changedTouches[0].clientX - touchStartX
	const deltaY = e.changedTouches[0].clientY - touchStartY
	if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY)) {
		const curCategoryIndex = categoryList.value.findIndex(item => item.value === activeCategory.value)
		if (curCategoryIndex < 0) {
			return
		}
		if (deltaX > 0 && curCategoryIndex > 0) {
			activeCategory.value = categoryList.value[curCategoryIndex - 1].value
			reloadList()
		} else if (deltaX < 0 && curCategoryIndex < categoryList.value.length - 1) {
			activeCategory.value = categoryList.value[curCategoryIndex + 1].value
			reloadList()
		}
	}
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

.article-scroll-view {
	height: calc(100% - 44px);
	width: 100%;
	padding: 0 16px;
	box-sizing: border-box;
}

.article-card {
	padding: 0 !important;
	margin: 12px 0 0 0 !important;
	cursor: pointer;
	border-radius: 8px;
	// 覆盖
	font-family: 'PingFang SC Regular', Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif !important;
}

.article-header__img {
	display: block;
	width: 100%;
	height: 144px;
}
.article-header__title-wrap {
	padding: 0 16px;
	margin-top: 20px;
	display: flex;
	justify-content: space-between;
	margin-bottom: 26px;
}
.article-header__title-wrap--small {
	margin-top: 12px;
	margin-bottom: 10px;
}
.article-header__title {
	font-size: 16px;
	font-weight: 600;
	line-height: 24px;
	color: #000;
	white-space: pre-line;
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 3;
	-webkit-box-orient: vertical;
}
/* 展示小图片的情况 */
.article-header__title-small {
	
}
.article-header__img-small {
	height: 60px;
	flex: 0 0 60px;
	border-radius: 6px;
}

.article-date {
	position: relative;
	font-size: 14px;
	line-height: 44px;
	color: #666666;
	/* 抵消article-card的margin */
	margin-bottom: -12px;
	padding-left: 30px;
}
.article-date:before {
	content: '';
	width: 14px;
	height: 30px;
	background: url(/static/img/time-middle.svg) no-repeat center;
	position: absolute;
	left: 0;
	top: 6px;
}
.article-date:first-child:before {
	background: url(/static/img/time-top.svg) no-repeat center;
	top: 14px;
}

.article-summary {
	padding: 0 6px;
	font-size: 14px;
	line-height: 22px;
	color: #000;
	position: relative;
}
.article-summary::before {
	content: '';
	width: 20px;
	height: 30px;
	background: url(/static/img/left-quote.svg) no-repeat center;
	position: absolute;
	left: 2px;
	top: -32px;
}

.article-footer {
	position: relative;
	padding: 0 6px;
	margin-top: 20px;
	&__time {
		font-size: 10px;
		color: #666;
		display: inline-block;
	}
	&__icon {
		width: 20px;
		height: 30px;
		background: url(/static/img/right-quote.svg) no-repeat center;
		position: absolute;
		right: 8px;
		top: -8px;
	}
}
</style>
