<template>
  <article class="tree-select">
    <div
      v-if="refresh"
      :disabled="disabled"
      :class="{ disabled: disabled }"
      class="select-input"
      @click="show"
    >
      <div class="text" :class="{ placeholder: !isVal }">
        {{ currentText }}
      </div>
      <div class="icon param-icon-sys_Down"></div>
    </div>
    <u-popup
      :show="showPicker"
      safeAreaInsetBottom
      :round="10"
      @close="showPicker = false"
      @open="open"
      closeable
    >
      <div class="content">
        <div class="title">{{ title }}</div>
        <!--  <div class="filters">
          <u--input
            placeholder="请输入内容"
            border="surround"
            v-model="searchVal"
            clearable
          ></u--input>
        </div> -->
        <div class="select">已选择：{{ selectText }}</div>
        <div class="tree">
          <treeSelectItem
            v-for="(item, index) in myOptions"
            :key="index"
            :data="item"
            v-bind="props"
          ></treeSelectItem>
        </div>
        <div class="btns">
          <div class="cancel" @click="onCancel">清空</div>
          <div class="confirm" @click="onConfirm">确认</div>
        </div>
      </div>
    </u-popup>
  </article>
</template>
<script lang="ts" setup>
import { computed, ref, toRaw, nextTick, inject, provide } from "vue";
import { treeSelectProps } from "./interface";
import treeSelectItem from "./tree-select-item.vue";
import { filterTree, renderField, searchTree, treeSelectKey } from "./event";
const props = defineProps(treeSelectProps);
console.log("props", props);
const emits = defineEmits(["update:modelValue", "change"]);
const refresh = ref(true);
const showPicker = ref(false);
const searchVal = ref("");
const expandKeys = ref<string[]>([]);
function show() {
  if (props.disabled) return;
  showPicker.value = true;
}
function open() {
  if (props.modelValue && props.options) {
    const arr = props.multiple ? props.modelValue : [props.modelValue];
    selects.value = searchTree(
      props.options,
      props.keyField,
      props.childrenField,
      arr
    );
  }
}
const selects = ref([]);
const selectsKeys = computed(() => {
  return selects.value.map((item) => renderField(item, props.keyField));
});
const selectText = computed(() => {
  const texts = selects.value.map((item) =>
    renderField(item, props.labelField)
  );
  const text = texts.join(",");
  return text;
});
const myOptions = computed(() => {
  return filterTree(
    props.options,
    props.labelField,
    props.childrenField,
    searchVal.value
  );
});
function changeSelect(data: any) {
  if (props.multiple) {
    const isExist = selects.value.findIndex(
      (item) =>
        renderField(item, props.keyField) === renderField(data, props.keyField)
    );
    /**存在就取消选择 */
    if (isExist > 0) {
      /**不存在就加入 */
      selects.value.slice(isExist, 1);
    } else {
      selects.value.push(data);
    }
  } else {
    selects.value = [];
    selects.value.push(data);
  }
  console.log(selects.value);
}

provide(treeSelectKey, {
  changeSelect,
  selectsKeys,
  expandKeys,
});

const onConfirm = () => {
  const keys = props.multiple ? selectsKeys.value : selectsKeys.value[0];
  emits("update:modelValue", keys);
  emits("change", keys);
  showPicker.value = false;
  refresh.value = false;
  nextTick(() => {
    refresh.value = true;
  });
};

const onCancel = () => {
  emits("update:modelValue", null);
  selects.value = [];
  showPicker.value = false;
};
/**默认为每一层树的第一层子级组成的数组，如[[1,2],[1-1,1-2,1-3],[1-1-1,1-1-2,1-1-3]...] */

const isVal = computed(() => {
  if (
    props.modelValue !== undefined &&
    props.modelValue !== null &&
    props.options
  ) {
    if (props.modelValue === "") return false;
    return true;
  }
  return false;
});
const currentText = computed(() => {
  if (isVal.value) {
    return selectText.value;
  }
  return props.placeholder;
});
</script>
<style lang="scss" scoped>
.tree-select {
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
.select {
  margin: 5px;
  max-height: 3em;
  overflow: auto;
}
.content {
  height: 80vh;
  padding: 10px;
  color: rgb(0, 0, 0);
  .title {
    height: 20px;
    margin-bottom: 5px;
  }
  .filters {
    padding: 0 0px;
  }
  .tree {
    height: 70%;
    overflow: auto;
    padding-bottom: 15px;
  }
  .btns {
    font-size: 15px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    margin-top: 15px;
  }
  .cancel,
  .confirm {
    width: 108px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    margin-top: 10px;
    border-radius: 15px;
  }
  .confirm {
    color: white;
    background-color: rgb(1, 140, 131);
    border-color: rgb(1, 140, 131);
    border-width: 1px;
    border-style: solid;
  }
  .cancel {
    color: rgb(1, 140, 131);
    background-color: rgb(247, 247, 247);
    border-color: rgb(247, 247, 247);
    border-width: 1px;
    border-style: solid;
  }
}

.headers {
  display: flex;
}
</style>
