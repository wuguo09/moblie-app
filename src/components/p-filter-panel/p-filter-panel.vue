<template>
  <view class="filter-panel">
    <view class="row" v-for="row in schemas" :key="row.key">
      <view class="row-label">{{ row.label }}</view>
      <view class="col-list">
        <view
          :class="['col', isSelect(col.value, row) ? 'active' : '']"
          v-for="(col, i) in row.options"
          :key="i"
          @click="onClickTag(col.value, row)"
          >{{ col.label }}</view
        >
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import type { PropType } from "vue";
import type { IFilterPanelProps } from "./type";

const props = defineProps({
  schemas: {
    type: Array as PropType<IFilterPanelProps["schemas"]>,
    default: () => [],
  },
  modelValue: {
    type: Object as PropType<IFilterPanelProps["modelValue"]>,
    default: () => ({}),
  },
});

const emits = defineEmits(["onUpdate:modelValue", "onUpdate:formatValue"]);

const isSelect = (value: any, schema: IFilterPanelProps["schemas"][0]) => {
  if (!props.modelValue[schema["key"]]) return false;
  const val = props.modelValue[schema["key"]];
  if (schema.multiple) {
    return val.includes(value);
  }
  return val === value;
};

const onClickTag = (value: any, schema: IFilterPanelProps["schemas"][0]) => {
  let model = props.modelValue;
  if (schema.multiple) {
    const list = new Set(model[schema["key"]] || []);
    list.has(value) ? list.delete(value) : list.add(value);
    model[schema["key"]] = [...list];
  } else {
    model[schema["key"]] === value
      ? (model[schema["key"]] = undefined)
      : (model[schema["key"]] = value);
  }
  const data = schema.formatValue
    ? schema.formatValue(model[schema["key"]])
    : { [schema["key"]]: model[schema["key"]] };
  emits("onUpdate:formatValue", data);
  emits("onUpdate:modelValue", model);
};

defineExpose({});
</script>

<style scoped lang="scss">
.row {
  margin-top: 20px;
  .row-label {
    // margin-bottom: 10px;
    font-family: Source Han Sans CN;
    font-size: 16px;
    font-weight: 700;
    letter-spacing: 0em;
    color: rgba(0, 0, 0, 0.85);
  }
  .col-list {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    &::after {
      content: "";
      display: block;
      width: calc(33% - 5px);
    }
    .col {
      box-sizing: border-box;
      border: 0.5px solid rgba(0, 0, 0, 0.3);
      width: calc(33% - 5px);
      height: 32px;
      margin-top: 8px;
      border-radius: 16px;
      text-align: center;
      line-height: 32px;
      font-family: Source Han Sans CN;
      font-size: 14px;
      font-weight: normal;
      letter-spacing: 0px;
      color: rgba(0, 0, 0, 0.85);
      &.active {
        background: linear-gradient(
          0deg,
          rgba(0, 134, 115, 0.1) -18%,
          rgba(112, 168, 78, 0.1) 81%
        );
        border: 1px solid #70a84e;
      }
    }
  }
}
</style>
