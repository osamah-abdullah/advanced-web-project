import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Login from "./components/Login";
import Main from "./components/Main";
import Signup from "./components/Signup";
import PopulationChart from "./components/Populationchart";

function App() {
  return (
    <Router>
        <main className="flex-1">
          <Routes>
            <Route path="/main" element={<Main />} />
            <Route path="/village" element={<PopulationChart />} />
            <Route path="/chat" element={<div>Chat Component</div>} />
            <Route path="/gallery" element={<div>Gallery Component</div>} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </main>
      
    </Router>
  );
}

export default App;
