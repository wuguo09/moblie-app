import type { PropType } from "vue";
import type { IQueryFormProps } from "../query-form/interface";

/**card */
// listColumns: any
export interface LazyListProps {
  noDataText: string;
  listApi: any;
  queryParams?: any;
  defaultPage: number;
  defaultPageSize: number;
  filterQueryParam?: (params: any) => any;
  responseKeys: {
    datakey: string;
    totalkey: string;
  };
  pageKeys: {
    page: string;
    pagesize: string;
  };
  formatData?: (res: any) => any[];
}
export interface LazyQueryListProps extends LazyListProps {
  queryConfig: IQueryFormProps;
  /**请求前对参数进行处理 */
}

export const lazyListProps = {
  noDataText: {
    type: String,
    default: "暂无数据",
  },
  listApi: {
    type: Function as PropType<LazyListProps["listApi"]>,
    require: true,
  },
  queryParams: {
    type: Object,
  },
  defaultPage: {
    type: Number,
    default: 1,
  },
  defaultPageSize: {
    type: Number,
    default: 10,
  },
  filterQueryParams: {
    type: Function as PropType<LazyListProps["filterQueryParam"]>,
  },
  responseKeys: {
    type: Object as PropType<LazyListProps["responseKeys"]>,
    default: () => ({
      datakey: "data",
      totalkey: "total",
    }),
  },
  pageKeys: {
    type: Object as PropType<LazyListProps["pageKeys"]>,
    default: () => ({
      page: "page",
      pagesize: "pagesize",
    }),
  },
  formatData: {
    type: Function as PropType<LazyQueryListProps["formatData"]>,
  },
};
export const lazyQueryListProps = {
  ...lazyListProps,
  queryConfig: {
    type: Object as PropType<LazyQueryListProps["queryConfig"]>,
  },
};
