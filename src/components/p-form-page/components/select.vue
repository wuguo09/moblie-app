<template>
  <article class="from-select">
    <div
      v-if="refresh"
      :disabled="disabled"
      :class="{ disabled: disabled }"
      class="select-input"
      @click="show"
    >
      <div class="text" :class="{ placeholder: !isVal }">{{ currentText }}</div>
      <div class="icon param-icon-sys_Down"></div>
    </div>
    <u-picker
      :columns="[columns]"
      :keyName="keyName"
      v-bind="$attrs"
      :show="showPicker"
      :immediateChange="true"
      class="picker"
      cancel-text="清空"
      @confirm="onConfirm"
      @cancel="onCancel"
    >
    </u-picker>
  </article>
</template>
<script lang="ts" setup>
import { computed, nextTick, ref, toRaw } from "vue";
const props = defineProps({
  modelValue: {
    type: [Number, String],
    default: "",
  },
  label: {
    type: String,
    default: "",
  },
  columns: {
    type: Array,
    defulat: () => [],
  },
  keyName: {
    type: String,
    default: "label",
  },
  valueName: {
    type: String,
    default: "value",
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
const emits = defineEmits(["update:modelValue", "change", "update:label"]);
const refresh = ref(true);
const showPicker = ref(false);
function show() {
  if (props.disabled) return;
  showPicker.value = true;
}
const onConfirm = (data: { index: number[]; value: any[]; values: any[] }) => {
  const currentData = data.value[0][props.valueName];
  emits("update:modelValue", currentData);

  emits("change", toRaw(data.value[0]));
  showPicker.value = false;
  refresh.value = false;
  nextTick(() => {
    emits("update:label", getLable());
    refresh.value = true;
  });
};

const isVal = computed(() => {
  if (
    props.modelValue !== undefined &&
    props.modelValue !== null &&
    props.columns
  ) {
    if (props.modelValue === "") return false;
    return true;
  }
  return false;
});

function getLable() {
  if (isVal.value) {
    const items = props.columns.filter(
      (item) => item[props.valueName] === props.modelValue
    );
    if (items.length > 0) {
      return items[0][props.keyName];
    }
  }
  return props.placeholder;
}
const onCancel = () => {
  emits("update:modelValue", null);
  emits("change");
  emits("update:label", '')
  showPicker.value = false;
};
const currentText = computed(() => {
  return getLable();
});

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
  padding-right: 16px;

  &.disabled {
    background: #f0f0f0;
  }
}

.text,
.icon,
.picker {
  color: rgba(0, 0, 0, 0.65);
}
.placeholder {
  color: rgb(192, 196, 204) !important;
}
.text{
  padding-left: 9px;
}
</style>
