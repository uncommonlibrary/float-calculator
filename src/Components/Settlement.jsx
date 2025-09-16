import { useState } from "react";

const quickAddTypes = [
  ["Visa", "Mastercard"],
  ["Amex", "KrisPay"],
  ["GrabPay", "Shopback"],
  ["PayNow", "Cash"],
];

// No re-render while typing
function PaymentEntryItem({
  entry,
  updateAmount,
  updatePaymentType,
  removeEntry,
}) {
  const [localPaymentType, setLocalPaymentType] = useState(entry.paymentType);

  // Handle live typing for amount field - update parent state immediately
  const handleAmountChange = (e) => {
    const value = e.target.value;
    const sanitizedValue = sanitizeNumericInput(value);
    const amount = sanitizedValue === "" ? 0 : parseFloat(sanitizedValue) || 0;
    updateAmount(entry.id, amount);
  };

  // Handle payment type typing - ONLY update local state
  const handlePaymentTypeChange = (e) => {
    const value = e.target.value;
    const formattedValue = capitalizeFirstLetter(value);
    setLocalPaymentType(formattedValue);
  };

  // Update parent state ONLY on blur
  const handlePaymentTypeBlur = () => {
    updatePaymentType(entry.id, localPaymentType);
  };

  const capitalizeFirstLetter = (string) => {
    if (!string) return "";
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  const sanitizeNumericInput = (value) => {
    return value.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1");
  };

  // Handle numeric input for amount fields
  const handleAmountKeyPress = (e) => {
    if (
      [8, 9, 27, 13, 46, 110, 190].indexOf(e.keyCode) !== -1 ||
      (e.keyCode === 65 && e.ctrlKey === true) ||
      (e.keyCode === 67 && e.ctrlKey === true) ||
      (e.keyCode === 86 && e.ctrlKey === true) ||
      (e.keyCode === 88 && e.ctrlKey === true)
    ) {
      return;
    }
    if (e.keyCode === 190 || e.keyCode === 110) {
      if (e.target.value.indexOf(".") !== -1) {
        e.preventDefault();
      }
      return;
    }
    if (
      (e.shiftKey || e.keyCode < 48 || e.keyCode > 57) &&
      (e.keyCode < 96 || e.keyCode > 105)
    ) {
      e.preventDefault();
    }
  };

  return (
    <div className="w-full flex items-center gap-2 py-[3px]">
      {/* Added flex-1 to input and removed w-[155px]; added w-full in div above*/}
      <input
        type="text"
        value={localPaymentType}
        disabled={!entry.isCustom}
        onFocus={entry.isCustom ? (e) => e.target.select() : null}
        onChange={handlePaymentTypeChange}
        onBlur={handlePaymentTypeBlur}
        className="flex-1 pl-[5px] h-[22px] bg-[#ffffc1] rounded-[5px] shadow-[0px_4px_4px_0px_rgba(100,54,41,0.25)] px-2 text-[#643629] text-[16.105px] font-['Jersey_10'] border-0 outline-none"
        placeholder="Payment Type"
      />
      <button
        onClick={() => removeEntry(entry.id)}
        className="w-[20px] h-[20px] mx-[7px] rounded-full bg-[#a4cf5a] shadow-[0px_3.45px_0px_0px_#82a544] flex items-center justify-center hover:translate-y-0.5 hover:shadow-[0px_1px_0px_0px_#82a544] transition-all"
      >
        <div className="absolute text-center text-[#643629] text-[17.274px] font-['Jersey_10'] leading-none">
          ×
        </div>
      </button>
      <input
        type="number"
        inputMode="decimal"
        min="0"
        value={entry.amount === 0 ? "" : entry.amount}
        onFocus={(e) => e.target.select()}
        onWheel={(e) => e.target.blur()}
        onKeyDown={handleAmountKeyPress}
        onChange={handleAmountChange}
        className="mr-auto w-1/4 flex-shrink-0 h-[22px] bg-[#ffffc1] rounded-[5px] shadow-[0px_4px_4px_0px_rgba(100,54,41,0.25)] text-center text-[#643629] text-[16.105px] font-['Jersey_10'] border-0 outline-none"
        placeholder="0.00"
      />
    </div>
  );
}

export function Settlement() {
  const [paymentEntries, setPaymentEntries] = useState([]);

  const updateAmount = (id, amount) => {
    setPaymentEntries((entries) =>
      entries.map((entry) => (entry.id === id ? { ...entry, amount } : entry))
    );
  };

  const updatePaymentType = (id, paymentType) => {
    setPaymentEntries((entries) =>
      entries.map((entry) =>
        entry.id === id ? { ...entry, paymentType } : entry
      )
    );
  };

  const addEntry = (paymentType = "") => {
    const newEntry = {
      id: `entry-${Date.now()}`,
      paymentType,
      amount: 0,
      isCustom: paymentType === "" ? true : false,
    };
    setPaymentEntries((entries) => [...entries, newEntry]);
  };

  const removeEntry = (id) => {
    setPaymentEntries((entries) => entries.filter((entry) => entry.id !== id));
  };

  const resetAll = () => {
    setPaymentEntries([]);
  };

  const normalizePaymentType = (paymentType) => {
    return paymentType.toLowerCase().trim();
  };

  // Group entries by payment type
  const groupedEntries = paymentEntries.reduce((groups, entry) => {
    const originalType = entry.paymentType || "Unnamed";
    const normalizedType = normalizePaymentType(originalType);

    if (!groups[normalizedType]) {
      groups[normalizedType] = {
        displayName: originalType,
        entries: [],
      };
    }
    groups[normalizedType].entries.push(entry);
    return groups;
  }, {});

  // Calculate total sales - updates dynamically
  const totalSales = paymentEntries.reduce(
    (sum, entry) => sum + (parseFloat(entry.amount) || 0),
    0
  );

  return (
    <div className="space-y-4 pt-[20px]">
      {/* Total Sales Display - Updates dynamically - changed w-[344px] to w-full */}
      <div className="bg-[#d3f081] h-[97px] w-full mx-auto rounded-[20px] border border-[#643629] shadow-[0px_4px_4px_0px_rgba(100,54,41,0.25)] flex flex-col items-center justify-center">
        <div className="text-[#643629] text-[30px] font-['Jersey_10'] leading-none mb-1">
          Total Sales
        </div>
        <div className="text-[#643629] text-[45px] font-['Jersey_10'] leading-none">
          ${totalSales.toFixed(2)}
        </div>
      </div>

      {/* Add Payment Type Title - removed mx-[25px] */}
      <div className="space-y-0 my-[15px]">
        <div className="text-[#643629] text-left text-[30px] font-['Jersey_10'] leading-none">
          Add Payment Type
        </div>
      </div>

      {/* Quick Add Buttons - removed mx-[25px] */}
      <div className="space-y-[14px] w-full">
        {quickAddTypes.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-[11px]">
            {row.map((type) => (
              <button
                key={type}
                onClick={() => addEntry(type)}
                className="flex-1 w-full h-[28px] bg-[#d3f081] rounded-[16.105px] shadow-[0px_3.221px_0px_0px_#a4cf5a] text-[#643629] text-[16.105px] font-['Jersey_10'] leading-none hover:translate-y-0.5 hover:shadow-[0px_1px_0px_0px_#a4cf5a] transition-all"
              >
                + {type}
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* Payment Entries Title - removed mx-[25px] */}
      <div className="space-y-0 my-[15px]">
        <div className="text-[#643629] text-left text-[30px] font-['Jersey_10'] leading-none">
          Payment Entries
        </div>
      </div>

      {/* Payment Entries - changed w-[344px] to w-full and removed mx-[25px]*/}
      {Object.keys(groupedEntries).length > 0 ? (
        <div className="bg-[#d3f081] w-full rounded-[20px] border border-[#643629] shadow-[0px_4px_4px_0px_rgba(100,54,41,0.25)]">
          {/* Headers */}
          <div className="grid grid-cols-2 items-center px-[13px] pt-[10px]">
            <div className="text-[#643629] text-[23px] font-['Jersey_10'] leading-none text-left">
              Payment Type
            </div>
            <div className="text-[#643629] text-[23px] font-['Jersey_10'] leading-none text-right">
              Amount
            </div>
          </div>

          {/* Entries - removed px-[20px] */}
          <div className="pt-[5px] pb-[10px] space-y-4 px-[13px]">
            {Object.entries(groupedEntries).map(
              ([normalizedType, { displayName, entries }]) => {
                // Subtotal calculates dynamically as you type amount
                const subtotal = entries.reduce(
                  (sum, entry) => sum + (parseFloat(entry.amount) || 0),
                  0
                );

                return (
                  // <div key={normalizedType} className="space-y-[5px] px-[7px]">
                  <div key={normalizedType} className="space-y-[5px]">
                    {/* Show subtotal - updates when amounts change */}
                    {paymentEntries.length > 0 && (
                      <div className="flex justify-between items-center bg-[#ffffc1] rounded-[5px] shadow-[-3px_0px_0px_0px_rgba(100,54,41,0.25)] px-4 mt-[7px] h-[22px]">
                        <span className="pl-[5px] text-[rgba(100,54,41,0.7)] text-[16px] font-['Jersey_10'] leading-none">
                          {displayName} ({entries.length} entr
                          {entries.length === 1 ? "y" : "ies"})
                        </span>
                        <span className="pr-[5px] text-[#643629] text-[16.105px] font-['Jersey_10'] leading-none">
                          ${subtotal.toFixed(2)}
                        </span>
                      </div>
                    )}

                    {/* Individual entries */}
                    {entries.map((entry) => (
                      <PaymentEntryItem
                        key={entry.id}
                        entry={entry}
                        updateAmount={updateAmount}
                        updatePaymentType={updatePaymentType}
                        removeEntry={removeEntry}
                      />
                    ))}
                  </div>
                );
              }
            )}
          </div>
        </div>
      ) : (
        <div className="bg-[#d3f081] w-full rounded-[20px] border border-[#643629] shadow-[0px_4px_4px_0px_rgba(100,54,41,0.25)]">
          {/* ABOVE - change w-[344px] to w-full and removed mx-[25px]*/}
          <div className="text-center text-[#643629] text-[20px] font-['Jersey_10'] leading-none">
            <p>
              No payment entries yet! <br /> Add payment type above or <br />{" "}
              add a custom payment type.
            </p>
          </div>
        </div>
      )}

      {/* Action Buttons - removed m-[25px] from div directly below */}
      <div className="space-y-[21px] mt-[25px]">
        <button
          onClick={() => addEntry()}
          className="w-full h-[35px] bg-[#d3f081] rounded-[20px] shadow-[0px_4px_0px_0px_#a4cf5a] text-[#643629] text-[20px] font-['Jersey_10'] leading-none hover:translate-y-0.5 hover:shadow-[0px_1px_0px_0px_#a4cf5a] transition-all"
        >
          + Add Custom Payment Type
        </button>

        <button
          onClick={resetAll}
          className="w-full h-[35px] bg-[#f0564c] rounded-[20px] shadow-[0px_4px_0px_0px_#cc2e25] text-[#feeede] text-[20px] font-['Jersey_10'] leading-none hover:translate-y-0.5 hover:shadow-[0px_1px_0px_0px_#cc2e25] transition-all"
        >
          Reset All
        </button>
      </div>
    </div>
  );
}
