import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Login from "./components/Login";
import Main from "./components/Main";
import Signup from "./components/Signup";
import PopulationChart from "./components/Populationchart";
import Village from "./components/village";
import ErrorBoundary from './components/ErrorBoundary';
import ChatWithAdmins from "./components/Chatwithadmins";
import Gallary from "./components/Gallary";
function App() {
  return (
    <ErrorBoundary>
      <Router>
        <main className="flex-1">
          <Routes>
            <Route path="/main" element={<Main />} />
            <Route path="/village" element={<Village />} />
            <Route path="/chat" element={<ChatWithAdmins />} />
            <Route path="/gallery" element={<Gallary />} />
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </main>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
