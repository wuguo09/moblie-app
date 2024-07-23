import type { ExtractPropTypes, PropType } from "vue";

export const treeItemSelectProps = {
  keyField: {
    type: [String, Function],
    default: "id",
  },
  labelField: {
    type: [String, Function],
    default: "label",
  },
  childrenField: {
    type: [String, Function],
    default: "children",
  },
  disabledField: {
    type: [String, Function],
  },
  /**是否支持多选 */
  multiple: {
    type: Boolean,
    default: false,
  },
};

export const treeSelectProps = {
  title: {
    type: String,
    default: "",
  },
  /**选项 */
  options: {
    type: Array as PropType<any[]>,
    default: () => [],
  },
  modelValue: {
    type: [String, Number, Array],
    default: "",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  /**是否可对name过滤 */
  filterable: {
    type: Boolean,
    default: false,
  },

  placeholder: {
    type: String,
    default: "请选择",
  },
  ...treeItemSelectProps,
};
export type TreeItemSelectProps = ExtractPropTypes<typeof treeItemSelectProps>;
export type TreeSelectProps = ExtractPropTypes<typeof treeSelectProps>;
