let ws: WebSocket | null = null;

export function getWebSocket(): WebSocket {
	if (!ws) {
		ws = new WebSocket(`wss://${window.location.host}/ws/`);
		ws.onopen = () => {
			console.log("WebSocket connecté !");
		};
		ws.onerror = (err) => {
			console.error("WebSocket erreur:", err);
		};
	}
	return ws;
}
