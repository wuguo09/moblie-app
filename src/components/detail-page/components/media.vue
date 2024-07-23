<template>
  <view>
    <div class="space" v-if="value">
      <template v-for="(img, index) in getImgArr(value)">
        <image
          class="media"
          :key="index"
          v-if="/\.(jpg|jpeg|png|gif)$/i.test(img.url)"
          :style="{ 'max-width': '100px' }"
          :src="img.url"
          @click.stop="showMedia('img', img)"
        />
        <div
          v-if="/\.(|mp4|webm|ogg|MOV|mov)$/i.test(img.url)"
          :style="{ 'max-width': '100px' }"
          class="video-box media"
          @click.stop="showMedia('video', img)"
        >
          <div class="param-icon-bns_play-Circle icon"></div>
          查看视频
        </div>
      </template>
    </div>
    <span v-else>--</span>
    <u-popup
      :show="modelState.show"
      mode="center"
      :round="10"
      closeable
      :title="modelState.title"
      @close="modelState.show = false"
      style="width: 100%"
    >
      <div class="media-box">
        <image
          v-if="modelState.type === 'img'"
          class="img"
          :src="modelState.url"
        />
        <video
          v-if="modelState.type === 'video'"
          class="video"
          :src="modelState.url"
          controls
          muted
          autoplay
        ></video>
      </div>
    </u-popup>
  </view>
</template>

<script setup lang="ts">
import { isArray } from "lodash";
import { reactive } from "vue";

interface Item {
  name: string;
  url: string;
}

defineProps({
  value: {
    type: String,
    default: "",
  },
});
const modelState = reactive({
  show: false,
  type: "",
  url: "",
  title: "",
});

function showMedia(type: "img" | "video", item: Item) {
  if (item.url) {
    modelState.show = true;
    modelState.type = type;
    modelState.url = item.url;
    modelState.title = item.name || "";
  }
}

const getName = (str: string) => (str ? str.split("/").pop() : "");
const getType = (str: string) => (str ? str.split(".").pop() : "");

function getImgArr(val: string | Array<string>): Item[] {
  if (!val) return [];
  const arr: string[] = isArray(val)
    ? (val as string[])
    : (val as string).split(",");
  return arr.map((str, index) => {
    if (typeof str === "object") {
      const _str: Record<string, any> = str;
      return {
        name: _str?.name || "",
        url: _str?.url ? (/^http/.test(_str?.url) ? _str?.url : _str?.url) : "",
      };
    } else {
      return {
        name: getName(str),
        url: str,
      };
    }
  });
}
</script>

<style lang="scss" scoped>
.space {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 5px;
}

.media {
  width: 80px;
  height: 80px;
  border-radius: 8px;

  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.media-box {
  width: 100vw;
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;

  .img,
  .video {
    max-width: 100%;
    object-fit: cover;
  }
}

.video-box {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-color: #000;
  color: #fff;
  .icon {
    font-size: 18px;
  }
}
</style>
