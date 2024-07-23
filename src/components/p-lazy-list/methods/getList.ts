import { computed, nextTick, onMounted, reactive, ref } from "vue";
import type { LazyListProps } from "../interface";
import { onShow } from "@dcloudio/uni-app";

export default function (props: LazyListProps) {
  const pageParams = reactive({
    [props.pageKeys["page"]]: props.defaultPage,
    [props.pageKeys["pagesize"]]: props.defaultPageSize,
  });
  const total = ref(0);
  /**
   *
   * @param refresh 是否刷新
   */
  const getDataList = async (refresh?: boolean) => {
    try {
      const params = Object.assign({}, pageParams, props.queryParams || {});
      const newParams = props.filterQueryParams
        ? props.filterQueryParams(params)
        : params;
      const res = await props.listApi(newParams);
      total.value = res[props.responseKeys.totalkey];
      const data = props.formatData
        ? props.formatData(res)
        : res[props.responseKeys.datakey];
      if (refresh) {
        dataList.value = data.map((item) => ({
          ...item,
          _dictMapping: res["dictMapping"],
        }));
      } else {
        dataList.value.push(
          ...data.map((item) => ({
            ...item,
            _dictMapping: res["dictMapping"],
          }))
        );
      }
    } catch (error) {
      console.error(error);
    }
  };
  const dataList = ref<any>([]);
  const reset = () => {
    pageParams[props.pageKeys["page"]] = 1;
    dataList.value = [];
    getDataList(true);
  };
  const search = () => {
    reset();
  };
  const clear = () => {
    nextTick(() => {
      reset();
    });
  };
  const finished = computed(() => dataList.value.length >= total.value);
  const lazyLoad = () => {
    if (dataList.value.length >= total.value) return;
    pageParams[props.pageKeys["page"]]++;
    getDataList();
  };
  onMounted(() => {
    reset();
  });
  onShow(() => {
    reset()
  })
  return {
    pageParams,
    reset,
    dataList,
    lazyLoad,
    finished,
    clear,
    search,
  };
}
