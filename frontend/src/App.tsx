import "./App.css";
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import JoinForm from "./components/JoinForm";
import Chat from "./components/Chat";

const App: React.FC = () => {
  const [username, setUsername] = useState<string>("");

  return (
    <div className="page">
      <Router>
        <Routes>
          <Route path="/chat" element={<Chat username={username} />} />
          <Route path="/" element={<JoinForm setUsername={setUsername} />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
