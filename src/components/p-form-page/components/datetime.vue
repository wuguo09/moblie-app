<template>
  <article class="from-select">
    <div
      v-if="refresh"
      :disabled="disabled"
      :class="{ disabled: disabled }"
      class="select-input"
      @click="show"
    >
      <div class="text" :class="{placeholder:!modelValue}">{{ modelValue || placeholder }}</div>
      <div class="icon param-icon-bns_date"></div>
    </div>
    <u-datetime-picker
      :show="showPicker"
      v-model="myTime"
      v-bind="$attrs"
      @confirm="onConfirm"
      @cancel="showPicker = false"
    ></u-datetime-picker>
    <!-- <u-picker :columns="[columns]" :keyName="keyName" v :show="showPicker" class="picker"
			cancel-button-text="清空" @confirm="onConfirm" @cancel="onCancel">
		</u-picker> -->
  </article>
</template>
<script lang="ts" setup>
import dayjs from "dayjs";
import { computed, ref } from "vue";
const props = defineProps({
  modelValue: {
    type: [Number, String],
    default: "",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  formatter: {
    type: String,
    default: "YYYY-MM-DD HH:mm:ss",
  },
  placeholder: {
    type: String,
    default: "请输入",
  },
});
const emits = defineEmits(["update:modelValue"]);
const refresh = ref(true);
const showPicker = ref(false);
function show() {
  if (props.disabled) return;
  showPicker.value = true;
}

const myTime = computed({
  get() {
    return props.modelValue
      ? new Date(props.modelValue).getTime()
      : new Date().getTime();
  },
  set(val) {
    emits("update:modelValue", dayjs(val).format(props.formatter));
  },
});
const onConfirm = (val) => {
  showPicker.value = false;
  //const currentData = data.value[0][props.valueName]
  // emits("update:modelValue", currentData)
  // emits("change", toRaw(data.value[0]))
  // showPicker.value = false
  // refresh.value = false
  // nextTick(() => {
  // 	refresh.value = true
  // })
};
</script>
<style lang="scss" scoped>
.from-select {
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

.text,
.icon,
.picker {
  color: rgba(0, 0, 0, 0.8);
 
}
.placeholder{
	color: rgb(192, 196, 204) !important;
  }
</style>
