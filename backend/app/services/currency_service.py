import requests


class CurrencyService:

    BASE_URL = "https://open.er-api.com/v6/latest"

    def get_rates(self, currency: str) -> dict:

        currency = currency.upper()

        response = requests.get(
            f"{self.BASE_URL}/{currency}",
            timeout=10,
        )

        response.raise_for_status()

        data = response.json()

        if data.get("result") != "success":
            raise RuntimeError(
                "Unable to retrieve exchange rates."
            )

        return data

    def convert(
        self,
        amount: float,
        from_currency: str,
        to_currency: str,
    ):

        from_currency = from_currency.upper()
        to_currency = to_currency.upper()

        data = self.get_rates(from_currency)

        rates = data["rates"]

        if to_currency not in rates:
            raise ValueError(
                f"Unsupported currency: {to_currency}"
            )

        rate = float(rates[to_currency])

        converted_amount = amount * rate

        return {
            "amount": amount,
            "from_currency": from_currency,
            "to_currency": to_currency,
            "rate": rate,
            "converted_amount": converted_amount,
            "last_updated": data.get(
                "time_last_update_utc",
                "Unknown",
            ),
        }