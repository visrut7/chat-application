import "./App.css";
import React, { useState, useEffect, useRef } from "react";

interface Message {
  name: string;
  type: string;
  message: string;
}

const App: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [joined, setJoined] = useState<boolean>(false);
  const [users, setUsers] = useState<string[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>("");

  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (joined) {
      ws.current = new WebSocket("ws://localhost:3000");

      ws.current.onopen = () => {
        console.log("Connected to the server");
        ws.current?.send(
          JSON.stringify({ name, type: "user_list", message: "" })
        );
      };

      ws.current.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data.type === "user_list") {
          setUsers(data.users);
        } else if (data.type === "chat_message") {
          setMessages((prevMessages) => [...prevMessages, data]);
        }
      };

      ws.current.onclose = () => {
        console.log("Disconnected from the server");
      };

      return () => {
        ws.current?.close();
      };
    }
  }, [joined, name]);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    setJoined(true);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (ws.current) {
      const messageData = { name, type: "chat_message", message };
      ws.current.send(JSON.stringify(messageData));
      setMessage("");
    }
  };

  return (
    <div className="page">
      {!joined ? (
        <form onSubmit={handleJoin} className="join-form">
          <h1>Join Chat</h1>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            required
          />
          <button type="submit">Join</button>
        </form>
      ) : (
        <div
          style={{ display: "flex", flexDirection: "column", height: "100vh" }}
        >
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              border: "1px solid black",
              padding: "10px",
              width: "1000px",
            }}
          >
            <h2>Chat</h2>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              {messages.map((msg) => (
                <div
                  key={`${msg.name}-${msg.message}`}
                  style={{ border: "1px solid gray", padding: "5px" }}
                >
                  <strong>{msg.name}: </strong>
                  <span>{msg.message}</span>
                </div>
              ))}
            </div>
          </div>
          <form
            style={{
              display: "flex",
              alignItems: "center",
              borderTop: "1px solid black",
              padding: "10px",
            }}
            onSubmit={handleSendMessage}
          >
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message"
              style={{ flex: 1, marginRight: "10px" }}
              required
            />
            <button type="submit">Send</button>
          </form>
          <div
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              border: "1px solid black",
              padding: "10px",
            }}
          >
            <h3>Users</h3>
            <ul>
              {users.map((user) => (
                <li key={user}>{user}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
