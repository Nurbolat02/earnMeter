import { EarnMeterForm } from "../components/EarnMeterForm";
import { ResultDisplay } from "../components/ResultDisplay";
import { useEarnMeter } from "../hooks/useEarnMeter";

export default function Calculator() {
  const earnMeter = useEarnMeter();
  return (
    <div className="card">
      <h1 className="title">EarnMeter</h1>
      <p className="subtitle">Calculate how many hours you need to work</p>

      <EarnMeterForm {...earnMeter} />

      <div className="result">
        <ResultDisplay {...earnMeter} />
      </div>
    </div>
  );
}
