import { useState } from "react";
import { Analytics } from "@vercel/analytics/react";
import { CashFloat } from "./Components/CashFloat";
import { Settlement } from "./Components/Settlement";

function StartScreen({ onGetStarted }) {
  return (
    <div className="min-h-screen bg-[#ffffc1] p-0 flex items-center justify-center">
      <div className="w-[393px] h-[852px] bg-[#ffffc1] relative overflow-hidden">
        {/* Float Calculator Title with Keycaps */}
        <div className="absolute top-[135px] left-[41px] w-[312px]">
          <img src="../float-title-scaled.png" className="w-[312px]" />
        </div>

        {/* Green Bunny */}
        <div className="absolute top-[244px] left-[0px] w-[390px]">
          <img src="../green-bunny-scaled.png" className="w-[390px]" />
        </div>

        {/* Get Started Button */}
        <button
          onClick={onGetStarted}
          style={{
            fontFamily: '"Jersey 10", sans-serif',
          }}
          className="absolute top-[646px] left-[55px] w-[283px] h-[60px] bg-[#d3f081] border-[0] rounded-[40px] shadow-[0px_4px_0px_0px_#a4cf5a] flex items-center justify-center text-[#643629] text-[35px] leading-none hover:translate-y-0.5 hover:shadow-[0px_1px_0px_0px_#a4cf5a] transition-all"
        >
          Get Started
        </button>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 h-[30px] rounded-[35px] text-[#643629] text-[20px] font-['Jersey_10'] leading-none transition-all flex items-center justify-center ${
        active
          ? "bg-[#d3f081] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.1)]"
          : "bg-transparent hover:bg-[#d3f081]/50"
      }`}
    >
      {children}
    </button>
  );
}

export default function App() {
  const [showStartScreen, setShowStartScreen] = useState(true);
  const [activeTab, setActiveTab] = useState("cash");

  if (showStartScreen) {
    return <StartScreen onGetStarted={() => setShowStartScreen(false)} />;
  }

  return (
    <div className="min-h-screen bg-[#ffffc1] p-0 flex items-center justify-center">
      <Analytics mode="production" />
      <div className="w-[393px] min-h-[852px] bg-[#ffffc1] overflow-y-auto">
        <div className="py-[38px] space-y-4">
          {/* Tab Navigation */}
          <div className="w-[347px] mx-auto">
            <div className="bg-[#a4cf5a] h-[35px] rounded-[40px] relative">
              <div className="absolute inset-x-[3px] top-[2.5px] bottom-[2.5px] flex gap-1">
                <TabButton
                  active={activeTab === "cash"}
                  onClick={() => setActiveTab("cash")}
                >
                  Cash Float
                </TabButton>
                <TabButton
                  active={activeTab === "settlement"}
                  onClick={() => setActiveTab("settlement")}
                >
                  Settlement
                </TabButton>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="pb-[25px]">
            {activeTab === "cash" ? <CashFloat /> : <Settlement />}
          </div>
        </div>
      </div>
    </div>
  );
}
