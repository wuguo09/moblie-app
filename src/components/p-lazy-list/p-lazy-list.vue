<template>
  <view class="u-page lazy-list">
    <u-list
      class="list-wrap"
      v-if="dataList.length > 0"
      @scrolltolower="lazyLoad"
      height="100%"
    >
      <view class="list-item" v-for="(item, index) in dataList" :key="index">
        <u-list-item>
          <slot :data="item" :index="index"></slot>
        </u-list-item>
      </view>
    </u-list>
    <div class="noData" v-else>
      <div class="noDataContent">
        <image class="img" src="./assets/nodata.png"></image>
        <div class="text">{{ props.noDataText }}</div>
        <div class="text2">稍后再来查看吧~</div>
      </div>
    </div>
  </view>
</template>

<script lang="ts" setup>
import { lazyListProps } from "./interface";
import getList from "./methods/getList";
const props = defineProps(lazyListProps);
console.log(props);
const { pageParams, reset, dataList, lazyLoad, clear, search } = getList(props);
defineExpose({
  clear,
  search,
  reset,
  pageParams,
});
</script>
<style lang="scss" scoped>
.u-page {
  height: 100%;
}
.lazy-list {
  padding: 8px;
}

.list-item {
  margin-bottom: 8px;
}
.noData {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
}
.img {
  height: 90px;
  width: 100px;
  object-fit: cover;
  margin-bottom: 20px;
}
.text {
  font-family: 思源黑体 CN;
  font-size: 20px;
  font-weight: normal;
  line-height: normal;
  color: rgba(0, 0, 0, 0.65);
  margin-bottom: 20px;
}
.text2 {
  font-size: 12px;
  font-feature-settings: "kern" on;
  color: rgba(0, 0, 0, 0.4);
}
</style>
