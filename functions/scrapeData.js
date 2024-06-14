/* eslint-disable */
const axios = require("axios");
const cheerio = require("cheerio");

const NYTUrl = "https://www.nytimes.com/puzzles/letter-boxed";
async function scrapePuzzleData() {
	let response, html, $, scriptText, gameData;
	try {
		response = await axios.get(NYTUrl);
		html = response.data;
		
		// Load HTML into cheerio
		$ = cheerio.load(html);
	} catch (error) {
		console.error("Error fetching puzzle data:", error);
		return null;
	}

	try {
		scriptText = $("script").filter((i, el) => {
			return $(el).html().includes("window.gameData");
		}).html();

		if (scriptText) {
			// Parse the JSON object
			gameData = JSON.parse(scriptText.split("=")[1]);
			return gameData;
		} else {
			console.error("Failed to extract gameData object from HTML.");
			return null;
		}
	} catch (error) {
		console.error("Error parsing puzzle data:", error);
		return null;
	}
}

module.exports = scrapePuzzleData;
/* eslint-enable */
