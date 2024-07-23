<template>
  <div :class="['tag', type]" :style="{ background: myColor }">
    {{ myLable }}
  </div>
</template>

<script setup lang="ts">
import type { PropType } from "vue";
interface Option {
  label: string;
  value: any;
  color: string;
}
import { computed } from "vue";
const props = defineProps({
  value: {
    type: [String, Number],
    default: "",
  },
  options: {
    type: Array as PropType<Option[]>,
    default: () => [],
  },
  color: {
    type: String,
  },
  label: {
    type: String,
  },
  type: {
    type: String,
    default: "md",
  },
});
const myLable = computed(() => {
  if (props.label) return props.label;
  if (props.options && props.options.length > 0) {
    const item = props.options.find((item) => item.value === props.value);
    if (item) return item.label;
  }
  return "未知";
});
const myColor = computed(() => {
  if (props.label) return props.color;
  if (props.options && props.options.length > 0) {
    const item = props.options.find((item) => item.value === props.value);
    if (item) return item.color;
  }
  return "blue";
});
</script>

<style lang="scss" scoped>
.tag.md {
  width: 62px;
  height: 22px;
  border-radius: 4px;
  text-align: center;
  line-height: 22px;
  color: #fff;
}
.tag.sm {
  border-radius: 4px;
  text-align: center;
  line-height: 22px;
  color: #fff;
  padding: 0 4px;
}
</style>
