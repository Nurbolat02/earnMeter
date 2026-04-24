import { EarnMeterForm } from "../components/EarnMeterForm";
import { ResultDisplay } from "../components/ResultDisplay";
import { useEarnMeter } from "../hooks/useEarnMeter";
import { Link } from "react-router-dom";
import classes from "./Calculator.module.css";

export default function Calculator() {
  const earnMeter = useEarnMeter();

  return (
    <div className={classes.card}>
      <h1 className={classes.title}>EarnMeter</h1>
      <p className={classes.subtitle}>
        Calculate how many hours you need to work
      </p>
      <EarnMeterForm {...earnMeter} />

      <div className={classes.result}>
        <ResultDisplay {...earnMeter} />

        {earnMeter.isCalculated && (
          <Link className={classes.button} to="/planer">
            Plan shifts
          </Link>
        )}
      </div>
    </div>
  );
}
