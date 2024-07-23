<template>
  <article class="address-map">
    <div
      v-if="refresh"
      :disabled="disabled"
      :class="{ disabled: disabled }"
      class="select-input"
      @click="show"
    >
      <div class="text" :class="{placeholder:!address}">{{ address || placeholder }}</div>
      <div class="icon param-icon-bns_signage-coordinate-line"></div>
    </div>
    <u-popup
      :show="showPicker"
      safeAreaInsetBottom
      :round="10"
      @close="showPicker = false"
      @open=""
      closeable
    >
      <view class="map">
        <div class="amap">
          <my-amap ref="amap"></my-amap>
        </div>

        <view class="footer">
          <div class="address">{{ address || "请点击选择" }}</div>
          <u-button
            class="btn"
            text="确定"
            @click="onConfirm"
            color="linear-gradient(270deg, #008673 0%, #8AD37D 100%)"
          ></u-button>
        </view>
      </view>
    </u-popup>
  </article>
</template>
<script lang="ts" setup>

import type myAmap from "@/components/my-amap/my-amap.vue";
import Utils from "@/utils";
import { nextTick, onMounted, ref, toRaw } from "vue";
const props = defineProps({
  modelValue: {
    type: [Number, String],
    default: "",
  },
  address: {
    type: [Number, String],
    default: "",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  placeholder: {
    type: String,
    default: "请输入",
  },
});
const amap = ref<InstanceType<typeof myAmap> | null>(null);
const emits = defineEmits(["update:modelValue", "update:address"]);
const refresh = ref(true);
const showPicker = ref(false);
function show() {
  if (props.disabled) return;
  showPicker.value = true;
  nextTick(() => {
    init();
  });
}

const onConfirm = () => {
  showPicker.value = false;
};
let removeMarker = null;
async function eventMarker(e) {
  
}
async function updateData(e) {
  
}
async function initLocation() {
  
}
async function init() {
  
}
onMounted(() => {
  init();
  initLocation();
});
</script>
<style lang="scss" scoped>
.address-map {
  color: rgba(0, 0, 0, 0.05);
  width: 100%;
}

.select-input {
  width: 100%;
  height: 40px;
  border-radius: 8px;
  background: #ffffff;
  box-sizing: border-box;
  display: flex;
  font-size: 15px;
  align-items: center;
  justify-content: space-between;
  padding-right:16px;

  &.disabled {
    background: #f0f0f0;
  }
}

.map {
  height: 90vh;
  width: 100%;
}

.text,
.icon,
.picker {
  color: rgba(0, 0, 0, 0.65);
}
.placeholder{
	color: rgb(192, 196, 204) !important;
  }
.amap {
  height: calc(100% - 130px);
}

.footer {
  height: 130px;
  padding: 16px 22px;
  box-sizing: border-box;

  .address {
    font-size: 20px;
    font-weight: 600;
    line-height: normal;
    letter-spacing: 0em;
    color: rgba(0, 0, 0, 0.85);
    margin-bottom: 5px;
    height: 55px;
    overflow: auto;
  }

  .btn {
    box-shadow: 2px 2px 10px 0px rgba(0, 134, 115, 0.15);
    border-radius: 102px;
  }
}
</style>
