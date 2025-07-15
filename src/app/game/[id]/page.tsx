"use client";
import style from "./page.module.css";
import * as StompJs from "@stomp/stompjs";
import { useRef } from "react";

const connect = (client: React.RefObject<StompJs.Client | null>) => {
  console.log("Connection...");
  client.current = new StompJs.Client({
    //brokerURL: "ws://웹소켓 서버",
    brokerURL: "ws://localhost:3000/ws",
    connectHeaders: {},
    reconnectDelay: 200,
    onConnect: () => {
      console.log("connected");
    },
    onWebSocketError: (error) => {
      console.log("Error with websocket", error);
    },
    onStompError: (frame) => {
      console.dir(`Additional details: ${frame}`);
    },
  });
  console.log("Activating..");
  client.current.activate();
};

const disconnect = (client: React.RefObject<StompJs.Client | null>) => {
  console.log("disconnect..");

  client.current?.deactivate();
};

export default function Page() {
  const client = useRef<StompJs.Client | null>(null);

  return (
    <div className={style.container}>
      게임1의 페이지입니다.
      <div>
        <button
          onClick={() => {
            connect(client);
          }}
        >
          방만들기
        </button>
        <button>입장하기</button>
        <button
          onClick={() => {
            disconnect(client);
          }}
        >
          연결끊기
        </button>
      </div>
    </div>
  );
}
