import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Publications from "./pages/Publications";

function App() {
  const token = localStorage.getItem("token");
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={token ? <Navigate to="/publications" /> : <Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/publications"
          element={token ? <Publications /> : <Navigate to="/" />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;