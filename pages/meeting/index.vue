<template>
	<view class="meeting-container">
		<scroll-view
			class="meeting-scroll-view"
			scroll-y
			@scrolltolower="onScrollToLower"
		>
			<uni-card
				v-for="meeting in meetingList"
				:key="meeting._id"
				class="meeting-card"
				:class="meeting.status ? '' : 'meeting-disable'"
				:border="false"
				is-shadow>
				<template #title>
					<text
						selectable
						class="meeting-title"
						@click="jumpPage(meeting.link)">{{meeting.title}}</text>
				</template>
				<view class="meeting-create-date"><b>开始时间：</b>{{meeting.start_time}}</view>
				<text selectable class="meeting-summary"><text selectable class="meeting-summary--label">会议简介：</text>{{meeting.summary}}</text>
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

const meetingList = ref([])

const LOAD_MORE_STATUS = {
	loading: 'loading',
	noMore: 'noMore'
}

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
	getMeetings()
})

const getMeetings = async (isLoadMore = false) => {
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
		name: 'meetings',
		data: {
			type: 'getList',
			pageNo,
			pageSize,
		}
	})
	const data = ret.result.data || []
	data.forEach(meeting => {
		// status表示是否会议已过期
		meeting.status = new Date().getTime() < new Date(meeting.start_time).getTime()

		meeting.start_time = encodeDate(new Date(meeting.start_time), 'Y-m-d H:i')
	})
	meetingList.value.push(...data)
	
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

// 上拉加载更多
const onScrollToLower = () => {
	if (loadMoreStatus.value === LOAD_MORE_STATUS.noMore) {
		return
	}
	pageNo++
	getMeetings(true)
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
.meeting-container {
	font-size: 14px;
	line-height: 24px;
	height: calc(100vh - 50px);
	width: 100%;
	box-sizing: border-box;
}

.meeting-scroll-view {
	height: 100%;
	width: 100%;
	padding: 0 16px 8px;
	box-sizing: border-box;
}

.meeting-card {
	padding: 16rpx !important;
	margin: 16rpx 0 0 0 !important;
}

.meeting-title {
	font-size: 14px;
	color: #007BFF;
	text-decoration: underline;
	cursor: pointer;
	white-space: pre-line;
}
.meeting-disable .meeting-title {
	color: #8f939c;
}

.meeting-date {
	font-size: 14px;
	line-height: 16px;
	color: #a6a6a6;
}

.meeting-summary--label {
	font-weight: bold;
}
</style>
