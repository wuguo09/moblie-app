<template>
  <div class="phone-box">
    <!-- <span class="name">{{
      originalData ? originalData[nameKey] : "未知"
    }}</span>
    <span
      v-if="originalData && originalData[phoneKey]"
      class="phone"
      @click="tel"
    >
      <span class="param-icon-phone-fill"></span>
    </span> -->
  </div>
</template>

<script setup lang="ts">
// import { useRequestRefData } from "@/hooks/useRequest";
import { watch } from "vue";

//window.location.href = 'tel:4000-000-000';
const props = defineProps({
  code: {
    type: String,
  },
  api: {
    type: Function,
  },
  nameKey: {
    type: String,
    default: "personName",
  },
  phoneKey: {
    type: String,
    default: "phone",
  },
});
// const { originalData, getData } = useRequestRefData(async () => {
//   if (props.api && props.code) {
//     return props.api(props.code);
//   }
//   return null;
// });

// watch(
//   () => props.code,
//   () => {
//     getData();
//   }
// );

// function tel() {
//   window.location.href = "tel:" + originalData.value[props.phoneKey];
// }
</script>

<style lang="scss" scoped>
.phone-box {
  display: flex;
  align-items: center;
  gap: 15px;
}
.phone {
  display: inline-block;
  width: 20px;
  height: 20px;
  border-radius: 102px;
  opacity: 1;
  background: linear-gradient(270deg, #008673 0%, #8ad37d 99%);
  box-shadow: 2px 2px 10px 0px rgba(0, 134, 115, 0.15);
  color: #fff;
  text-align: center;
  line-height: 20px;
  font-size: 14px;
}
</style>
