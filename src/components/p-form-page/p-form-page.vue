<template>
  <article class="form-page">
    <u-form
      :labelWidth="labelWidth"
      v-bind="$attrs"
      :model="formData"
      :rules="rules"
      labelPosition="left"
      ref="formElRef"
    >
      <template v-for="(column, index) in schemas" :key="index">
        <slot v-if="column.slot" :name="column.slot"></slot>
        <view class="info-card" v-else>
          <view v-if="column.title" class="title">
            <span class="bo"></span>
            {{ column.title }}
          </view>
          <!--  <u-line class="line"></u-line> -->
          <view class="content">
            <view
              v-for="item in column.schemas"
              :key="item.field"
              class="info-item"
              :class="[item.field]"
              :style="{ width: item.span ? 100 / item.span + '%' : '100%' }"
            >
              <template
                v-if="!item.isShow || (item.isShow && item.isShow(formData))"
              >
                <view class="item-wrap">
                  <u-form-item
                    :label="item.label"
                    :prop="item.field"
                    borderBottom
                    :required="checkRequired(item.field)"
                    v-bind="item.formItemProps"
                  >
                    <slot
                      v-if="item.slot"
                      :name="item.slot"
                      :model="formData"
                      :field="item.field"
                      :schema="item"
                    >
                    </slot>
                    <template v-else>
                      <template v-if="item.readonly">
                        <span>{{ formData[item.field] }}</span>
                      </template>
                      <template v-else>
                        <template v-if="item.component === 'Input'">
                          <u-input
                            v-model="formData[item.field]"
                            placeholder="请输入"
                            v-bind="item.componentProps"
                            border="none"
                          >
                          </u-input>
                        </template>
                        <template v-if="item.component === 'NumberBox'">
                          <u-number-box
                            v-model="formData[item.field]"
                            v-bind="item.componentProps"
                          ></u-number-box>
                        </template>
                        <template v-if="item.component === 'RadioGroup'">
                          <u-radio-group
                            v-model="formData[item.field]"
                            placement="column"
                            v-bind="item.componentProps"
                          >
                            <u-radio
                              class="radio"
                              v-for="(r, index) in item.componentProps
                                ? item.componentProps.options || []
                                : []"
                              :key="index"
                              :label="r.label"
                              :name="r.value"
                            >
                            </u-radio>
                          </u-radio-group>
                        </template>
                        <template v-if="item.component === 'Textarea'">
                          <u-textarea
                            v-model="formData[item.field]"
                            placeholder="请输入"
                            v-bind="item.componentProps"
                          ></u-textarea>
                        </template>
                        <template v-if="item.component === 'Upload'">
                          <MyUpload
                            v-model="formData[item.field]"
                            v-bind="item.componentProps"
                          >
                          </MyUpload>
                        </template>
                        <template v-if="item.component === 'Select'">
                          <Select
                            v-if="item.moreField"
                            v-model="formData[item.field]"
                            v-model:label="formData[item.moreField]"
                            v-bind="item.componentProps"
                          >
                          </Select>
                          <Select
                            v-else
                            v-model="formData[item.field]"
                            v-bind="item.componentProps"
                          ></Select>
                        </template>
                        <template v-if="item.component === 'Datetime'">
                          <Datetime
                            v-model="formData[item.field]"
                            v-bind="item.componentProps"
                          >
                          </Datetime>
                        </template>
                        <template v-if="item.component === 'TreeSelect'">
                          <TreeSelect
                            v-model="formData[item.field]"
                            v-bind="item.componentProps"
                          >
                          </TreeSelect>
                        </template>
                        <template v-if="item.component === 'AddressMap'">
                          <AddressMap
                            v-model="formData[item.moreField]"
                            v-model:address="formData[item.field]"
                            v-bind="item.componentProps"
                          >
                          </AddressMap>
                        </template>
                      </template>
                    </template>
                  </u-form-item>
                </view>
                <text class="suffix" v-if="item.suffix">{{ item.suffix }}</text>
              </template>
            </view>
          </view>
        </view>
      </template>
    </u-form>
  </article>
