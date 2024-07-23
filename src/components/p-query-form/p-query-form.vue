<template>
  <view class="query-form">
    <div class="header">
      <div
        @click="show = true"
        :class="['icon', 'param-icon-bns_Sifting', hasSearch() ? 'active' : '']"
      ></div>
      <u-search
        :placeholder="placeholder"
        v-model="formData[searchKey]"
        @search="search"
        :clearabled="true"
        :showAction="false"
        @clear="clear"
      ></u-search>
    </div>
    <u-popup
      v-if="show"
      :show="show"
      title="任务筛选"
      mode="bottom"
      @close="close"
      @open="open"
      safeAreaInsetTop
      round
      closeable
      :closeOnClickOverlay="false"
    >
      <view class="query-popup">
        <view class="content">
          <slot name="content" :model="formData"></slot>
        </view>
        <view class="btns">
          <view class="btn reset" @click="reset">重置</view>
          <view class="btn search" @click="search">确认</view>
          <!-- <u-button
            color="#F7F7F7"
            style="color: #018c83"
            text="重置"
            @click="reset"
          ></u-button>
          <u-button color="#018C83" text="完成" @click="search"></u-button> -->
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref, nextTick } from "vue";
import { queryFormProps } from "./type";
const props = defineProps(queryFormProps);
const emits = defineEmits(["search", "reset"]);
const show = ref(false);
const refresh = ref(true);

const open = () => {
  console.log("open");
};

const hasSearch = () => {
  for (const key in formData) {
    if (formData[key]) {
      return true;
    }
  }
  return false;
};

const close = () => {
  show.value = false;
};
const formData: Record<string, any> = reactive({});

function search() {
  emits("search", formData);
  show.value = false;
}
function clear() {
  formData[props.searchKey] = "";
  emits("search", formData);
}
function resetAll() {
  formData[props.searchKey] = "";
  reset();
}
function reset() {
  refresh.value = false;
  for (const key in formData) {
    if (key === props.searchKey) continue
    formData[key] = null;
  }
  emits("reset", formData);
  nextTick(() => {
    refresh.value = true;
  });
}
defineExpose({
  resetAll,
});
</script>
<style lang="scss" scoped>
.query-form {
  box-sizing: border-box;
  height: 50px;
  opacity: 1;
  background: #f8f8f8;
  box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.05);

  padding: 9px 14px;

  .icon {
    font-size: 24px;
    font-weight: bold;
    color: rgba(0, 0, 0, 0.5);
    &.active {
      color: #008653;
    }
  }
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.query-popup {
  box-sizing: border-box;
  padding: 20px;
}

.content {
  min-height: 150px;
  overflow: auto;
  margin-bottom: 15px;
  width: 100%;
  font-size: 14px;
  line-height: normal;
  color: rgba(0, 0, 0, 0.85);
}

.btns {
  height: 40px;
  display: flex;
  justify-content: space-between;

  .u-button,
  .btn {
    width: calc(50% - 25px);
    height: 40px;
    border-radius: 40px;
    font-family: 思源黑体 CN;
    font-size: 16px;
    font-weight: 500;
    line-height: 40px;
    text-align: center;
    letter-spacing: 0px;
    color: #ffffff;
    &.reset {
      background: linear-gradient(90deg, #f0954b 0%, #ffd753 100%);
      box-shadow: 0px 4px 10px 0px rgba(240, 149, 75, 0.2);
    }
    &.search {
      background: linear-gradient(270deg, #70a84e 0%, #008673 99%);
      box-shadow: 0px 4px 10px 0px rgba(112, 168, 78, 0.2);
    }
  }
}

.label {
  text-align: left;
  font-size: 16px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.85);
  margin-bottom: 10px;
}

.col {
  border-right: 1px solid rgba(0, 0, 0, 0.05);
  height: 100%;

  &:last-child {
    border-right: none;
  }
}

.col-item {
  margin-bottom: 18px;
  white-space: nowrap;

  &.active {
    color: #008653;
  }
}
</style>
