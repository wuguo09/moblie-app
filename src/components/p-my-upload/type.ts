interface UploadData {
  fileName: string;
  fileSize: string;
  fileType: string;
  path: string;
  uri: string;
  url: string;
}

// Define the interface for the entire response object
export interface UploadResponse {
  code: number;
  currentPage: number;
  data: UploadData[];
  errors: any;
  header: any;
  msg: string;
  pageList: any;
  pageSize: number;
  time: string;
  total: number;
  totalPage: number;
}

export const File_TYPE_MAP = {
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  pdf: 'application/pdf',
  jpg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  html: 'text/html',
  video: 'video/*',
  audio: 'audio/*',
  svg: 'image/svg+xml',
};
export const ImageType =
  File_TYPE_MAP.jpg + ',' + File_TYPE_MAP.png + ',' + File_TYPE_MAP.gif + ',' + File_TYPE_MAP.svg;
export const ImageVideoType = ImageType + ',' + File_TYPE_MAP.video;

export type IFileType = keyof typeof File_TYPE_MAP;

export const getUploadFileType = (list: IFileType[]) => list.map((i) => File_TYPE_MAP[i]).join(',');
