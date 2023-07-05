<template>
  <view
    class="uni-skeleton"
    :class="[animated ? 'uni-skeleton-animated' : '']"
    v-bind="$attrs"
  >
    <template v-if="loading">
      <slot name="skeleton">
        <h3 class="uni-skeleton-title" style="width: 38%"></h3>
        <ul class="uni-skeleton-paragraph">
          <li v-for="item in rows" :key="item"></li>
          <li style="width: 61%"></li>
        </ul>
      </slot>
    </template>
    <slot v-else></slot>
  </view>
</template>

<script>
export default {
  name: "uni-skeleton",
  props: {
    rows: {
      type: Number,
      default: 3,
    },
    loading: {
      type: Boolean,
      default: true,
    },
    animated: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {};
  },
};
</script>

<style scoped>
.uni-skeleton {
  width: 100%;
}
.uni-skeleton .uni-skeleton-title {
  height: 16px;
  margin-top: 16px;
  background: #ececec;
}
.uni-skeleton .uni-skeleton-paragraph {
  margin: 0;
  padding: 6px 0 0 0;
}
.uni-skeleton .uni-skeleton-paragraph > li {
  width: 100%;
  margin: 16px 0 0 0;
  height: 16px;
  list-style: none;
  background: #ececec;
}
.uni-skeleton-animated .uni-skeleton-title {
  background: linear-gradient(90deg, #ececec 25%, #d3d4d8 37%, #ececec 63%);
  background-size: 400% 100%;
  animation: lay-skeleton-loading 1.2s ease infinite;
}
.uni-skeleton-animated .uni-skeleton-paragraph > li {
  background: linear-gradient(90deg, #ececec 25%, #d3d4d8 37%, #ececec 63%);
  background-size: 400% 100%;
  animation: lay-skeleton-loading 1.2s ease infinite;
}
@keyframes lay-skeleton-loading {
  0% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0 50%;
  }
}
</style>
