import { useEarnMeter } from "./hooks/useEarnMeter.tsx";
import { EarnMeterForm } from "./components/EarnMeterForm.tsx";
import { ResultDisplay } from "./components/ResultDisplay.tsx";
import "./App.css";

function App() {
  const earnMeter = useEarnMeter();

  return (
    <div className="app">
      <div className="card">
        <h1 className="title">EarnMeter</h1>
        <p className="subtitle">Calculate how many hours you need to work</p>

        <EarnMeterForm {...earnMeter} />

        <div className="result">
          <ResultDisplay {...earnMeter} />
        </div>
      </div>
    </div>
  );
}

export default App;
