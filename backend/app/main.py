from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.models.currency import (
    ConversionRequest,
    ConversionResponse,
)

from app.services.currency_service import (
    CurrencyService,
)

from app.services.gemini_service import (
    GeminiService,
)


app = FastAPI(
    title="AI Currency Assistant API",
    version="1.0.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


currency_service = CurrencyService()
gemini_service = GeminiService()


@app.get("/api/health")
def health():

    return {
        "status": "ok",
        "service": "AI Currency Assistant",
    }


@app.post(
    "/api/convert",
    response_model=ConversionResponse,
)
def convert_currency(
    request: ConversionRequest,
):

    result = currency_service.convert(
        amount=request.amount,
        from_currency=request.from_currency,
        to_currency=request.to_currency,
    )

    explanation = gemini_service.explain(
        amount=result["amount"],
        from_currency=result["from_currency"],
        to_currency=result["to_currency"],
        rate=result["rate"],
        converted_amount=result["converted_amount"],
    )

    return ConversionResponse(
        **result,
        explanation=explanation,
    )