import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import SignUp from "./components/Signup"; // Ensure SignUp exists
import Main from "./components/Main"; // Corrected the import

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/main" element={<Main />} />{" "}
        {/* Correct route name */}
      </Routes>
    </Router>
  );
}

export default App;
