// how we receieve logs from winston
export class LogInterface {
    level: string;
    timestamp: string;
    message: string;
    meta?: {
        data?: any;
        message?: string;
        statusCode?: number;
    }
}