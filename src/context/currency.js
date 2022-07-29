import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import qs from "qs";
import axios from "axios";
const API_KEY = process.env.REACT_APP_API_KEY;
export const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  const data = useCurrencyData();
  return (
    <CurrencyContext.Provider value={data}>{children}</CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  return useContext(CurrencyContext);
};

export const useCurrencyData = () => {
  const [exchangeRates, setExchangeRates] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const searchCurrency = useCallback(
    async ({ to = "UAH", from = "USD", amount = 1 } = {}) => {
      setIsLoading(true);
      const url = `https://api.apilayer.com/exchangerates_data/convert?${qs.stringify(
        {
          apikey: API_KEY,
          to: to,
          from: from,
          amount: amount,
        }
      )}`;
      const currencyResponse = await axios.get(url);
      setIsLoading(false);
      return Number(currencyResponse.data.result.toFixed(2));
    },
    []
  );
  const getExchangeRate = useCallback(
    async ({ to = "UAH", from = "USD", amount = 1 } = {}) => {
      const key = `${from}_${to}`;
      if (exchangeRates[key]) return;
      const exchangeRate = await searchCurrency({
        from: from,
        to: to,
        amount: amount,
      });

      setExchangeRates((prevDefaultCurrency) => {
        return {
          ...prevDefaultCurrency,
          [key]: exchangeRate,
        };
      });
    },
    [exchangeRates]
  );

  useEffect(() => {
    getExchangeRate({ from: "USD" });
  }, []);

  return {
    exchangeRates,
    getExchangeRate,
    isLoading,
  };
};
