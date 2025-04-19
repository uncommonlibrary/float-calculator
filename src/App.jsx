import { useState } from "react";
import Calculator from "./Components/Calculator";
import "./App.css";

const App = () => {
  const [showCalculator, setShowCalculator] = useState(false);

  return (
    <>
      {!showCalculator && (
        <>
          <div id="main-display">
            <h1 id="main-title">Float Calculator</h1>
            <img src="./krisswanart.jpg" alt="art by @krisswanart" />
            <br />
            <button
              id="get-started-button"
              onClick={() => setShowCalculator(true)}
            >
              Get Started
            </button>
          </div>
        </>
      )}

      {showCalculator && <Calculator />}
    </>
  );
};

export default App;
