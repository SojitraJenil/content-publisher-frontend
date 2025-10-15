import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";
import Publications from "./pages/publications/Publications";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem("token"));
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            token ? (
              <Navigate to="/publications" replace />
            ) : (
              <Login setToken={setToken} />
            )
          }
        />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/publications"
          element={
            token ? <Publications setToken={setToken} /> : <Navigate to="/" replace />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
