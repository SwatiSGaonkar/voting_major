import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Vote from "./pages/Vote";
import Processing from "./pages/Processing";
import Success from "./pages/Success";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/vote" element={<Vote />} />
      <Route path="/processing" element={<Processing />} />
      <Route path="/success" element={<Success />} />
    </Routes>
  );
}

export default App;