let engineOn = false;
let apiURL = "http://localhost:8080";

let elements = {
	"start": document.querySelector("#start-engine"),
	"stop": document.querySelector("#stop-engine"),
	"play": document.querySelector("#play-song"),
	"dropdown": document.querySelector("#song-dropdown")
}

function startEngine() {
	if (engineOn) return;
	engineOn = true;

	for (let element in elements) {
		elements[element].disabled = false;
		elements[element].className = "";
	}
	elements["start"].disabled = true; elements["start"].className = "disabled";
}

function stopEngine() {
	if (!engineOn) return;
	engineOn = false;

	for (let element in elements) {
		elements[element].disabled = true;
		elements[element].className = "disabled";
	}
	elements["start"].disabled = false; elements["start"].className = "";
}


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
