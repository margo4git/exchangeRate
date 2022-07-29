import React, { useCallback, useState } from "react";
import { useCurrency } from "../context/currency";

export const Header = () => {
  const { exchangeRates } = useCurrency();
  return (
    <header>
      <span>
        {exchangeRates.USD_UAH ? `$ ${exchangeRates.USD_UAH.toFixed(2)}` : " "}
      </span>
      <span>
        {" "}
        {exchangeRates.EUR_UAH ? `€ ${exchangeRates.EUR_UAH.toFixed(2)}` : " "}
      </span>
    </header>
  );
};
