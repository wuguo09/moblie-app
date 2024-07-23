import type { PropType } from "vue";

export interface DetailColumns {
  label?: string;
  field: string;
  moreField?: string;
  isShow?: boolean | ((data: any) => boolean);
  defaultValue?: any;
  defineValue?: any;
  type:
    | "text"
    | "tag"
    | "phone"
    | "userList"
    | "table"
    | "link"
    | "html"
    | "media";
  textColor?: string;
  componentProps?: Record<string, any>;
  slot?: string;
  /** text类型，数据与展示文本的映射 */
  map?: {
    [value: string | number | symbol]: string;
  };
}

export interface IDetailPageProps {
  columns: {
    title: string;
    slot?: string;
    columns: DetailColumns[];
  }[];
  data: Record<string, any>;
}

export const detailPageProps = {
  columns: {
    type: Array as PropType<IDetailPageProps["columns"]>,
    default: () => [],
  },
  data: {
    type: Object as PropType<IDetailPageProps["data"]>,
    default: () => ({}),
  },
};
