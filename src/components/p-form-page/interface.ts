import type { PropType, ExtractPropTypes, Ref } from "vue";

export interface FormSchemas {
  label?: string;
  field: string;
  moreField?: string;
  isShow?: boolean | ((data: any) => boolean);
  defaultValue?: any;
  component:
    | "Input"
    | "NumberBox"
    | "Upload"
    | "Select"
    | "Datetime"
    | "Textarea"
    | "RadioGroup"
    | "TreeSelect"
    | "AddressMap";
  componentProps?: Record<string, any>;
  formItemProps?: Record<string, any>;
  slot?: string;
  span?: number;
  readonly?: boolean;
  suffix?: any;
}
interface Schemas {
  title?: string;
  slot?:string
  schemas: FormSchemas[];
}
export const formPageProps = {
  schemas: {
    type: Array as PropType<Schemas[]>,
    default: () => [],
  },
  span: {
    type: Number,
    default: 2,
  },
  rules: {
    type: Object,
    default: () => ({}),
  },
  labelWidth: {
    type: String,
    default: "100px",
  },
};
export declare type FormPageProps = Partial<
  ExtractPropTypes<typeof formPageProps>
>;
