<template>
  <section class="card" @click="handle(data)">
    <div class="card-header">
      <div class="title">
        <span
          v-if="props.columns.titleIcon"
          class="icon"
          :style="{ color: getStatusKey(data).color }"
          :class="[props.columns.titleIcon]"
        ></span>
        <span class="name">{{ getTextByKey(data, columns.titleKey) }}</span>
      </div>
      <div class="status" :style="{ background: getStatusKey(data).color }">
        {{ getStatusKey(data).text }}
      </div>
    </div>
    <div class="c-content">
      <div v-if="columns.imgKey" class="img-box">
        <image :src="getImg(columns.imgKey)" class="img"></image>
      </div>
      <div class="card-content">
        <div v-for="(item, i) in columns.list" :key="i" class="content-item">
          <template v-if="item.tagOption">
            <view class="tag-content">
              <text> {{ item.label }}：</text>
              <Tag
                type="sm"
                :options="item.tagOption"
                :value="getTextByKey(data, item.key)"
              />
            </view>
          </template>
          <template v-else>
            {{ item.label }}：{{ getTextByKey(data, item.key) }}
          </template>
        </div>
      </div>
    </div>
  </section>
</template>
<script lang="ts" setup>
import Utils from "@/utils";
import type { PropType } from "vue";
import type { GETKEY, ICardListProps } from "./interface";
import Tag from "../detail-page/components/tag.vue";

const props = defineProps({
  columns: {
    type: Object as PropType<ICardListProps["columns"]>,
    default: () => ({}),
  },
  data: {
    type: Array as PropType<ICardListProps["datas"]>,
    default: () => ({}),
  },
});
const emits = defineEmits(["handle"]);
const handle = (data: any) => {
  emits("handle", data);
};
const getStatusKey = (data: any) => {
  const status = props.columns.statusConfigs?.filter(
    (item) => item.value === data[props.columns.statusKey]
  );
  if (status?.length > 0) {
    return {
      color: status[0].color,
      text: status[0].text,
    };
  }
  return {
    color: "#fff",
    text: "未知",
  };
};
const getTextByKey = (data: any, key: GETKEY) => {
  if (typeof key === "string") {
    return data[key] || data[key] === 0 ? data[key] : "无";
  }
  return key && key(data);
};
const getImg = (key: string) => {
  const imgStr = props.data[key];
  if (imgStr) {
    const arr = imgStr.split(",").filter((item: string) => {
      if (/\.(jpg|jpeg|png|gif)$/i.test(item.toLocaleLowerCase())) return true;
      return false;
    });
    if (arr[0]) return Utils.getFileUrl(arr[0]);
  }
  return Utils.getImageUrl("task/task-default.png");
};
</script>
<style lang="scss" scoped>
.card {
  width: 100%;
  background: #ffffff;
  border-radius: 12px;
  text-align: left;
  padding: 14px;
  font-size: 14px;
  line-height: 21px;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 30px;
  padding: 8px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.title {
  font-size: 16px;
  color: rgba(0, 0, 0, 0.85);
  font-weight: 400;
  line-height: 24px;
  display: flex;
  align-items: center;
  gap: 8px;
  max-width: 70%;
  white-space: nowrap;

  .name {
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.c-content {
  display: flex;
  margin-top: 8px;
  gap: 12px;
}

.img-box {
  width: 90px;
  height: 90px;
  border-radius: 8px;
  overflow: hidden;

  .img {
    width: 100%;
    height: 100%;
  }
}

.card-content {
  color: rgba(0, 0, 0, 0.65);
}

.status {
  z-index: 1;
  position: relative;
  white-space: nowrap;
  width: 62px;
  height: 22px;
  border-radius: 4px;
  color: #ffffff;
  text-align: center;
}

.content-item {
  width: 100%;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.tag-content {
  display: flex;
  align-items: center;
}
</style>
