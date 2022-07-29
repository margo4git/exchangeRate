import React from "react";

export const CurrencySelection = ({
  currencies = ["EUR", "USD", "UAH"],
  valueSelect = "EUR",
  onChangeSelect = () => {},
  ...props
}) => {
  return (
    <div className="container-selection">
      <input {...props} />
      <select value={valueSelect} onChange={onChangeSelect}>
        {currencies.map((currency, id) => {
          return (
            <option value={currency} key={id}>
              {currency}
            </option>
          );
        })}
      </select>
    </div>
  );
};
