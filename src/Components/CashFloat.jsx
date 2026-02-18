import { useState, useEffect } from "react";
import html2canvas from "html2canvas";

const billDenominations = [50, 10, 5, 2];
const coinDenominations = [1, 0.5, 0.2, 0.1, 0.05];

export function CashFloat() {
  // Set Time - NEW
  const [currentTime, setCurrentTime] = useState(new Date());

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

  // Update clock every second - NEW
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format timestamp for display
  const formatTimestamp = () => {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const dayName = days[currentTime.getDay()];
    const day = currentTime.getDate();
    const month = months[currentTime.getMonth()];
    const year = currentTime.getFullYear();
    const hours = currentTime.getHours().toString().padStart(2, "0");
    const minutes = currentTime.getMinutes().toString().padStart(2, "0");
    const seconds = currentTime.getSeconds().toString().padStart(2, "0");

    return `${dayName}, ${day} ${month} ${year}, ${hours}:${minutes}:${seconds}`;
  };

  const total =
    cashEntries.reduce(
      (sum, entry) => sum + entry.denomination * entry.quantity,
      0
    ) +
    customEntries.reduce(
      (sum, entry) => sum + (parseFloat(entry.amount) || 0),
      0
    );

  // NEW - Get all focusable inputs in order and jump to the next one
  const handleEnterNext = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const inputs = Array.from(
        document.querySelectorAll("#cash-float-container input")
      );
      const currentIndex = inputs.indexOf(e.target);
      if (currentIndex < inputs.length - 1) {
        inputs[currentIndex + 1].focus();
        inputs[currentIndex + 1].select();
      } else {
        e.target.blur(); // Last field — dismiss keyboard
      }
    }
  };

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
    // Allow control keys
    if (
      [
        "Backspace",
        "Delete",
        "Tab",
        "Escape",
        "Enter",
        "ArrowLeft",
        "ArrowRight",
        "ArrowUp",
        "ArrowDown",
      ].includes(e.key) ||
      (e.ctrlKey && ["a", "c", "v", "x"].includes(e.key.toLowerCase()))
    ) {
      return;
    }

    // Allow one decimal point
    if (e.key === ".") {
      if (e.target.value.includes(".")) {
        e.preventDefault(); // Block second decimal
      }
      return; // Allow first decimal
    }

    // Allow digits 0–9 only
    if (!/^\d$/.test(e.key)) {
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
    setCustomEntries((entries) =>
      entries.map((entry) =>
        entry.id === id ? { ...entry, amount: sanitizedValue } : entry
      )
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

  // To generate screenshot - NEW (accounting for chrome ios)
const handleComplete = async () => {
  const element = document.getElementById('cash-float-container');
  const scrollContainer = element.closest('[class*="overflow"]') || document.body;

  try {
    const canvas = await html2canvas(scrollContainer, {
      useCORS: true,
      allowTaint: true,
      scale: 2,
      width: scrollContainer.scrollWidth,
      height: scrollContainer.scrollHeight,
      windowWidth: scrollContainer.scrollWidth,
      windowHeight: scrollContainer.scrollHeight,
      scrollX: 0,
      scrollY: 0,
      backgroundColor: '#f5e6d3',
      onclone: (clonedDoc) => {
        const clonedContainer = clonedDoc.getElementById('cash-float-container');
        if (clonedContainer) {
          clonedContainer.style.maxWidth = '400px';
          clonedContainer.style.margin = '0 auto';
          clonedContainer.style.padding = '0 16px';
        }
      },
    });

    canvas.toBlob(async (blob) => {
      const timestamp = new Date()
        .toISOString()
        .replace(/[:.]/g, '-')
        .slice(0, 19);
      const file = new File([blob], `cash-float-${timestamp}.png`, {
        type: 'image/png',
      });

      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      const canShareFiles =
        navigator.share &&
        navigator.canShare &&
        navigator.canShare({ files: [file] });

      if (isMobile && canShareFiles) {
        // Safari iOS: native share sheet
        try {
          await navigator.share({ files: [file], title: 'Cash Float' });
        } catch (err) {
          if (err.name !== 'AbortError') {
            openImageInNewTab(blob);
          }
        }
      } else if (isMobile && !canShareFiles) {
        // Chrome iOS: open in new tab, long-press to save
        openImageInNewTab(blob);
      } else {
        // Desktop: direct download
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = file.name;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
      }
    }, 'image/png');

  } catch (error) {
    if (error.name !== 'AbortError') {
      console.error('Screenshot failed:', error);
      alert('Could not capture screenshot. Please try again.');
    }
  }
};

// Opens image in a new tab — user can long-press to save on mobile
const openImageInNewTab = (blob) => {
  const url = URL.createObjectURL(blob);
  const newTab = window.open(url, '_blank');
  if (!newTab) {
    // If popup was blocked, prompt user
    alert('Screenshot ready! If the image did not open, please allow popups for this site.');
  }
  // Clean up after a delay
  setTimeout(() => URL.revokeObjectURL(url), 60000);
};

  return (
    <div id="cash-float-container" className="space-y-4 pt-[20px]">
      {/* Timestamp Display - NEW */}
      <div className="h-[60px] w-full mx-auto flex items-center justify-center">
        <div
          className="text-[#643629] font-['Jersey_10'] leading-none whitespace-nowrap"
          style={{ fontSize: "clamp(20px, 7vw, 35px)" }}
        >
          {formatTimestamp()}
        </div>
      </div>

      {/* Total Display changed w-[344px] to w-full */}
      <div className="bg-[#d3f081] h-[97px] w-full mx-auto rounded-[20px] border border-[#643629] shadow-[0px_4px_4px_0px_rgba(100,54,41,0.25)] flex flex-col items-center justify-center">
        <div className="text-[#643629] text-[30px] font-['Jersey_10'] leading-none mb-1">
          Total Float
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
              Dollars
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
                    type="text"
                    min="0"
                    inputMode="numeric"
                    value={entry.quantity === 0 ? "" : entry.quantity}
                    onFocus={(e) => e.target.select()}
                    onWheel={(e) => e.target.blur()}
                    onKeyDown={(e) => {
                      handleQuantityKeyPress(e);
                      handleEnterNext(e);
                    }}
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
              Cents
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
                    type="text"
                    min="0"
                    inputMode="numeric"
                    value={entry.quantity === 0 ? "" : entry.quantity}
                    onFocus={(e) => e.target.select()}
                    onWheel={(e) => e.target.blur()}
                    onKeyDown={(e) => {
                      handleQuantityKeyPress(e);
                      handleEnterNext(e);
                    }}
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
                      type="text"
                      min="0"
                      step="0.01"
                      inputMode="decimal"
                      value={entry.amount === 0 ? "" : entry.amount}
                      onFocus={(e) => e.target.select()}
                      onWheel={(e) => e.target.blur()}
                      onKeyDown={(e) => {
                        handleAmountKeyPress(e);
                        handleEnterNext(e);
                      }}
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

        <button
          onClick={handleComplete}
          className="w-full h-[35px] bg-[#a4cf5a] rounded-[20px] shadow-[0px_4px_0px_0px_#82a544] text-[#643629] text-[20px] font-['Jersey_10'] leading-none hover:translate-y-0.5 hover:shadow-[0px_2px_0px_0px_#82a544] transition-all"
        >
          Save as Photo
        </button>
      </div>
    </div>
  );
}
