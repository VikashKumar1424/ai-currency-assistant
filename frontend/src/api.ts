import type {
    ConversionRequest,
    ConversionResponse
} from "./type";


const API_BASE_URL = "http://localhost:8000";


export async function convertCurrency(
    request: ConversionRequest
): Promise<ConversionResponse> {

    const response = await fetch(
        `${API_BASE_URL}/api/convert`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(request)
        }
    );


    if (!response.ok) {

        const errorText =
            await response.text();

        throw new Error(
            errorText ||
            "Currency conversion failed."
        );
    }


    return response.json();
}