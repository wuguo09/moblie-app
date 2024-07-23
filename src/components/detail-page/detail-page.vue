<template>
  <article class="detail-page">
    <view v-for="(column, index) in columns" :key="index" class="info-card">
      <template v-if="column.title">
        <view class="title">
          <span class="bo"></span>
          {{ column.title }}
        </view>
        <u-line class="line"></u-line>
      </template>
      <view v-if="!column.slot" class="detail-content">
        <view
          v-for="item in column.columns"
          :key="item.field"
          class="info-item"
          :class="[item.field]"
        >
          <template v-if="!item.isShow || (item.isShow && item.isShow(data))">
            <span v-if="item.label" class="label">{{ item.label }}:</span>
            <slot :name="item.slot || 'item'" :data="data" :field="item.field">
              <template v-if="item.type === 'text'">
                <span class="text"
                  >{{
                    item.map
                      ? item.map[data[item.field]] || "-"
                      : data[item.field] || "-"
                  }}<span v-if="item.componentProps?.unit">{{
                    item.componentProps.unit
                  }}</span></span
                >
              </template>
              <template v-if="item.type === 'tag'">
                <Tag
                  :value="item.defineValue || data[item.field]"
                  v-bind="item.componentProps"
                ></Tag>
              </template>
              <template v-if="item.type === 'phone'">
                <Phone
                  :code="data[item.field]"
                  v-bind="item.componentProps"
                ></Phone>
              </template>
              <template v-if="item.type === 'userList'">
                <UserList
                  :codes="data[item.field]"
                  v-bind="item.componentProps"
                ></UserList>
              </template>
              <template v-if="item.type === 'table'">
                <Table
                  :data="data[item.field]"
                  v-bind="item.componentProps"
                ></Table>
              </template>
              <template v-if="item.type === 'link'">
                <span
                  :class="{ link: data[item.field] }"
                  @click="
                    data[item.field]
                      ? emits('link', item.field, data)
                      : undefined
                  "
                  >{{
                    item.map
                      ? item.map[data[item.field]] || "-"
                      : data[item.field] || "-"
                  }}</span
                >
              </template>
              <template v-if="item.type === 'html'">
                <div class="h" v-html="data[item.field]"></div>
              </template>
              <template v-if="item.type === 'media'">
                <Media
                  :value="data[item.field]"
                  v-bind="item.componentProps"
                ></Media>
              </template>
            </slot>
          </template>
        </view>
      </view>
      <slot v-else :name="column.slot"></slot>
    </view>
  </article>
</template>
<script lang="ts" setup>
import { detailPageProps } from "./interface";
import Tag from "./components/tag.vue";
import Phone from "./components/phone.vue";
import UserList from "./components/user-list.vue";
import Table from "./components/table.vue";
import Media from "./components/media.vue";
import { watch } from "vue";
const props = defineProps(detailPageProps);
const emits = defineEmits(["link"]);
</script>
<style lang="scss" scoped>
view {
  box-sizing: border-box;
}

.title {
  font-size: 16px;
  font-weight: normal;
  line-height: 20px;
  text-align: center;
  letter-spacing: 0px;
  text-align: left;
  color: #000000;

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

.detail-page {
  width: 100%;
  text-align: left;
  font-weight: 400;
  font-size: 15px;
  line-height: 24px;
  color: rgba(0, 0, 0, 0.85);
}

.info-item {
  display: flex;
  margin-top: 16px;
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

.label {
  display: block;
  width: 100px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow-x: hidden;
  font-size: 14px;
  font-weight: normal;
  letter-spacing: 0px;
  color: rgba(0, 0, 0, 0.65);
  margin-right: 8px;
}

.info-card {
  background: #ffffff;
  box-sizing: border-box;
  // border: 1px solid rgba(0, 0, 0, 0.05);
  padding: 16px;
  position: relative;
  margin-bottom: 8px;
}

.link {
  color: #018c83;
  border-bottom: 1px solid #018c83;
}
</style>
