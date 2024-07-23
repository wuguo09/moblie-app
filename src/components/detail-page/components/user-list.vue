<template>
  <div class="user-list">
    <!-- <div class="user-item" v-for="item in originalData" :key="item.id">
      <div class="imgs">
        <img :src="getImg(item)" />
      </div>
      <div class="info">
        <div class="name">{{ item.personName }}</div>
        <div class="text">{{ item.fkDeptCode }} {{ item.position }}</div>
      </div>
    </div> -->
  </div>
</template>

<script setup lang="ts">
// import { useRequestRefData } from "@/hooks/useRequest";
// import Utils from "@/utils";
import { computed, watch } from "vue";
const props = defineProps({
  codes: {
    type: String,
  },
  api: {
    type: Function,
  },
});
// const { originalData, getData } = useRequestRefData(async () => {
//   if (props.api && props.codes) {
//     return props.api(props.codes.split(","));
//   }
//   return [];
// });

// function getImg(data: any) {
//   if (data.photoUrl)
//     return data.photoUrl
//       .split(",")
//       .map((item: string) => Utils.getFileUrl(item))[0];
//   return Utils.getImageUrl("home/avatar-default.png");
// }

// watch(
//   () => props.codes,
//   () => {
//     getData();
//   }
// );
</script>

<style lang="scss" scoped>
.user-item {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 25px;
}

.imgs {
  width: 55px;
  height: 55px;
  border-radius: 4px;
  overflow: hidden;

  img {
    height: 100%;
    object-fit: cover;
  }
}

.name {
  font-size: 18px;
  line-height: 100%;
  letter-spacing: 0px;
  margin-bottom: 8px;
  color: rgba(0, 0, 0, 0.85);
}
.text {
  font-size: 14px;
  letter-spacing: 0em;
  color: rgba(0, 0, 0, 0.65);
}
</style>
