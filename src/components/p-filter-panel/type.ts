export interface IFilterItem<
  T extends Record<string, any> = Record<string, any>
> {
  label: string;
  key: keyof T;
  formatValue?(val: any): Record<keyof T,any>;
  multiple?: boolean;
  options: {
    label: string;
    value: any;
  }[];
}

export interface IFilterPanelProps<
  T extends Record<string, any> = Record<string, any>
> {
  schemas: IFilterItem<T>[];
  modelValue: T;
  "onUpdate:formatValue"?(val: Record<keyof T, any | any[]>): void;
  "onUpdate:modelValue"?(val: Record<keyof T, any | any[]>): void;
}

export interface IFilterPanelExpose {
  getModelValue(): Record<string, any>;
  doReset(): void;
}
