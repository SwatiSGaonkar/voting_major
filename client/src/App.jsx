import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import VerifyVoter from "./pages/VerifyVoter";
import Vote from "./pages/Vote";
import Processing from "./pages/Processing";
import Success from "./pages/Success";
import Error from "./pages/Error";
import Results from "./pages/Results";
import InvalidCredentials from "./pages/InvalidCredentials";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/verify-voter" element={<VerifyVoter />} />
      <Route path="/verify" element={<VerifyVoter />} />

      <Route path="/vote" element={<Vote />} />
      <Route path="/processing" element={<Processing />} />
      <Route path="/success" element={<Success />} />
      <Route path="/error" element={<Error />} />
      <Route path="/results" element={<Results />} />

      <Route
        path="/invalid-credentials"
        element={<InvalidCredentials />}
      />
    </Routes>
  );
}

export default App;