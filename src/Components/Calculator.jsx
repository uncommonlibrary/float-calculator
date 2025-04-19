import React, { useState, useEffect } from "react";
import "../App.css";

export default function Calculator() {
  const denominations = [
    { label: "$50", value: 50 },
    { label: "$10", value: 10 },
    { label: "$5", value: 5 },
    { label: "$2", value: 2 },
    { label: "$1", value: 1 },
    { label: "50¢", value: 0.5 },
    { label: "20¢", value: 0.2 },
    { label: "10¢", value: 0.1 },
    { label: "5¢", value: 0.05 },
  ];

  const [counts, setCounts] = useState(
    denominations.reduce((acc, curr) => {
      acc[curr.value] = 0;
      return acc;
    }, {})
  );

  const [otherAmounts, setOtherAmounts] = useState([""]);
  const [errorMessages, setErrorMessages] = useState([""]);
  const [total, setTotal] = useState(0);

  const validateAmount = (value) => {
    const regex = /^\d*\.?\d{0,2}$/;
    return regex.test(value);
  };

  const calculateTotal = () => {
    let newTotal = 0;

    denominations.forEach((denomination) => {
      newTotal += counts[denomination.value] * denomination.value;
    });

    otherAmounts.forEach((amount) => {
      newTotal += parseFloat(amount) || 0;
    });

    setTotal(newTotal);
  };

  useEffect(() => {
    calculateTotal();
  }, [counts, otherAmounts]);

  const handleDenominationChange = (value, count) => {
    setCounts((prevCounts) => ({
      ...prevCounts,
      [value]: parseInt(count) || 0,
    }));
  };

  const handleOtherAmountChange = (index, value) => {
    const newOtherAmounts = [...otherAmounts];
    newOtherAmounts[index] = value;
    setOtherAmounts(newOtherAmounts);

    const newErrorMessages = [...errorMessages];
    newErrorMessages[index] = validateAmount(value)
      ? ""
      : "Please enter a valid number with up to 2 decimal places";
    setErrorMessages(newErrorMessages);
  };

  const addOtherAmountField = () => {
    setOtherAmounts([...otherAmounts, ""]);
    setErrorMessages([...errorMessages, ""]);
  };

  const handleReset = () => {
    const resetCounts = {};
    denominations.forEach((d) => {
      resetCounts[d.value] = "0";
    });
    setCounts(resetCounts);
    setOtherAmounts([""]);;
    setErrorMessages([]);
  };


  return (
    <>
      <div className="calculator">
        <div id="total">
          <h2>Total:</h2>
          <h1>${total.toFixed(2)}</h1>
        </div>

        <div className="calculator-container">
          <div className="titles">
            <h3>Dollars and Cents</h3>
            <h3>No. of Notes/Coins</h3>
          </div>

          <div className="denomination-group">
            {denominations.map((denomination) => (
              <div key={denomination.value} className="denomination-row">
                <label className="denomination-label">
                  {denomination.label}:
                </label>
                <input
                  type="text"
                  className="denomination-input"
                  inputMode="numeric"
                  pattern="\d*"
                  min="0"
                  value={counts[denomination.value]}
                  onClick={(e) => e.target.select()}
                  onChange={(e) =>
                    handleDenominationChange(denomination.value, e.target.value)
                  }
                />
              </div>
            ))}
          </div>

          <div className="other-amount-group">
            {otherAmounts.map((amount, index) => (
              <div key={index} className="other-amount-row">
                <label className="other-amount-label">
                  Any other amount?
                </label>

                <input
                  type="text"
                  inputMode="numeric"
                  className="denomination-input"
                  pattern="\d*"
                  placeholder="Enter amount (e.g., 9.50)"
                  value={amount}
                  onChange={(e) =>
                    handleOtherAmountChange(index, e.target.value)
                  }
                />
                {index === otherAmounts.length - 1 && (
                  <button onClick={addOtherAmountField} className="add-button">
                    +
                  </button>
                )}
              </div>
            ))}
            {errorMessages.map((error, index) =>
              error ? (
                <span key={index} className="error-message">
                  {error}
                </span>
              ) : null
            )}
          </div>
        </div>

        <button onClick={handleReset} className="reset-button">
          Reset
        </button>
      </div>
    </>
  );
}
