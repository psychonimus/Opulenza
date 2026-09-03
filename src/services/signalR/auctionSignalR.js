import * as signalR from "@microsoft/signalr";

const HUB_URL = "https://kompasshr.com/OpulenzaReserve/hubs/bidding";

console.log("%c[SignalR] Initializing connection to:", "color: #d4af37; font-weight: bold;", HUB_URL);

const connection = new signalR.HubConnectionBuilder()
    .withUrl(HUB_URL, {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
        accessTokenFactory: () => {
            try {
                const raw = localStorage.getItem("authState");
                if (raw) {
                    const parsed = JSON.parse(raw);
                    return parsed?.accessToken || localStorage.getItem("token") || "";
                }
                return localStorage.getItem("token") || "";
            } catch {
                return localStorage.getItem("token") || "";
            }
        }
    })
    .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
    .configureLogging(signalR.LogLevel.Information)
    .build();

connection.onreconnecting((error) => {
    console.warn("%c[SignalR] Connection lost. Attempting to reconnect...", "color: #f59e0b; font-weight: bold;", error);
});

connection.onreconnected((connectionId) => {
    console.log("%c[SignalR] Connection re-established! Connection ID:", "color: #10b981; font-weight: bold;", connectionId);
});

connection.onclose((error) => {
    console.error("%c[SignalR] Connection closed.", "color: #ef4444; font-weight: bold;", error);
});

export default connection;