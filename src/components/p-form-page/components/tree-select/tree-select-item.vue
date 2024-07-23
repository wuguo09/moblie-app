<template>
  <article class="tree-select-item">
    <div class="select-item">
      <template v-if="multiple">
        <div class="select" @click="!isDisabled && changeSelect(data)">
          <template v-if="!isDisabled">
            <span
              v-if="selectsKeys.includes(renderField(data, keyField))"
              class="checkbox-ok param-icon-sys_check-square-fill"
            ></span>
            <span class="checkbox-no" v-else></span>
          </template>

          <div class="label">{{ renderField(data, labelField) }}</div>
        </div>
      </template>
      <template v-else>
        <div class="select" @click="!isDisabled && changeSelect(data)">
          <template v-if="!isDisabled">
            <span
              v-if="selectsKeys.includes(renderField(data, keyField))"
              class="radio-ok param-icon-sys_check-circle-fill"
            ></span>
            <span class="radio-no" v-else></span>
          </template>
          <div class="label">{{ renderField(data, labelField) }}</div>
        </div>
      </template>
      <div
        v-if="isChildren(childrenField)"
        @click="handleExpand()"
        :class="[
          'icon',
          expand ? 'param-icon-sys_Down2' : 'param-icon-sys_Right2',
        ]"
      ></div>
    </div>
    <div
      class="children"
      v-if="isChildren(childrenField)"
      :class="[expand ? 'expand' : 'hiddren']"
    >
      <treeSelectItem
        v-for="(child, i) in renderField(data, childrenField)"
        :key="i"
        v-bind="props"
        :data="child"
      ></treeSelectItem>
    </div>
  </article>
</template>
<script lang="ts" setup>
import { computed, inject, provide, ref } from "vue";
import { treeItemSelectProps } from "./interface";
import { isFunction } from "lodash";
import treeSelectItem from "./tree-select-item.vue";
import { renderField, treeSelectKey } from "./event";
const props = defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
  ...treeItemSelectProps,
});
const { changeSelect, selectsKeys, expandKeys } = inject(treeSelectKey);
const expand = computed(() => {
  const key = renderField(props.data, props.keyField);
  return expandKeys.value.includes(key);
});
const isDisabled = computed(() => {
  if (props.disabledField) return renderField(props.data, props.disabledField);
  return false;
});
function handleExpand() {
  const key = renderField(props.data, props.keyField);
  /**存在就去掉 */
  if (expandKeys.value.includes(key)) {
    expandKeys.value = expandKeys.value.filter((item: string) => key !== item);
  } else {
    expandKeys.value.push(key);
  }
}
const baseHeight = ref(35);
// const maxHeight = computed(() => {
//   const children = renderField(props.data,props.childrenField);
//   if (children && children.length > 0) return baseHeight.value*children.length+'px'
//   return 0
// });
const myHeight = computed(() => baseHeight.value + "px");
function isChildren(field: string | Function) {
  const children = isFunction(field)
    ? field(props.data)
    : props.data[field as string];
  if (children && children.length > 0) return true;
  return false;
}
</script>
<style lang="scss" scoped>
.tree-select-item {
  position: relative;
}
.select-item {
  height: v-bind(myHeight);

  display: flex;
  align-items: center;
  padding: 0 5px;
  justify-content: space-between;
  .icon {
    width: 50px;
    text-align: right;
  }
}
.children {
  padding-left: 20px;

  overflow: hidden;
  transition: 0.8s all ease;
  &.hiddren {
    max-height: 0;
    opacity: 0;
  }
  &.expand {
    max-height: 1000px;
    opacity: 1;
  }
}
.select {
  display: flex;
  align-items: center;
  gap: 5px;
  .checkbox-no,
  .radio-no {
    width: 18px;
    height: 18px;
    border: 1px solid rgb(200, 201, 204);
    display: inline-block;
  }
  .radio-no {
    border-radius: 50%;
  }

  .checkbox-ok,
  .radio-ok {
    font-size: 19px;
    color: rgb(41, 121, 255);
  }

  .label {
    color: rgb(96, 98, 102);
    font-size: 15px;
    line-height: 15px;
  }
}
</style>
