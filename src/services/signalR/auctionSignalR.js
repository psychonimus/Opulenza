import * as signalR from "@microsoft/signalr";

const connection = new signalR.HubConnectionBuilder()
    .withUrl("https://opulenza")
    .withAutomaticReconnect()
    .build();

export default connection;