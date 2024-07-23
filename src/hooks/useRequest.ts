import { message } from "mobile-app-test";
import { ref } from "vue";

async function useRequest<T>(
  fn: () => Promise<T>,
  errorMsg?: string,
  errorCallback?: any
) {
  try {
    return await fn();
  } catch (error) {
    if (errorMsg) {
      message.toast(errorMsg, "err");
    }
    console.error(error);
  }
}

export function useRequestRefData<T>(
  fn: () => Promise<T>,
  errorMsg?: string,
  errorCallback?: any,
  callback?: any
) {
  const originalData = ref<T>();
  const getData = async () => {
    const res = await useRequest(fn, errorMsg, errorCallback);
    if (res) {
      originalData.value = res;
      callback && callback(res);
    }
  };

  getData();

  return {
    originalData,
    getData,
  };
}

export default useRequest;
