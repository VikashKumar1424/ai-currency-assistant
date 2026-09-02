import "./styles.css";

import { convertCurrency } from "./api";

import type {
    ConversionResponse
} from "./types";


const currencies: Record<string, string> = {

    USD: "🇺🇸 USD - US Dollar",

    INR: "🇮🇳 INR - Indian Rupee",

    EUR: "🇪🇺 EUR - Euro",

    GBP: "🇬🇧 GBP - British Pound",

    JPY: "🇯🇵 JPY - Japanese Yen",

    AUD: "🇦🇺 AUD - Australian Dollar",

    CAD: "🇨🇦 CAD - Canadian Dollar",

    SGD: "🇸🇬 SGD - Singapore Dollar",

    AED: "🇦🇪 AED - UAE Dirham",

    CHF: "🇨🇭 CHF - Swiss Franc",

    CNY: "🇨🇳 CNY - Chinese Yuan"
};


const amountInput =
    document.querySelector<HTMLInputElement>(
        "#amount"
    )!;


const fromCurrency =
    document.querySelector<HTMLSelectElement>(
        "#fromCurrency"
    )!;


const toCurrency =
    document.querySelector<HTMLSelectElement>(
        "#toCurrency"
    )!;


const convertButton =
    document.querySelector<HTMLButtonElement>(
        "#convertButton"
    )!;


const swapButton =
    document.querySelector<HTMLButtonElement>(
        "#swapButton"
    )!;


const resultCard =
    document.querySelector<HTMLElement>(
        "#resultCard"
    )!;


const conversionResult =
    document.querySelector<HTMLElement>(
        "#conversionResult"
    )!;


const exchangeRate =
    document.querySelector<HTMLElement>(
        "#exchangeRate"
    )!;


const aiExplanation =
    document.querySelector<HTMLElement>(
        "#aiExplanation"
    )!;


const updatedAt =
    document.querySelector<HTMLElement>(
        "#updatedAt"
    )!;


const loading =
    document.querySelector<HTMLElement>(
        "#loading"
    )!;


const errorElement =
    document.querySelector<HTMLElement>(
        "#error"
    )!;


function populateCurrencies(): void {

    Object.entries(currencies)
        .forEach(([code, name]) => {

            const fromOption =
                document.createElement("option");

            fromOption.value = code;
            fromOption.textContent = name;

            fromCurrency.appendChild(
                fromOption
            );


            const toOption =
                document.createElement("option");

            toOption.value = code;
            toOption.textContent = name;

            toCurrency.appendChild(
                toOption
            );
        });


    fromCurrency.value = "USD";
    toCurrency.value = "INR";
}


function setLoading(
    value: boolean
): void {

    loading.classList.toggle(
        "hidden",
        !value
    );

    convertButton.disabled = value;
}


function showError(
    message: string
): void {

    errorElement.textContent = message;

    errorElement.classList.remove(
        "hidden"
    );
}


function clearError(): void {

    errorElement.textContent = "";

    errorElement.classList.add(
        "hidden"
    );
}


function displayResult(
    result: ConversionResponse
): void {

    conversionResult.innerHTML = `
        <span>
            ${result.amount.toLocaleString()}
            ${result.from_currency}
        </span>

        <span class="arrow">
            →
        </span>

        <strong>
            ${result.converted_amount.toLocaleString(
                undefined,
                {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }
            )}
            ${result.to_currency}
        </strong>
    `;


    exchangeRate.textContent =
        `1 ${result.from_currency} = ` +
        `${result.rate.toFixed(6)} ` +
        `${result.to_currency}`;


    aiExplanation.textContent =
        result.explanation;


    updatedAt.textContent =
        `Last updated: ${result.last_updated}`;


    resultCard.classList.remove(
        "hidden"
    );
}


async function handleConversion(): Promise<void> {

    clearError();

    resultCard.classList.add(
        "hidden"
    );


    const amount =
        Number(amountInput.value);


    if (!amount || amount <= 0) {

        showError(
            "Please enter an amount greater than zero."
        );

        return;
    }


    setLoading(true);


    try {

        const result =
            await convertCurrency({

                amount,

                from_currency:
                    fromCurrency.value,

                to_currency:
                    toCurrency.value
            });


        displayResult(result);

    } catch (error) {

        showError(
            error instanceof Error
                ? error.message
                : "Something went wrong."
        );

    } finally {

        setLoading(false);
    }
}


function handleSwap(): void {

    const currentFrom =
        fromCurrency.value;

    fromCurrency.value =
        toCurrency.value;

    toCurrency.value =
        currentFrom;
}


convertButton.addEventListener(
    "click",
    handleConversion
);


swapButton.addEventListener(
    "click",
    handleSwap
);


populateCurrencies();