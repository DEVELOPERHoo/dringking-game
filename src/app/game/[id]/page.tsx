"use client";
import style from "./page.module.css";
import * as StompJs from "@stomp/stompjs";
import { useRef } from "react";

const connect = (client: React.RefObject<StompJs.Client | null>) => {
  console.log("Connection...");
  client.current = new StompJs.Client({
    //brokerURL: "ws://웹소켓 서버",
    brokerURL: "ws://king-seungkyu.shop/websocket/vi/king",
    connectHeaders: {},
    reconnectDelay: 200,
    onConnect: () => {
      console.log("connected");
      subscribe(client);
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

const subscribe = (client: React.RefObject<StompJs.Client | null>) => {
  console.log("subscribing...");
  client.current?.subscribe("/sub/1234", (message: StompJs.IFrame) => {
    console.log(`> Received message: ${message.body}`);
  });
};

async function CreateGame() {
  const response = await fetch(
    "https://king-seungkyu.shop/vi/king/create-game",
    {
      method: "POST",
      //headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "테스트",
        capacity: 3,
      }),
    }
  );
  if (!response.ok) {
    if (response.status === 404) {
      console.log("오류가 발생하였습니다.");
    }
  }

  const gameNum = await response.json();

  console.log(gameNum);
}

export default function Page() {
  const client = useRef<StompJs.Client | null>(null);

  return (
    <div className={style.container}>
      게임1의 페이지입니다.
      <div>
        <button
          onClick={() => {
            CreateGame();
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
