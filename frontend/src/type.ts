export interface ConversionRequest {
    amount: number;
    from_currency: string;
    to_currency: string;
}


export interface ConversionResponse {
    amount: number;
    from_currency: string;
    to_currency: string;
    rate: number;
    converted_amount: number;
    last_updated: string;
    explanation: string;
}