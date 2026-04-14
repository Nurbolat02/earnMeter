import { useState } from "react";
import "./App.css";

function App() {
  const [targetAmount, setTargetAmount] = useState<number>();
  const [hourlyRate, setHourlyRate] = useState<number>();
  const [hoursToWork, setHoursToWork] = useState<number | null>(null);
  const [error, setError] = useState<boolean>(false);

  function handleSubmit(event: React.SubmitEvent<HTMLFormElement>): void {
    event.preventDefault();
    if (!targetAmount || !hourlyRate) return;
    if (targetAmount < 0 || hourlyRate < 0) {
      setError(true);
      return;
    }
    setError(false);
    setHoursToWork(Math.ceil(targetAmount / hourlyRate));
  }

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement>,
    setFunction: React.Dispatch<React.SetStateAction<number | undefined>>,
  ) {
    setFunction(Number(event.target.value));
  }

  return (
    <div className="app">
      <div className="card">
        <h1 className="title">EarnMeter</h1>
        <p className="subtitle">Calculate how many hours you need to work</p>

        <form onSubmit={(event) => handleSubmit(event)} className="form">
          <input
            value={targetAmount}
            onChange={(event) => handleChange(event, setTargetAmount)}
            type="number"
            placeholder="Target amount"
            className="input"
          />

          <input
            value={hourlyRate}
            onChange={(event) => handleChange(event, setHourlyRate)}
            type="number"
            placeholder="Hourly rate"
            className="input"
          />

          <button className="button">Calculate</button>
        </form>

        <div className="result">
          {error ? (
            <strong>Please use only positive numbers</strong>
          ) : (
            <p>
              You need to work{" "}
              <strong>{hoursToWork !== null ? hoursToWork : 0} hours</strong>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
