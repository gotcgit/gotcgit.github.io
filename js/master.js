(function () {

	// Don't emit events from inside of notes windows
	if (window.location.search.match(/receiver/gi)) { return; }

	var multiplex = Reveal.getConfig().multiplex;
	let ws = new WebSocket(multiplex.url);
	ws.onopen = function (e) {
		// No-op for now
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

	function post() {
		if (ws.readyState === ws.OPEN)
			ws.send(JSON.stringify(Reveal.getState()));
	};

	// post once the page is loaded, so the client follows also on "open URL".
	window.addEventListener('load', post);

	// Monitor events that trigger a change in state
	Reveal.on('slidechanged', post);
	Reveal.on('fragmentshown', post);
	Reveal.on('fragmenthidden', post);
	Reveal.on('overviewhidden', post);
	Reveal.on('overviewshown', post);
	Reveal.on('paused', post);
	Reveal.on('resumed', post);
}());
