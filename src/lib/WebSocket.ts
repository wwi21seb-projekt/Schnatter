import { get, writable } from "svelte/store";
import { serverURL } from "./Store";
import type { UUID } from "crypto";
type State = {
  requests: Array<Request>;
};

export const state = writable<State>({
  requests: [],
});
let webSocketTest: WebSocket | null = null;

//const hostURL = get(serverURL);
const hostURL = "localhost:3000/api"
const chatId: UUID = "5af04939-7cd5-4bb8-aea1-60a6785188f3";

export const connect = () => {
    console.log("Websocket started");
  webSocketTest = new WebSocket("ws://" + hostURL + "/chat?chatId=" + chatId );
  webSocketTest.addEventListener("message", (message: any) => {
    const data: Request = JSON.parse(message.data);
    state.update((state) => ({
      ...state,
      requests: [data].concat(state.requests),
    }));
  });
};


export const sendMessage = (message: string) => {
    if(webSocketTest?.readyState == 1){
        console.log("Message send to socket")
        webSocketTest?.send(message);
    }else{
        console.log("not ready")
    }
    
}