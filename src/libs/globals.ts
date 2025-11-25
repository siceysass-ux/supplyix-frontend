

type CurrencyType = {
    symbol: string;
    decimal_digits: number;
    rounding: number;
    code: string;
    symbol_position: "before" | "before_space" | "after" | "after_space";
}

declare global {
    var currency: CurrencyType;
}

const currencies : CurrencyType[] = [
    {
        symbol: "₺",
        decimal_digits: 2,
        rounding: 0,
        code: "TRY",
        symbol_position: "before"
    },
    {
        symbol: "$",
        decimal_digits: 2,
        rounding: 0,
        code: "USD",
        symbol_position: "before"
    },
    {
        symbol: "€",
        decimal_digits: 2,
        rounding: 0,
        code: "EUR",
        symbol_position: "before"
    }
];

globalThis.currency = currencies.find(c => c.code === "USD") || currencies[0];