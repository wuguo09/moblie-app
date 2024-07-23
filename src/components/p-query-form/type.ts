export interface IQueryFormProps<T = Record<string, any>> {
  placeholder?: string;
  searchKey?: string;
  onSearch?(query: T): void;
  onReset?(query: T): void;
}

export const queryFormProps = {
  placeholder: {
    type: String,
    default: "请输入关键词",
  },
  searchKey: {
    type: String,
    default: "name",
  },
};
