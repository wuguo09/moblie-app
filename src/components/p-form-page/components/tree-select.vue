<template>
  <article class="from-select">
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
    <u-picker
      v-if="columns?.length"
      :columns="myColumns"
      :keyName="keyName"
      v-bind="$attrs"
      :show="showPicker"
      class="picker"
      cancel-button-text="清空"
      @confirm="onConfirm"
      @cancel="onCancel"
      @change="changeHandler"
    >
    </u-picker>
  </article>
</template>
<script lang="ts" setup>
import { proxyRefs } from "vue";
import { unref } from "vue";
import { computed, nextTick, ref, toRaw } from "vue";
const props = defineProps({
  modelValue: {
    type: [Number, String],
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
  childrenName: {
    type: String,
    default: "children",
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
const emits = defineEmits(["update:modelValue", "change"]);
const refresh = ref(true);
const showPicker = ref(false);
console.log("props", props);
function show() {
  if (props.disabled) return;
  showPicker.value = true;
}
const onConfirm = (data: { indexs: number[]; value: any[]; values: any[] }) => {
  console.log("data", data);
  const currentData = data.value[data.indexs.length - 1];
  console.log("data", currentData);
  emits("update:modelValue", currentData[props.valueName]);
  emits("change", toRaw(currentData));
  showPicker.value = false;
  refresh.value = false;
  nextTick(() => {
    refresh.value = true;
  });
};

const onCancel = () => {
  emits("update:modelValue", null);
  showPicker.value = false;
};
/**默认为每一层树的第一层子级组成的数组，如[[1,2],[1-1,1-2,1-3],[1-1-1,1-1-2,1-1-3]...] */
const myColumns = computed(() => {
  const r = recursionColumns(props.columns);
  console.log(r);
  return r;
});

function recursionColumns(columns?: Array<any> | null) {
  let result: any[] = [];
  if (columns && columns?.length > 0) {
    result.push(proxyRefs(columns));
    const child = columns[0][props.childrenName];
    if (child) {
      result = result.concat(recursionColumns(child));
    }
  }
  return result;
}

/**寻找某一层树的子级 */
function getTreeByIndex(columnIndex: number, index: number) {
  const resultObj = { value: [] };
  recursionTreeByIndex(props.columns, columnIndex, index, resultObj);
  return resultObj.value;
}

function recursionTreeByIndex(
  columns: Array<any> | null,
  columnIndex: number,
  index: number,
  resultObj: { value: [] }
) {
  if (columns && columns?.length > 0) {
    if (columnIndex === 0) {
      resultObj.value = columns[index][props.childrenName] || [];
      return;
    }
    const child = columns[index][props.childrenName];
    if (child) {
      recursionTreeByIndex(child, --columnIndex, index, resultObj);
    }
  }
  return []
}

const recursion = (treeList: any, obj: { value: string }) => {
  if (treeList?.length) {
    treeList.forEach((item) => {
      if (item[props.valueName] === props.modelValue) {
        obj.value = item[props.keyName];
      }
      if (item[props.childrenName]) {
        recursion(item[props.childrenName], obj);
      }
    });
  }
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
const currentText = computed(() => {
  if (isVal.value) {
    const obj = { value: "" };
    let result = recursion(props.columns, obj);
    if (obj.value) return obj.value;
  }
  return props.placeholder;
});
const changeHandler = (e) => {
  const { columnIndex, picker, value, index } = e;

  if (columnIndex < value.length - 1) {
    picker.setColumnValues(columnIndex + 1, getTreeByIndex(columnIndex, index));
  }
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
</style>