</template>
<script lang="ts" setup>
import { provide, ref, toRaw, unref, watch, onMounted } from "vue";
import { formPageProps } from "./interface";
import MyUpload from "../p-my-upload/p-my-upload.vue";
import Select from "./components/select.vue";
import TreeSelect from "./components/tree-select/tree-select.vue";
import Datetime from "./components/datetime.vue";
import AddressMap from "./components/address-map.vue";
import { isNil } from "lodash";
const props = defineProps(formPageProps);
const formElRef = ref();
const formData = ref<Record<string, any>>({});
//获取子组件的校验方法
const clearValidateSet = new Set();
function setClearValidate(fn: any) {
  clearValidateSet.add(fn);
  return () => clearValidateSet.delete(fn);
}
const validateSet = new Set();
function setValidate(fn: any) {
  validateSet.add(fn);
  return () => validateSet.delete(fn);
}

function checkRequired(path: string) {
  if (props.rules[path]) {
    const r = props.rules[path];
    const f = r.filter((item) => {
      if (item["required"]) return true;
      return false;
    });
    if (f.length > 0) return true;
  }
  return false;
}

provide("setFormDeps", {
  setValidate,
  setClearValidate,
});
function initFromData() {
  for (let i = 0; i < props.schemas.length; i++) {
    const schemas = props.schemas[i].schemas;
    for (let j = 0; j < schemas.length; j++) {
      const item = schemas[j];
      item.moreField ? (formData.value[item.moreField] = "") : null;
      formData.value[item.field] = isNil(item.defaultValue)
        ? ""
        : item.defaultValue;
    }
  }
}
function setFieldsValue(val: any, all: boolean = false) {
  if (all) {
    formData.value = val;
  } else {
    for (const k in val) {
      formData.value[k] = val[k];
    }
  }
}
function getFieldsValue() {
  return toRaw(unref(formData));
}
async function validate() {
  console.log(formData);
  if (formElRef.value) {
    const res = await formElRef.value.validate();
    console.log(res);
  }
  const all: any[] = [];

  validateSet.forEach((fn) => all.push(fn()));
  const res = await Promise.all(all);
  return toRaw(unref(formData));
}
function clearValidate() {
  console.log(formElRef.value);
  if (formElRef.value) {
    formElRef.value.clearValidate();
  }
  clearValidateSet.forEach((fn) => fn && fn());
}
const WatchFormModelSet = new Set();
function setWatchFormModelFn(fn: any) {
  WatchFormModelSet.add(fn);
}
watch(
  formData.value,
  () => {
    WatchFormModelSet.forEach((fn) => fn(formData.value));
  },
  {
    deep: true,
  }
);

onMounted(() => {
  formElRef.value?.setRules(props.rules);
});

initFromData();
defineExpose({
  getFieldsValue,
  setFieldsValue,
  resetFields: initFromData,
  validate,
  clearValidate,
  setWatchFormModelFn,
});
</script>
<style lang="scss" scoped>
view {
  box-sizing: border-box;
}
.info-item {
  display: flex;
  align-items: center;
  .item-wrap {
    flex: 1;
  }
}

.title {
  font-size: 16px;
  font-weight: bold;
  line-height: 20px;
  text-align: center;
  letter-spacing: 0px;
  text-align: left;
  color: #303133;

  margin-bottom: 12px;

  .bo {
    position: absolute;
    left: 0px;
    top: 18px;
    width: 4px;
    height: 16px;
    opacity: 1;

    background: #018c83;
  }
}

.form-page {
  width: 100%;
  text-align: left;
  font-weight: 400;
  font-size: 15px;
  line-height: 24px;
  color: rgba(0, 0, 0, 0.85);
}
.u-form-item {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding-left: 10px;
  :deep(.u-form-item__body__left__content__required) {
    left: -12px;
  }
}

.line {
  padding: 0 16px;
}

.text {
  font-family: 思源黑体 CN;
  font-size: 16px;
  font-weight: normal;
  line-height: 24px;
  text-align: justify;
  /* 浏览器可能不支持 */
  letter-spacing: 0px;
  flex: 1;
}

.info-card {
  background: #ffffff;
  box-sizing: border-box;
  padding: 16px;
  position: relative;
  margin-bottom: 8px;
  border-radius: 12px;
}
.content {
  display: flex;
  flex-wrap: wrap;
}

.radio {
  margin-bottom: 5px;
  height: 20px;

  &:last-child {
    margin-bottom: 0px;
  }
}
.suffix {
  padding: 0 10px 0 0;
}
</style>
