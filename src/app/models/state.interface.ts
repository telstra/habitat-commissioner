// State 

export interface QueueItem {
  base: string;
  items: string[];
}

export interface StateInterface {
  view?: string;
  org?: string;
  env?: string;
  repo?: string;
  item?: {
    base?: string,
    parent?: any,
    data?: any
  };
  create_queue: QueueItem[];
  update_queue: QueueItem[];
  procure_queue: QueueItem[];
}