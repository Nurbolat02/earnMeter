import { Routes, Route } from "react-router-dom";
import "./App.css";
import Calculator from "./pages/Calculator.tsx";
import Planer from "./pages/Planer.tsx";
import { ShiftProvider } from "./context/ShiftContext.tsx";

function App() {
  return (
    <ShiftProvider>
      <div className="app">
        <Routes>
          <Route index element={<Calculator />} />
          <Route path="planer" element={<Planer />} />
        </Routes>
      </div>
    </ShiftProvider>
  );
}

export default App;
