// the 'more options' data structures. See /services/utils.service for more information
export interface IOption {
  name: string;
  method?: string;
  endpoint?: string;
  payload?: any;
  modal?: any;
  metaData?: any;
  danger?: boolean;
  showDeleteConfirmation?: boolean;
  hideDetailsInDeleteConfirmation?: boolean;
}