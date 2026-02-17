import { useState, useEffect } from "react";
import { Analytics } from "@vercel/analytics/react";
import { CashFloat } from "./Components/CashFloat";
import { Settlement } from "./Components/Settlement";

/*~~~ TO REVISIT ~~~*/
// function StartScreen({ onGetStarted }) {
//   return (
//     <div className="min-h-screen bg-[#ffffc1] p-0 flex items-center justify-center">
//       <div className="w-[393px] h-[852px] bg-[#ffffc1] relative overflow-hidden">
//         {/* Float Calculator Title with Keycaps */}
//         <div className="absolute top-[135px] left-[41px] w-[312px]">
//           <img src="../float-title-scaled.png" className="w-[312px]" />
//         </div>

//         {/* Green Bunny */}
//         <div className="absolute top-[244px] left-[0px] w-[390px]">
//           <img src="../green-bunny-scaled.png" className="w-[390px]" />
//         </div>

//         {/* Get Started Button */}
//         <button
//           onClick={onGetStarted}
//           style={{
//             fontFamily: '"Jersey 10", sans-serif',
//           }}
//           className="absolute top-[646px] left-[55px] w-[283px] h-[60px] bg-[#d3f081] border-[0] rounded-[40px] shadow-[0px_4px_0px_0px_#a4cf5a] flex items-center justify-center text-[#643629] text-[35px] leading-none hover:translate-y-0.5 hover:shadow-[0px_1px_0px_0px_#a4cf5a] transition-all"
//         >
//           Get Started
//         </button>
//       </div>
//     </div>
//   );
// }

function StartScreen({ onGetStarted }) {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getMaxWidth = () => {
    if (screenWidth >= 1150) return '30%';      // Laptop
    if (screenWidth >= 768) return '50%';       // Tablet  
    return '80%';                               // Phone
  };

  return (
    // <div className="min-h-screen bg-[#ffffc1] p-0 flex flex-col items-center">
    //   <div 
    //     style={{
    //       width: '100%',
    //       maxWidth: getMaxWidth(),
    //       display: 'flex',
    //       flexDirection: 'column',
    //       alignItems: 'center',
    //       justifyContent: 'center',
    //       paddingTop: '2vh', 
    //       paddingLeft: '1rem',
    //       paddingRight: '1rem',
    //       paddingBottom: '2vh',
    //     }}
    //     className="flex-grow justify-center"
    //   >
    //     <div className="mb-8">
    //       <img
    //         src="../float-title-scaled.png"
    //         className="w-full"
    //         alt="Float Calculator"
    //       />
    //     </div>

    //     <div className="my-8">
    //       <img
    //         src="../green-bunny-scaled.png"
    //         className="w-full"
    //         alt="Green Bunny"
    //       />
    //     </div>

    //     <button
    //       onClick={onGetStarted}
    //       style={{ fontFamily: '"Jersey 10", sans-serif' }}
    //       className="w-full max-w-xs h-[60px] bg-[#d3f081] rounded-[40px] shadow-[0px_4px_0px_0px_#a4cf5a] flex items-center justify-center text-[#643629] text-[35px] leading-none hover:translate-y-0.5 hover:shadow-[0px_1px_0px_0px_#a4cf5a] transition-all"
    //     >
    //       Get Started
    //     </button>
    //   </div>
    // </div>
    <div
      style={{ height: '100dvh' }}
      className="bg-[#ffffc1] flex flex-col items-center justify-center overflow-hidden"
    >
      <div
        className="flex flex-col items-center justify-center w-full h-full"
        style={{
          maxWidth: '400px',
          padding: '5dvh 8vw',  // scales proportionally on all screen sizes
        }}
      >
        {/* Title */}
        <img
          src="../float-title-scaled.png"
          className="w-full max-w-[85%]"
          alt="Float Calculator"
          style={{ flex: '2', objectFit: 'contain', minHeight: 0 }}
        />

        {/* Bunny */}
        <img
          src="../green-bunny-scaled.png"
          className="w-full"
          alt="Green Bunny"
          style={{ flex: '5', objectFit: 'contain', minHeight: 0 }}
        />

        {/* Button */}
        <div style={{ flex: '1.5', width: '100%', minHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <button
            onClick={onGetStarted}
            style={{ fontFamily: '"Jersey 10", sans-serif' }}
            className="w-full max-w-[85%] h-[60px] bg-[#d3f081] rounded-[40px] shadow-[0px_4px_0px_0px_#a4cf5a] flex items-center justify-center text-[#643629] text-[35px] leading-none hover:translate-y-0.5 hover:shadow-[0px_1px_0px_0px_#a4cf5a] transition-all"
          >
            Get Started
          </button>
        </div>
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

/*~~~ TO REVISIT ~~~*/
// export default function App() {
//   const [showStartScreen, setShowStartScreen] = useState(true);
//   const [activeTab, setActiveTab] = useState("cash");

//   if (showStartScreen) {
//     return <StartScreen onGetStarted={() => setShowStartScreen(false)} />;
//   }

//   return (
//     <div className="min-h-screen bg-[#ffffc1] p-0 flex items-center justify-center">
//       <Analytics mode="production" />
//       <div className="w-[393px] min-h-[852px] bg-[#ffffc1] overflow-y-auto">
//         <div className="py-[38px] space-y-4">
//           {/* Tab Navigation */}
//           <div className="w-[347px] mx-auto">
//             <div className="bg-[#a4cf5a] h-[35px] rounded-[40px] relative">
//               <div className="absolute inset-x-[3px] top-[2.5px] bottom-[2.5px] flex gap-1">
//                 <TabButton
//                   active={activeTab === "cash"}
//                   onClick={() => setActiveTab("cash")}
//                 >
//                   Cash Float
//                 </TabButton>
//                 <TabButton
//                   active={activeTab === "settlement"}
//                   onClick={() => setActiveTab("settlement")}
//                 >
//                   Settlement
//                 </TabButton>
//               </div>
//             </div>
//           </div>

//           {/* Content */}
//           <div className="pb-[25px]">
//             {activeTab === "cash" ? <CashFloat /> : <Settlement />}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

export default function App() {
  const [showStartScreen, setShowStartScreen] = useState(true);
  const [activeTab, setActiveTab] = useState("cash");
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getMaxWidth = () => {
    if (screenWidth >= 1150) return '30%';      // Laptop
    if (screenWidth >= 768) return '70%';       // Tablet  
    return '80%';                               // Phone
  };


  if (showStartScreen) {
    return <StartScreen onGetStarted={() => setShowStartScreen(false)} />;
  }

  return (
    <div className="min-h-screen bg-[#ffffc1] p-0 flex flex-col items-center">
      <Analytics mode="production" />
      {/* ADDED FLEXBOX CENTERING CLASSES */}
      <div 
        style={{
          width: '100%',
          maxWidth: getMaxWidth(),
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: '2vh', 
          paddingLeft: '1rem',
          paddingRight: '1rem',
          paddingBottom: '2vh',
        }}
      >
        {/* this container will shrink to fit content. so bc settlement has lesser content, it will be smaller. settlement also uses flex-1 that can shrink */}
        <div className="w-full py-[38px] space-y-4">
          {/* Tab Navigation - changed w-[347px] to w-full */}
          <div className="w-full mx-auto">
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
          <div className="pb-[25px] w-full">
            {activeTab === "cash" ? <CashFloat /> : <Settlement />}
          </div>
        </div>
      </div>
    </div>
  );
}
