import React, { useCallback, useEffect, useRef, useState } from "react";
import { CurrencySelection } from "../components/currencySelection";
import { Loader } from "../components/loader";
import { useCurrency } from "../context/currency";

export const Selectors = () => {
  const { exchangeRates, getExchangeRate, isLoading } = useCurrency();
  const currencies = ["EUR", "USD", "UAH"];
  const lastChangedCurrency = useRef(null);
  const [firstCurrency, setFirstCurrency] = useState({
    currency: "EUR",
    amount: 1,
  });
  const [secondCurrency, setSecondCurrency] = useState({
    currency: "UAH",
    amount: 0,
  });
  const exchangeRateNow = `${firstCurrency.currency}_${secondCurrency.currency}`;
  const currentRate = exchangeRates[exchangeRateNow];

  useEffect(() => {
    getExchangeRate({
      from: firstCurrency.currency,
      to: secondCurrency.currency,
    });
  }, [firstCurrency.currency, secondCurrency.currency]);

  const recalculateAmount = useCallback(() => {
    if (!currentRate) return;

    if (lastChangedCurrency?.current === "first") {
      setSecondCurrency((prevState) => {
        return {
          ...prevState,
          amount: (firstCurrency.amount * currentRate).toFixed(2),
        };
      });
    }
    if (lastChangedCurrency?.current === "second") {
      setFirstCurrency((prevState) => {
        return {
          ...prevState,
          amount: (
            (secondCurrency.amount || firstCurrency.amount * currentRate) /
            currentRate
          ).toFixed(2),
        };
      });
    }
  }, [firstCurrency, secondCurrency, currentRate]);

  useEffect(() => {
    recalculateAmount();
  }, [currentRate]);

  if (isLoading)
    return (
      <div className="container">
        <Loader />
      </div>
    );

  return (
    <div className="container">
      <CurrencySelection
        currencies={currencies.filter(
          (currency) => currency !== secondCurrency.currency
        )}
        valueSelect={firstCurrency.currency}
        onChangeSelect={({ target: { value } }) => {
          lastChangedCurrency.current = "first";
          setFirstCurrency((prevState) => {
            return { ...prevState, currency: value };
          });
        }}
        type="number"
        value={firstCurrency.amount}
        onChange={({ target: { value } }) => {
          setFirstCurrency((prevState) => {
            setSecondCurrency((prevState) => {
              return {
                ...prevState,
                amount: (value * currentRate).toFixed(2),
              };
            });
            return { ...prevState, amount: value };
          });
        }}
      />

      <CurrencySelection
        currencies={currencies.filter(
          (currency) => currency !== firstCurrency.currency
        )}
        valueSelect={secondCurrency.currency}
        onChangeSelect={({ target: { value } }) => {
          lastChangedCurrency.current = "second";
          setSecondCurrency((prevState) => {
            return { ...prevState, currency: value };
          });
        }}
        type="number"
        value={
          secondCurrency.amount || firstCurrency.amount * currentRate || ""
        }
        onChange={({ target: { value } }) => {
          setSecondCurrency((prevState) => {
            setFirstCurrency((prevState) => {
              return {
                ...prevState,
                amount: (value / currentRate).toFixed(2),
              };
            });
            return { ...prevState, amount: value };
          });
        }}
      />
    </div>
  );
};
