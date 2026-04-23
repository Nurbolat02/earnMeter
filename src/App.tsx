import { Routes, Route } from "react-router-dom";
import "./App.css";
import Calculator from "./pages/Calculator.tsx";
import Planer from "./pages/Planer.tsx";

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Calculator />} />
        <Route path="planer" element={<Planer />} />
      </Routes>
    </div>
  );
}

export default App;
