<template>
	<view class="meeting-container"
		  :class="{
		      'pc-container': isPc
		  }">
		<scroll-view
			class="meeting-scroll-view"
			scroll-y
			@scrolltolower="onScrollToLower"
		>
			<view class="meeting-group">近期会议</view>
			<uni-skeleton animated :loading="!hasLoaded" :rows="4"></uni-skeleton>
			<uni-list
				v-if="curMeetingList.length"
				class="meeting-list">
				<uni-list-item
					v-for="meeting in curMeetingList"
					:key="meeting._id"
					:show-arrow="false"
					direction="column"
					class="meeting-list-item"
					clickable
					@click="onMeetingClick(meeting.link)">
					<template #body>
						<image
							v-if="!meeting.isSquare && meeting.imgSrc"
							:src="meeting.imgSrc"
							mode="aspectFill"
							class="meeting-header__img"></image>
						<view class="meeting-header"
							  :class="{
								  'meeting-header--small': meeting.isSquare
							  }">
							<view class="meeting-header__text-wrap">
								<view class="meeting-start-time"><text selectable>{{meeting.start_time}}</text></view>
								<view class="meeting-title"><text selectable>{{meeting.title}}</text></view>
							</view>
							<image
								v-if="meeting.isSquare && meeting.imgSrc"
								:src="meeting.imgSrc"
								mode="aspectFit"
								class="meeting-header__img-small"></image>
						</view>
						<view class="meeting-body">
							{{meeting.summary}}
						</view>
					</template>
				</uni-list-item>
			</uni-list>
			<view v-if="!curMeetingList.length && hasLoaded" class="meeting-empty">近期暂无会议</view>
			
			<!-- 不把近期会议和历史会议合到一起复用template，方便后续拓展 -->
			<view class="meeting-group">历史会议</view>
			<uni-skeleton animated :loading="!hasLoaded" :rows="4"></uni-skeleton>
			<uni-list
				v-if="preMeetingList.length"
				class="meeting-list">
				<uni-list-item
					v-for="meeting in preMeetingList"
					:key="meeting._id"
					:showArrow="false"
					direction="column"
					class="meeting-list-item"
					link="navigateTo"
					:to="'/pages/outer/index?link=' + encodeURIComponent(meeting.link)">
					<template #body>
						<image
							v-if="!meeting.isSquare && meeting.imgSrc"
							:src="meeting.imgSrc"
							mode="aspectFill"
							class="meeting-header__img"></image>
						<view class="meeting-header"
							  :class="{
								  'meeting-header--small': meeting.isSquare
							  }">
							<view class="meeting-header__text-wrap">
								<view class="meeting-start-time"><text selectable>{{meeting.start_time}}</text></view>
								<view class="meeting-title"><text selectable>{{meeting.title}}</text></view>
							</view>
							<image
								v-if="meeting.isSquare && meeting.imgSrc"
								:src="meeting.imgSrc"
								mode="aspectFit"
								class="meeting-header__img-small"></image>
						</view>
						<view class="meeting-body">
							{{meeting.summary}}
						</view>
					</template>
				</uni-list-item>
			</uni-list>
			<view v-if="!preMeetingList.length && hasLoaded" class="meeting-empty">暂无历史会议</view>
			
			<uni-load-more
				v-if="isLoadingMore || loadMoreStatus === LOAD_MORE_STATUS.noMore"
				:status="loadMoreStatus"
				:content-text="loadMoreTextObj" />
		</scroll-view>
	</view>
</template>

<script setup>
import {ref, onMounted, computed} from 'vue'
import { encodeDate } from '../../utils'
import { useTabbarControl } from '../../hooks/tabbarControl.js'
import UniSkeleton from '../../components/skeleton/index.vue'

const curMeetingList = ref([])	// 近期会议列表
const preMeetingList = ref([])	// 历史会议列表
const hasPre = false // 是否已有历史会议（是的话可以更方便处理后面加载的数据）

