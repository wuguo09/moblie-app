<template>
  <view>
    <u-upload
      v-if="isShow"
      v-model:file-list="myFileList"
      :list-type="isImg ? 'image-card' : 'text'"
      v-bind="$attrs"
      :accept="getAcceptType()"
      :maxCount="count"
      @afterRead="Finish"
      @delete="remove"
      :previewFullImage="true"
    >
    </u-upload>
  </view>
</template>
<script lang="ts" setup>
import { nextTick, ref, watch, type PropType } from "vue";
import { getUploadFileType } from "./type";
import { cloneDeep, isArray } from "lodash";
import type { IFileType } from "./type";
import { useAppContext } from "mobile-app-test";
const props = defineProps({
  modelValue: {
    type: [Array, String],
    defalut: "",
  },
  fileName: {
    type: [Array, String],
    default: "",
  },
  fileList: {
    type: Array as PropType<any[]>,
    default: () => [],
  },
  url: {
    type: String,
  },
  isImg: {
    type: Boolean,
  },
  isVideo: {
    type: Boolean,
  },
  needAcceptType: {
    type: Boolean,
    default: true,
  },
  acceptType: {
    type: [Array, String] as PropType<IFileType[] | string>,
  },
  // 数量上限
  count: {
    type: Number,
  },
  // 如果超出上限，替换最后一张
  replaceLast: {
    type: Boolean,
    default: false,
  },
});
const appContext = useAppContext();
const uploadUrl = appContext.fileBaseUrl + appContext.fileUploadUri;
const fileBaseUrl = appContext.fileBaseUrl;
const emits = defineEmits([
  "update:modelValue",
  "update:uploadList",
  "update:fileName",
]);
const getName = (str: string) => (str ? str.split("/").pop() : "");
const getType = (str: string) => (str ? str.split(".").pop() : "");

const getAcceptType = () => {
  if (!props.needAcceptType) return undefined;
  if (props.acceptType) {
    if (typeof props.acceptType === "string") return props.acceptType;
    if (!props.acceptType.length) return undefined;
    return getUploadFileType(props.acceptType);
  }
  if (props.isImg && props.isVideo) return "media";
  if (props.isImg) return "image";
  return undefined;
};

const isShow = ref(true);
const myFileList = ref<any[]>([]);

let isChange = false;

const uploadFilePromise = (url: string) => {
  return new Promise((resolve, reject) => {
    uni.uploadFile({
      url: uploadUrl, // 仅为示例，非真实的接口地址
      filePath: url,
      name: "file",
      success: (res) => {
        console.log("res", res);
        const data = JSON.parse(res.data);
        resolve(data.data[0].uri);
      },
    });
  });
};

async function Finish(event: File) {
  console.log("Finish", event);
  // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
  let lists = [].concat(event.file);
  let fileListLen = myFileList.value.length;
  lists.map((item) => {
    myFileList.value.push({
      ...item,
      status: "uploading",
      message: "上传中",
    });
  });
  console.log("Finish", lists, myFileList.value);
  for (let i = 0; i < lists.length; i++) {
    isChange = true;
    try {
      const result = await uploadFilePromise(lists[i].url);
      console.log("result", result);
      let item = myFileList.value[fileListLen];
      myFileList.value.splice(fileListLen, 1, {
        ...item,
        status: "success",
        message: "",
        url: fileBaseUrl + result,
      });
      fileListLen++;
    } catch (e) {
      console.error("上传失败", e);
      //TODO handle the exception
      let item = myFileList.value[fileListLen];
      myFileList.value.splice(fileListLen, 1, {
        ...item,
        status: "error",
        message: "上传失败",
      });
      fileListLen++;
    }
  }
  // 如果设置了数量上限，且设置超出替换最后一张
  // if (props.count && myFileList.value.length >= props.count && props.replaceLast) {
  // 	myFileList.value.splice(myFileList.value.length - 1, 1, file);
  // }
  const val = myFileList.value
    ?.map((item) => item.url?.replace(fileBaseUrl, ""))
    ?.join(",");
  // 文件名
  let names: string | string[] = myFileList.value?.map(
    (item) => item.name || getName(item?.url?.replace(fileBaseUrl, "") || "")
  );
  // 外部如果传的字符串就返回字符串
  !isArray(props.fileName) && (names = names?.join(","));
  console.log("upload", myFileList.value, val, names);
  emits("update:modelValue", val);
  emits("update:uploadList", cloneDeep(myFileList.value));
  emits("update:fileName", names);
  console.log("upload", myFileList.value, val, "val", names);
}

function remove(event: any) {
  isChange = true;
  console.log("remove");
  myFileList.value.splice(event.index, 1);
  /**删除文件时，无 */
  const val = myFileList.value
    ?.map((item) => item.url?.replace(fileBaseUrl, ""))
    ?.join(",");
  // 文件名
  let names: string | string[] = myFileList.value?.map(
    (item) => item.name || getName(item?.url?.replace(fileBaseUrl, "") || "")
  );
  // 外部如果传的字符串就返回字符串
  !isArray(props.fileName) && (names = names.join(","));
  emits("update:modelValue", val);
  emits("update:uploadList", cloneDeep(myFileList.value));
  emits("update:fileName", names);
}

function initFileList() {
  if (isChange) {
    isChange = false;
    return;
  }
  console.log(props.modelValue);
  if (props.modelValue) {
    if (props.fileList && props.fileList.length) {
      myFileList.value = cloneDeep(props.fileList);
      return;
    }
    console.log("执行", props.modelValue);
    /**强制更新组件 */
    isShow.value = false;
    const arr: string[] = isArray(props.modelValue)
      ? (props.modelValue as string[])
      : props.modelValue.split(",");
    const nameArr: string[] = props.fileName
      ? isArray(props.fileName)
        ? (props.fileName as string[])
        : props.fileName.split(",")
      : [];
    myFileList.value = arr?.map((str, index) => ({
      id: index + "",
      name: props.fileName ? nameArr[index] : getName(str),
      status: "success",
      url: fileBaseUrl + str,
    }));
    /**强制更新组件 */
    nextTick(() => (isShow.value = true));
  }
}

watch(
  () => props.modelValue,
  () => {
    initFileList();
  },
  {
    immediate: true,
  }
);
defineExpose({
  myFileList,
});
</script>
<style lang="scss" scoped>
.video {
  width: 100%;
  object-fit: cover;
}

.video-box {
  cursor: pointer;

  video {
    object-fit: cover;
    width: 100%;
  }
}
</style>
