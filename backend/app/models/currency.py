from pydantic import BaseModel, Field


class ConversionRequest(BaseModel):
    amount: float = Field(gt=0)
    from_currency: str
    to_currency: str


class ConversionResponse(BaseModel):
    amount: float
    from_currency: str
    to_currency: str
    rate: float
    converted_amount: float
    last_updated: str
    explanation: str