const LOAD_MORE_STATUS = {
	loading: 'loading',
	noMore: 'noMore'
}

const isLoadingMore = ref(false) // 是否正在加载更多数据
const hasLoaded = ref(false) // 是否已经加载过数据（用于展示骨架屏）
const loadMoreStatus = ref(LOAD_MORE_STATUS.loading) // loading和noMore，more这个加载前状态就不用了，只用前面两个状态就够了
let pageNo = 1
const pageSize = 20

// 是否pc端
const isPc = computed(() => {
	const deviceInfo = uni.getDeviceInfo()
	return deviceInfo.deviceType === 'pc'
})

// load-more组件各状态的文字
const loadMoreTextObj = {
	contentrefresh: ' ', // 使用空格，空字符串还是会显示默认的“正在加载”
	contentnomore: '没有更多数据了',
}

onMounted(() => {
	useTabbarControl('meeting-scroll-view')
	getMeetings()
})

const getMeetings = async (isLoadMore = false) => {
	if (loadMoreStatus.value === LOAD_MORE_STATUS.noMore) {
		return
	}

	// 通过isLoadingMore控制加载更多图标的展示
	if (isLoadMore) {
		isLoadingMore.value = true
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
	const preList = []
	const curList = []
	data.forEach(meeting => {
		const meetingDate = new Date(meeting.start_time)
		meeting.start_time = encodeDate(meetingDate, 'Y-m-d')

		if (new Date().getTime() < meetingDate.getTime()) {
			curList.push(meeting)
		} else {
			preList.push(meeting)
		}
	})
	hasLoaded.value = true

	// 把data分别放进两个数组
	curList.length && curMeetingList.value.push(...curList)
	preList.length && preMeetingList.value.push(...preList)
	
	// 判断是否没有更多数据了
	if (data.length < pageSize || !data.length) {
		loadMoreStatus.value = LOAD_MORE_STATUS.noMore
	}

	if (isLoadMore) {
		isLoadingMore.value = false
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

const onMeetingClick = (link) => {
	window.location.href = link
}
</script>

<style lang="less">
.meeting-container {
	font-size: 14px;
	line-height: 24px;
	height: 100vh;
	width: 100%;
	box-sizing: border-box;
}

.meeting-scroll-view {
	height: 100%;
	width: 100%;
	padding: 0 16px;
	box-sizing: border-box;
}
.meeting-empty {
	width: 100%;
	height: 40px;
	line-height: 40px;
	text-align: center;
}

.meeting-group {
	font-size: 24px;
	font-weight: normal;		
	color: #3D3D3D;
	padding: 16px 0 8px;
}
.meeting-list {
	padding: 0 12px;
	border-radius: 8px;

	:deep(.uni-list-item__container) {
		padding: 12px 0 16px !important;
	}
	/* 取消点击的hover效果 */
	:deep(.uni-list-item--hover) {
		background-color: #fff !important;
	}
	/* 大图 */
	.meeting-header__img {
		display: block;
		width: 100%;
		height: 144px;
		margin-bottom: 4px;
		border-radius: 8px 8px 0px 0px;
	}
}
.meeting-header {
	display: flex;
	justify-content: space-between;
	margin-bottom: 20px;
	&.meeting-header--small {
		margin-bottom: 18px;
	}

	.meeting-header__text-wrap {
		padding-top: 6px;
		.meeting-start-time {
			font-family: Montserrat;
			font-size: 11px;
			font-weight: bold;
			line-height: 15px;
			color: #698AFD;
		}
		.meeting-title {
			font-size: 16px;
			font-weight: 600;
			color: #000;
			margin-top: 2px;
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-line-clamp: 3;
			-webkit-box-orient: vertical;
		}
	}
	.meeting-header__img-small {
		height: 60px;
		flex: 0 0 60px;
		border-radius: 6px;
	}
}
</style>
