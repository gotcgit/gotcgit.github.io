(function () {
	var multiplex = Reveal.getConfig().multiplex;

	// New websocket
	let ws = new WebSocket(multiplex.url);
	ws.onopen = function (e) {
		// No-op for now
	};

	ws.onmessage = function (event) {
		if (window.location.host === 'localhost:1947') return;
		let obj = JSON.parse(event.data);
		Reveal.setState(obj);
	};

	ws.onclose = function (event) {
		if (event.wasClean) {
			console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
		} else {
			// e.g. server process killed or network down
			// event.code is usually 1006 in this case
			console.log('[close] Connection died');
		}
	};

	ws.onerror = function (error) {
		console.log(`[error] ${error.message}`);
	};
}());
