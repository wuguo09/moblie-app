export interface ICardListProps {
  columns: CardListColumns;
  datas: any;
}
export type GETKEY = string | ((data: any) => string);
export interface CardListColumns {
  titleKey: GETKEY;
  titleIcon?: string;
  titleIconColor?: string;
  statusKey: string;
  statusConfigs: {
    color: string;
    value: number | string;
    text: string;
  }[];
  imgKey?: string;
  list: {
    key: GETKEY;
    label: string;
    tagOption?: {
      label: string;
      value: any;
      color: string;
    }[];
  }[];
}
