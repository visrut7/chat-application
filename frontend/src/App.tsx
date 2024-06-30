import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [name, setName] = useState("");
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<
    | {
        name: string;
        message: string;
      }[]
    | null
  >([]); // Provide an empty array as the default value
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    const websocket = new WebSocket("ws://localhost:3000", "echo-protocol");
    websocket.onopen = () => {
      console.log("Connected to server");
    };
    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      switch (data.type) {
        case "user_list":
          setUsers(data.users);
          break;
        case "chat_message":
          setChat((prevChat) => [
            ...(prevChat ?? []),
            { name: data.name, message: data.message },
          ]);
          break;
      }
    };
    setWs(websocket);

    return () => websocket.close();
  }, []);

  const joinChat = () => {
    if (ws) {
      ws.send(JSON.stringify({ type: "new_user", name }));
    }
  };

  const sendMessage = () => {
    if (ws) {
      ws.send(JSON.stringify({ type: "chat_message", name, message }));
      setMessage("");
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={joinChat}>Join Chat</button>

      <div>
        <h3>Connected Users</h3>
        <ul>
          {users.map((user) => (
            <li key={user}>{user}</li>
          ))}
        </ul>
      </div>

      <div>
        <h3>Chat</h3>
        <div>
          {chat?.map((chat, index) => (
            <p key={`${chat.name}-${index}`}>
              <strong>{chat.name}:</strong> {chat.message}
            </p>
          ))}
        </div>
        <input
          type="text"
          placeholder="Enter your message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default App;
