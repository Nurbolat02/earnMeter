import { Routes, Route } from "react-router-dom";
import "./App.css";
import Calculator from "./pages/Calculator.tsx";

function App() {
  return (
    <div className="app">
      <Routes>
        <Route index element={<Calculator />} />
      </Routes>
    </div>
  );
}

export default App;
