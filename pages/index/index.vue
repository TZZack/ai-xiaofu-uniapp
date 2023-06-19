<template>
	<view class="container">
		<view class="category-tabs">
			<uni-tag
				v-for="item in categoryList"
				:key="item.value"
				:text="item.alias"
				type="primary"
				:inverted="item.value !== activeCategory"
				@click="changeCategory(item.value)" />
		</view>
		<scroll-view
			class="article-scroll-view"
			scroll-y
			@scrolltolower="onScrollToLower"
		>
			<uni-card
				v-for="article in articleList"
				:key="article._id"
				class="article-card"
				:border="false">
				<template #title>
					<view class="article-title" @click="jumpPage(article.link)">{{article.title}}</view>
				</template>
				<view class="article-date">{{article.create_time}}</view>
				<!-- <view class="article-tags" v-if="article.labels.length">
					<view v-for="label in article.labels" :key="label" class="tag-item">
						<uni-icons custom-prefix="iconfont" type="icon-tag" size="13"></uni-icons>
						<text style="margin-left:4px;">{{label}}</text>
					</view>
				</view> -->
				<view class="article-summary">{{article.summary}}</view>
			</uni-card>
			<uni-load-more
				v-if="isLoading || loadMoreStatus === LOAD_MORE_STATUS.noMore"
				:status="loadMoreStatus"
				:content-text="loadMoreTextObj" />
		</scroll-view>
	</view>
</template>

<script setup>
import {ref, onMounted} from 'vue'
import { encodeDate } from '../../utils'

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

const isLoading = ref(false)
const loadMoreStatus = ref(LOAD_MORE_STATUS.loading) // loading和noMore，more这个加载前状态就不用了，只用前面两个状态就够了
let pageNo = 1
const pageSize = 20

// load-more组件各状态的文字
const loadMoreTextObj = {
	contentrefresh: ' ', // 使用空格，空字符串还是会显示默认的“正在加载”
	contentnomore: '没有更多数据了',
}

onMounted(() => {
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

	// 不是加载更多时，则展示全局isLoading
	// 加载更多时，通过isLoading控制加载更多图标的展示
	if (!isLoadMore) {
		uni.showLoading({
			mask: true
		})
	} else {
		isLoading.value = true
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
	data.forEach(article => {
		article.labels = article.labels ? article.labels.split(',') : []
		article.create_time = encodeDate(new Date(article.create_time), 'Y-m-d H:i')
	})
	articleList.value.push(...data)

	// load-more组件状态更新
	if (data.length < pageSize || !data.length) {
		loadMoreStatus.value = LOAD_MORE_STATUS.noMore
	}

	if (!isLoadMore) {
		uni.hideLoading()
	} else {
		isLoading.value = false
	}
}

const changeCategory = (value) => {
	// 切换类型后重置参数
	activeCategory.value = value
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
	uni.navigateTo({
		url: '/pages/outer/index?link=' + encodeURIComponent(link)
	})
}
</script>

<style>
.container {
	font-size: 14px;
	line-height: 24px;
	height: calc(100vh - 50px);
	width: 100%;
	display: flex;
	flex-direction: column;
	box-sizing: border-box;
}

.category-tabs {
	display: flex;
	padding: 12px 16px 12px 16px;
	justify-content: space-between;
	border-bottom: 1px solid #e7e7e7;
	height: 24px;
}

.article-scroll-view {
	height: calc(100% - 50px);
	width: 100%;
	padding: 0 16px 8px;
	box-sizing: border-box;
}

.article-card {
	padding: 16rpx !important;
	margin: 16rpx 0 0 0 !important;
}

.article-title {
	font-size: 14px;
	color: #007BFF;
	text-decoration: underline;
	cursor: pointer;
	white-space: pre-line;
}

.article-tags {
	display: flex;
	margin-bottom: 4px;
}
.tag-item {
	display: inline-block;
	border: 1px solid #e7e7e7;
	border-radius: 8rpx;
	height: 22px;
	line-height: 24px;
	font-size: 12px;
	padding: 0 15rpx;
	margin-right: 8rpx;
	margin-top: 8rpx;
}

.article-date {
	font-size: 14px;
	line-height: 16px;
	color: #a6a6a6;
	margin-bottom: 4px;
}

.article-summary {
	text-indent: 28px;
}
</style>
