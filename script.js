let engineOn = false;
let apiURL = "http://localhost:8080";

let elements = {
	"start": document.querySelector("#start-engine"),
	"stop": document.querySelector("#stop-engine"),
	"play": document.querySelector("#play-song"),
	"dropdown": document.querySelector("#song-dropdown"),
	"switch": document.querySelector("#bigrange-switch input")
}

function startEngine() {
	if (engineOn) return;
	engineOn = true;

	elements["start"].disabled = true; elements["start"].className = "disabled";

	fetch(new Request(`${apiURL}/startEngine`), {
		method: "POST",
		credentials: "include",
		body: JSON.stringify({
			bigrange: elements["switch"].checked
		}),
		headers: new Headers({"Content-Type": "application/json"})
	}).then((response) => {
		for (let element in elements) {
			elements[element].disabled = false;
			elements[element].className = "";
		}
		elements["start"].disabled = true; elements["start"].className = "disabled";
		elements["switch"].disabled = true;
		document.querySelector("#bigrange-label").style.color = "gray";
		document.querySelector("#bigrange-switch .slider").style.cursor = "default";

		if (!response.ok) throw response;
		return response;
	}).then((response) => {
		return response.text();
	}).then((goodText) => {
		console.log("Successfully started engine.");
	}).catch((response) => {
		response.text().then((errorText) => {
			console.log(errorText);
		});
	});
}

function stopEngine() {
	if (!engineOn) return;
	engineOn = false;

	fetch(new Request(`${apiURL}/stopEngine`), {
		method: "POST",
		credentials: "include"
	}).then((response) => {
		for (let element in elements) {
			elements[element].disabled = true;
			elements[element].className = "disabled";
		}
		elements["start"].disabled = false; elements["start"].className = "";
		elements["switch"].disabled = false;
		document.querySelector("#bigrange-label").style.color = "white";
		document.querySelector("#bigrange-switch .slider").style.cursor = "pointer";

		if (!response.ok) throw response;
		return response;
	}).then((response) => {
		return response.text();
	}).then((goodText) => {
		console.log("Successfully stopped engine.");
	}).catch((response) => {
		response.text().then((errorText) => {
			console.log(errorText);
		});
	});
}

function playSong() {
	if (!engineOn) return;

	fetch(new Request(`${apiURL}/play`), {
		method: "POST",
		credentials: "include",
		body: JSON.stringify({
			song: elements["dropdown"].value,
			bigrange: elements["switch"].checked
		})
	}).then((response) => {
		if (!response.ok) throw response;
		return response;
	}).then((response) => {
		return response.text();
	}).then((goodText) => {
		console.log("Playing song.");
	}).catch((response) => {
		response.text().then((errorText) => {
			console.log(errorText);
		});
	});
}


// If engine is already on, then set button states to proper form
fetch(new Request(`${apiURL}/engineState`), {
	method: "GET",
	credentials: "include"
}).then((response) => {
	return response.json();
}).then((engineState) => {
	if (engineState.active) {
		engineOn = true;

		for (let element in elements) {
			elements[element].disabled = false;
			elements[element].className = "";
		}
		elements["start"].disabled = true; elements["start"].className = "disabled";
		elements["switch"].checked = engineState.bigRange;
		elements["switch"].disabled = true;
		document.querySelector("#bigrange-label").style.color = "gray";
		document.querySelector("#bigrange-switch .slider").style.cursor = "default";
	}
});

// Populate dropdown list with song choices
fetch(new Request(`${apiURL}/songs`), {
	method: "GET",
	credentials: "include"
}).then((response) => {
	return response.json();
}).then((songs) => {
	for (let song of songs) {
		let elem = document.createElement("OPTION");
		elem.textContent = song;
		elem.value = song;
		document.querySelector("#song-dropdown").appendChild(elem);
	}
});
