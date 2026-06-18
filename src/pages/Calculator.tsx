import classes from "./Calculator.module.css";

export default function Calculator() {
  return (
    <div className={classes.card}>
      <h1 className={classes.title}>EarnMeter</h1>
      <p className={classes.subtitle}>
        Calculate how many hours you need to work
      </p>

      <div className={classes.result}></div>
    </div>
  );
}
