// response object sent back from the HC API on successful requests
export interface ApigeeResponseInterface {
  code: number;
  message: string;
  data: any;
}