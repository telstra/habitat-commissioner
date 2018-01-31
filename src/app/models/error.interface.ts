// Error object representing an ApigeeError from the HC API
export interface ErrorInterface {
    code?: string;
    data?: any;
    error: any;
    message: string;
}