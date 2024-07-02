import express, { Request, Response } from "express";
import WebSocket, { WebSocket as WebSocketClient } from "ws";
import * as http from "http";

const app = express();
const port = 3000;

const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

const clients: Map<WebSocketClient, string> = new Map();

wss.on("connection", (ws: WebSocketClient) => {
  ws.on("message", (message: string) => {
    console.log("message", message.toString());
    const data: { username: string; type: string; message: string } =
      JSON.parse(message.toString());
    switch (data.type) {
      case "user_list":
        clients.set(ws, data.username);
        broadcastUserList();
        break;
      case "chat_message":
        broadcastMessage(data);
        break;
    }
  });
});

const broadcastUserList = () => {
  const users: string[] = Array.from(clients.values());
  const message: string = JSON.stringify({ type: "user_list", users });
  clients.forEach((_, ws: WebSocketClient) => ws.send(message));
};

const broadcastMessage = (data: {
  username: string;
  type: string;
  message: string;
}) => {
  const message: string = JSON.stringify(data);
  clients.forEach((_, ws: WebSocketClient) => ws.send(message));
};

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World!");
});

server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
