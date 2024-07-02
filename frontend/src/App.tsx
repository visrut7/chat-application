import "./App.css";
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import JoinForm from "./components/JoinForm";
import Chat from "./components/Chat";

const App: React.FC = () => {
  const [name, setName] = useState<string>("");

  return (
    <div className="page">
      <Router>
        <Routes>
          <Route path="/chat" element={<Chat name={name} />} />
          <Route path="/" element={<JoinForm setName={setName} />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
