import { useRef } from "react";
import { useNavigate } from "react-router-dom";

interface JoinFormProps {
  setUsername: React.Dispatch<React.SetStateAction<string>>;
}

const JoinForm: React.FC<JoinFormProps> = ({ setUsername }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    setUsername(inputRef.current?.value!);
    navigate("/chat");
  };

  return (
    <form onSubmit={handleJoin} className="join-form">
      <h1>Join Chat</h1>
      <input
        type="text"
        placeholder="Enter your name"
        ref={inputRef}
        required
        autoFocus
      />
      <button type="submit">Join</button>
    </form>
  );
};

export default JoinForm;
