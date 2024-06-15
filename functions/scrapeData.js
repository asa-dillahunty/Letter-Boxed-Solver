/* eslint-disable */
const axios = require("axios");
const cheerio = require("cheerio");

const NYTUrl = "https://www.nytimes.com/puzzles/letter-boxed";
async function scrapePuzzleData() {
	try {
		const response = await axios.get(NYTUrl);
		const html = response.data;
		
		// Load HTML into cheerio
		const $ = cheerio.load(html);

		const scriptText = $("script").filter((i, el) => {
			return $(el).html().includes("window.gameData");
		}).html();

		if (scriptText) {
			// Parse the JSON object
			const gameData = JSON.parse(scriptText.split("=")[1]);
			return gameData;
		} else {
			console.error("Failed to extract gameData object from HTML.");
			return null;
		}
	} catch (error) {
		console.error("Error fetching puzzle data:", error);
		return null;
	}
}

module.exports = scrapePuzzleData;
/* eslint-enable */
