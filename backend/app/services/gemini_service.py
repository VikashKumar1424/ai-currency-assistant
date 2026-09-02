from google import genai

from app.config import (
    GOOGLE_API_KEY,
    GEMINI_MODEL,
)


class GeminiService:

    def __init__(self):

        self.client = genai.Client(
            api_key=GOOGLE_API_KEY
        )

    def explain(
        self,
        amount: float,
        from_currency: str,
        to_currency: str,
        rate: float,
        converted_amount: float,
    ) -> str:

        prompt = f"""
You are a currency conversion assistant.

Explain the following conversion clearly.

Amount:
{amount} {from_currency}

Exchange rate:
1 {from_currency} = {rate} {to_currency}

Converted amount:
{converted_amount:.2f} {to_currency}

Rules:
- Do not change the provided exchange rate.
- Do not invent financial data.
- Explain the calculation briefly.
- Mention that exchange rates fluctuate.
- Do not provide investment advice.
- Keep the response under 100 words.
"""

        response = self.client.models.generate_content(
            model=GEMINI_MODEL,
            contents=prompt,
        )

        return response.text or "No explanation available."