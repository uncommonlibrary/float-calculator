import { useState } from "react";

const billDenominations = [50, 10, 5, 2];
const coinDenominations = [1, 0.5, 0.2, 0.1, 0.05];

export function CashFloat() {
  const [cashEntries, setCashEntries] = useState([
    ...billDenominations.map((denom, index) => ({
      id: `bill-${index}`,
      denomination: denom,
      quantity: 0,
      isCustom: false,
    })),
    ...coinDenominations.map((denom, index) => ({
      id: `coin-${index}`,
      denomination: denom,
      quantity: 0,
      isCustom: false,
    })),
  ]);

  const [customEntries, setCustomEntries] = useState([]);

  const total =
    cashEntries.reduce(
      (sum, entry) => sum + entry.denomination * entry.quantity,
      0
    ) +
    customEntries.reduce(
      (sum, entry) => sum + (parseFloat(entry.amount) || 0),
      0
    );

  // Handle numeric input for quantity fields (integers only)
  const handleQuantityKeyPress = (e) => {
    // Allow: backspace, delete, tab, escape, enter
    if (
      [8, 9, 27, 13, 46].indexOf(e.keyCode) !== -1 ||
      // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
      (e.keyCode === 65 && e.ctrlKey === true) ||
      (e.keyCode === 67 && e.ctrlKey === true) ||
      (e.keyCode === 86 && e.ctrlKey === true) ||
      (e.keyCode === 88 && e.ctrlKey === true)
    ) {
      return;
    }
    // Ensure that it is a number and stop the keypress
    if (
      (e.shiftKey || e.keyCode < 48 || e.keyCode > 57) &&
      (e.keyCode < 96 || e.keyCode > 105)
    ) {
      e.preventDefault();
    }
  };

  // Handle numeric input for amount fields (allows decimals)
  const handleAmountKeyPress = (e) => {
    // Allow: backspace, delete, tab, escape, enter, decimal point
    if (
      [8, 9, 27, 13, 46, 110, 190].indexOf(e.keyCode) !== -1 ||
      // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
      (e.keyCode === 65 && e.ctrlKey === true) ||
      (e.keyCode === 67 && e.ctrlKey === true) ||
      (e.keyCode === 86 && e.ctrlKey === true) ||
      (e.keyCode === 88 && e.ctrlKey === true)
    ) {
      return;
    }
    // Allow decimal point only if there isn't one already
    if (e.keyCode === 190 || e.keyCode === 110) {
      if (e.target.value.indexOf(".") !== -1) {
        e.preventDefault();
      }
      return;
    }
    // Ensure that it is a number and stop the keypress
    if (
      (e.shiftKey || e.keyCode < 48 || e.keyCode > 57) &&
      (e.keyCode < 96 || e.keyCode > 105)
    ) {
      e.preventDefault();
    }
  };

  // Sanitize numeric input
  const sanitizeNumericInput = (value, allowDecimals = false) => {
    if (allowDecimals) {
      // Allow numbers and one decimal point
      return value.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1");
    } else {
      // Allow only integers
      return value.replace(/[^0-9]/g, "");
    }
  };

  const updateQuantity = (id, value) => {
    const sanitizedValue = sanitizeNumericInput(value);
    const quantity = sanitizedValue === "" ? 0 : parseInt(sanitizedValue) || 0;
    setCashEntries((entries) =>
      entries.map((entry) => (entry.id === id ? { ...entry, quantity } : entry))
    );
  };

  const addCustomEntry = () => {
    const newEntry = {
      id: `custom-${Date.now()}`,
      amount: 0,
    };
    setCustomEntries((entries) => [...entries, newEntry]);
  };

  const updateCustomAmount = (id, value) => {
    const sanitizedValue = sanitizeNumericInput(value, true);
    const amount = sanitizedValue === "" ? 0 : parseFloat(sanitizedValue) || 0;
    setCustomEntries((entries) =>
      entries.map((entry) => (entry.id === id ? { ...entry, amount } : entry))
    );
  };

  const removeCustomEntry = (id) => {
    setCustomEntries((entries) => entries.filter((entry) => entry.id !== id));
  };

  const resetAll = () => {
    setCashEntries((entries) =>
      entries.map((entry) => ({ ...entry, quantity: 0 }))
    );
    setCustomEntries([]);
  };

  const formatDenomination = (value) => {
    if (value >= 1) {
      return `$${value}`;
    } else {
      return `${(value * 100).toFixed(0)}¢`;
    }
  };

  const billEntries = cashEntries.filter((entry) => entry.denomination >= 1);
  const coinEntries = cashEntries.filter((entry) => entry.denomination < 1);

  return (
    <div className="space-y-4 pt-[20px]">
      {/* Total Display changed w-[344px] to w-full */}
      <div className="bg-[#d3f081] h-[97px] w-full mx-auto rounded-[20px] border border-[#643629] shadow-[0px_4px_4px_0px_rgba(100,54,41,0.25)] flex flex-col items-center justify-center">
        <div className="text-[#643629] text-[30px] font-['Jersey_10'] leading-none mb-1">
          Total
        </div>
        <div className="text-[#643629] text-[45px] font-['Jersey_10'] leading-none">
          ${total.toFixed(2)}
        </div>
      </div>

      {/* Bills Section */}
      <div className="space-y-0 mt-[25px]">
        {/* Dark Green Box - changed w-[344px] to w-full */}
        <div className="bg-[#a4cf5a] w-full h-[34px] rounded-t-[20px] border-[#643629] border-t border-l border-r relative">
          {/* Bills Header - positioned in the green header area */}
          <div className="grid grid-cols-3 items-center px-[20px] py-[6px]">
            <div className="text-[#643629] text-[23px] font-['Jersey_10'] leading-none text-left">
              Bills
            </div>
            <div className="text-[#643629] text-[23px] font-['Jersey_10'] leading-none text-center">
              Count
            </div>
            <div className="text-[#643629] text-[23px] font-['Jersey_10'] leading-none text-right">
              Subtotal
            </div>
          </div>
        </div>

        {/* Light Green Box changed w-[344px] to w-full */}
        <div className="bg-[#d3f081] w-full rounded-b-[20px] border border-[#643629] shadow-[0px_4px_4px_0px_rgba(100,54,41,0.25)]">
          {/* Bills Entries */}
          <div className="px-[20px] py-[13px] space-y-[21px]">
            {billEntries.map((entry) => (
              <div key={entry.id} className="grid grid-cols-3 items-center">
                <div className="text-[#643629] text-[22px] font-['Jersey_10'] leading-none w-[80px]">
                  {formatDenomination(entry.denomination)}
                </div>
                <div className="w-12 mx-auto">
                  <input
                    type="number"
                    min="0"
                    inputMode="numeric"
                    value={entry.quantity === 0 ? "" : entry.quantity}
                    onFocus={(e) => e.target.select()}
                    onWheel={(e) => e.target.blur()}
                    onKeyDown={handleQuantityKeyPress}
                    onChange={(e) => updateQuantity(entry.id, e.target.value)}
                    className="w-full h-[22px] bg-[#ffffc1] rounded-[5px] shadow-[0px_4px_4px_0px_rgba(100,54,41,0.25)] text-center text-[#643629] text-[16px] font-['Jersey_10'] border-0 outline-none"
                  />
                </div>
                <div className="text-[#643629] text-[22px] font-['Jersey_10'] leading-none text-right">
                  ${(entry.denomination * entry.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Coins Section */}
      <div className="space-y-0 mt-[25px]">
        {/* Dark Green Box - changed w-[344px] to w-full */}
        <div className="bg-[#a4cf5a] w-full h-[34px] rounded-t-[20px] border-[#643629] border-t border-l border-r relative">
          {/* Coins Header - positioned in the green header area */}
          <div className="grid grid-cols-3 items-center px-[20px] py-[6px]">
            <div className="text-[#643629] text-[23px] font-['Jersey_10'] leading-none text-left">
              Coins
            </div>
            <div className="text-[#643629] text-[23px] font-['Jersey_10'] leading-none text-center">
              Count
            </div>
            <div className="text-[#643629] text-[23px] font-['Jersey_10'] leading-none text-right">
              Subtotal
            </div>
          </div>
        </div>

        {/* Light Green Box - changed w-[344px] to w-full */}
        <div className="bg-[#d3f081] w-full rounded-b-[20px] border border-[#643629] shadow-[0px_4px_4px_0px_rgba(100,54,41,0.25)]">
          {/* Coins Entries */}
          <div className="px-[20px] py-[13px] space-y-[21px]">
            {coinEntries.map((entry) => (
              <div key={entry.id} className="grid grid-cols-3 items-center">
                <div className="text-[#643629] text-[22px] font-['Jersey_10'] leading-none w-[80px]">
                  {formatDenomination(entry.denomination)}
                </div>
                <div className="w-12 mx-auto">
                  <input
                    type="number"
                    min="0"
                    inputMode="numeric"
                    value={entry.quantity === 0 ? "" : entry.quantity}
                    onFocus={(e) => e.target.select()}
                    onWheel={(e) => e.target.blur()}
                    onKeyDown={handleQuantityKeyPress}
                    onChange={(e) => updateQuantity(entry.id, e.target.value)}
                    className="w-full h-[22px] bg-[#ffffc1] rounded-[5px] shadow-[0px_4px_4px_0px_rgba(100,54,41,0.25)] text-center text-[#643629] text-[16px] font-['Jersey_10'] border-0 outline-none"
                  />
                </div>
                <div className="text-[#643629] text-[22px] font-['Jersey_10'] leading-none text-right">
                  ${(entry.denomination * entry.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Miscellaneous Section */}
      {customEntries.length > 0 && (
        <div className="space-y-0 mt-[25px]">
          {/* dark green box - changed w-[344px] to w-full */}
          <div className="bg-[#a4cf5a] w-full h-[34px] rounded-t-[20px] border-[#643629] border-t border-l border-r relative">
            <div className="text-[#643629] text-[23px] font-['Jersey_10'] leading-none px-[20px] py-[6px] text-right">
              Amount
            </div>
          </div>
          {/* light green box - changed w-[344px] to w-full */}
          <div className="bg-[#d3f081] w-full rounded-b-[20px] border border-[#643629] shadow-[0px_4px_4px_0px_rgba(100,54,41,0.25)]">
            {/* Miscellaneous Entries */}
            <div className="px-[20px] py-[13px] space-y-[21px]">
              {customEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between"
                >
                  <div className="text-[#643629] text-left text-[20px] font-['Jersey_10'] leading-none">
                    Any other amount?
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => removeCustomEntry(entry.id)}
                      className="w-[20px] h-[20px] mr-[5px] rounded-full bg-[#a4cf5a] shadow-[0px_3.45px_0px_0px_#82a544] flex items-center justify-center hover:translate-y-0.5 hover:shadow-[0px_1px_0px_0px_#82a544] transition-all"
                    >
                      <div className="absolute text-center text-[#643629] text-[17.274px] font-['Jersey_10'] leading-none">
                        ×
                      </div>
                    </button>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      inputMode="decimal"
                      value={entry.amount === 0 ? "" : entry.amount}
                      onFocus={(e) => e.target.select()}
                      onWheel={(e) => e.target.blur()}
                      onKeyDown={handleAmountKeyPress}
                      onChange={(e) =>
                        updateCustomAmount(entry.id, e.target.value)
                      }
                      className="w-[80px] h-[22px] bg-[#ffffc1] rounded-[5px] shadow-[0px_4px_4px_0px_rgba(100,54,41,0.25)] text-center text-[#643629] text-[16px] font-['Jersey_10'] border-0 outline-none"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-[21px] mt-[25px]">
        <button
          onClick={addCustomEntry}
          className="w-full h-[35px] bg-[#d3f081] rounded-[20px] shadow-[0px_4px_0px_0px_#a4cf5a] text-[#643629] text-[20px] font-['Jersey_10'] leading-none hover:translate-y-0.5 hover:shadow-[0px_2px_0px_0px_#a4cf5a] transition-all"
        >
          + Add Miscellaneous Amount
        </button>

        <button
          onClick={resetAll}
          className="w-full h-[35px] bg-[#f0564c] rounded-[20px] shadow-[0px_4px_0px_0px_#cc2e25] text-[#feeede] text-[20px] font-['Jersey_10'] leading-none hover:translate-y-0.5 hover:shadow-[0px_2px_0px_0px_#cc2e25] transition-all"
        >
          Reset All
        </button>
      </div>
    </div>
  );
}
