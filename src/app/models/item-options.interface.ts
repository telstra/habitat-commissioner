// the 'more options' data structures. See /services/utils.service for more information
export interface IOption {
  // option identifier. The text that will appear in the more options dropdown
  name: string;
  // verb to call in HC API: GET, PUT, POST, DELETE etc.
  method?: string;
  // HC api endpoint to call
  endpoint?: string;
  // Payload to pass if the HC API is being called
  payload?: any;
  // A modal defintion. This modal will be displayed when the option is clicked
  modal?: any;
  // Additional metadata required by the option. Can be anything you want
  metaData?: any;
  // True will show the option in red
  danger?: boolean;
  // Toggle the show delete confirmation when DELETE operations are called. Set to false to not show this confirmation
  showDeleteConfirmation?: boolean;
  // The delete confirmation will show details of the item/ sub item the DELETE method is being called on. Hide these details
  // by setting this false
  hideDetailsInDeleteConfirmation?: boolean;
}