"use client";
import style from "./page.module.css";
import * as StompJs from "@stomp/stompjs";
import { useRef } from "react";

const connect = (
  client: React.RefObject<StompJs.Client | null>,
  gameNum: number
) => {
  console.log("Connection...");
  client.current = new StompJs.Client({
    brokerURL: "wss://king-seungkyu.shop/websocket/v1/king",
    connectHeaders: {},
    reconnectDelay: 5000,
    onConnect: () => {
      console.log("connected");
      subscribe(client, gameNum);
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

const subscribe = (
  client: React.RefObject<StompJs.Client | null>,
  gameNum: number
) => {
  if (client.current?.connected) {
    console.log("subscribing...");
    client.current?.subscribe(`/sub/${gameNum}`, (message: StompJs.IFrame) => {
      console.log(`> Received message: ${message.body}`);
    });
  } else {
    console.warn("❌ STOMP not connected. Cannot subscribe yet.");
  }
};

async function CreateGame(client: React.RefObject<StompJs.Client | null>) {
  const response = await fetch(
    "https://king-seungkyu.shop/v1/king/create-game",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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

  const resData = await response.json();
  const gameNum = resData.gameRoomId;

  connect(client, gameNum);
}

export default function Page() {
  const client = useRef<StompJs.Client | null>(null);

  return (
    <div className={style.container}>
      게임1의 페이지입니다.
      <div>
        <button
          onClick={() => {
            CreateGame(client);
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
