<template>
	<scroll-view 
		class="xf-tab-bar"
		scroll-x
		@touchmove.stop>
		<view
			v-for="item in dataSource"
			:key="item.value"
			class="xf-tab-bar__item"
			:class="item.value === activeTab ? 'active-tab' : ''"
			@click="onClickTab(item.value)">
			<text>{{ item.alias }}</text>
		</view>
	</scroll-view>
</template>

<script setup>
import { ref } from "vue";
const props = defineProps({
	dataSource: Array,
	modelValue: Number
})
const emits = defineEmits(['update:modelValue', 'change'])

const activeTab = ref(props.modelValue)
const onClickTab = (tabVal) => {
	if (tabVal === activeTab.value) {
		return
	}
	activeTab.value = tabVal
	emits('update:modelValue', tabVal)
	emits('change', tabVal)
}
</script>

<style lang="less">
.xf-tab-bar {
	box-shadow: inset 0 -1px #dedede;
	height: 44px;
	white-space: nowrap;
	width: 100%;
	&__item {
		display: inline-block;
		height: 100%;
		line-height: 44px;
		padding: 0 24rpx;
		cursor: pointer;
		&.active-tab {
			color: #3D75C0;
			box-shadow: inset 0 -3px;
		}
	}
	&__item:first-child {
		margin-left: 16px;
	}
	&__item:last-child {
		margin-right: 16px;
	}
}
</style>