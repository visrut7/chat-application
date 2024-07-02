import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface JoinFormProps {
  setName: React.Dispatch<React.SetStateAction<string>>;
}

const JoinForm: React.FC<JoinFormProps> = ({ setName }) => {
  const [inputName, setInputName] = useState<string>("");
  const navigate = useNavigate();

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    setName(inputName);
    navigate("/chat");
  };

  return (
    <form onSubmit={handleJoin} className="join-form">
      <h1>Join Chat</h1>
      <input
        type="text"
        value={inputName}
        onChange={(e) => setInputName(e.target.value)}
        placeholder="Enter your name"
        required
      />
      <button type="submit">Join</button>
    </form>
  );
};

export default JoinForm;
