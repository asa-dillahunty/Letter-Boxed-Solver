// Get all input fields
const inputs = document.querySelectorAll('.letter-input');
const gameData = {
	loaded:false,
}

// Add input event listener to each input field
inputs.forEach((input, index) => {
	
	input.addEventListener('keydown', (e) => {
		if (e.key === 'Backspace' && input.value === '') {
			if (index > 0) {
				inputs[index - 1].focus();
			}
			else { // index === 0
				inputs[inputs.length - 1].focus();
			}
			displaySelectSolve();
		}
	});

	input.addEventListener("focus", () => {
		input.select();
	});

	input.addEventListener('input', (e) => {
		// If the input value is not empty and the next input field exists, focus on it
		const inputValue = e.target.value;
		const lastChar = inputValue[inputValue.length - 1];
		if (!/^[a-zA-Z]*$/.test(lastChar)) {
			e.target.value = ''; // Clear the input value if it's not a letter
		}
		else {
			// force lowercase letters
			if (input.value = input.value.toLowerCase());

			if (input.value !== '') input.classList.remove("isEmpty");
			else input.classList.add('isEmpty');

			if (index === inputs.length - 1) {
				inputs[0].focus();
			}
			if (input.value && inputs[index + 1]) {
				inputs[index + 1].focus();
			}
		}
		displaySelectSolve();
	});
});

// also grab our advanced options and set those up
const dictionaryList = [MASSIVE_DICTIONARY,SCRABBLE_DICTIONARY];
const dictSelect = document.querySelector("#advancedOptions select");
let optionBlob = '';
for (let i=0;i<dictionaryList.length;i++) {
	const start = "dictionaries/".length;
	const end = dictionaryList[i].length - ".json".length;
	optionBlob += `<option value="${dictionaryList[i]}">${dictionaryList[i].substring(start,end)}</option>`
}
dictSelect.innerHTML = optionBlob;

function blockClicks() {
	const blocker = document.getElementById("click-blocker");
	blocker.classList.remove("unblocked");
}

function unblockClicks() {
	const blocker = document.getElementById("click-blocker");
	blocker.classList.add("unblocked");
}

function getTodaysPuzzle () {
	displaySelectSolve();
	if (gameData.loaded && gameData.expiration < Date.now()) {
		// TODO:
		//  	consider alerting the user if I'm not changing anything
		//  	maybe just confirm it's loaded in?

		// reset the sides
		for (let i=0;i<gameData.sides.length;i++) {
			// go through all the sides
			for (let j=0;j<gameData.sides[i].length;j++) {
				// go through every letter
				inputs[i*3 + j].value = gameData.sides[i][j].toLowerCase();
				inputs[i*3 + j].classList.remove("isEmpty");
			}
		}
		return;
	}
	blockClicks();
	gameData.loading = true;

	const customServer = "https://letterboxed.asadillahunty.com/api"
	fetch(customServer).then(response => {
		if (!response.ok) {
			throw new Error('Network response was not ok');
		}
		// Parse the JSON response
		return response.json();
	}).then( (data) => {
		// fill in today's puzzle, and set the dictionary to this one
		for (let i=0;i<data.sides.length;i++) {
			// go through all the sides
			for (let j=0;j<data.sides[i].length;j++) {
				// go through every letter
				inputs[i*3 + j].value = data.sides[i][j].toLowerCase();
				inputs[i*3 + j].classList.remove("isEmpty");
			}
		}

		gameData.sides = data.sides;
		gameData.dictionary = data.dictionary.map( (word) => word.toLowerCase() );
		gameData.todaysSolution = data.ourSolution;
		gameData.expiration = data.expiration; // this is unix epoch time
		gameData.loading = false;
		gameData.loaded = true;

		unblockClicks();
		displaySelectSolve();
	}).catch((error) => {
		unblockClicks();
		console.log(error);
		gameData.loading = false;
	});
}