/* eslint-disable */
/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// const {onRequest} = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");

const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const scrapePuzzleData = require("./scrapeData");

const app = express();

app.use(cors({
	origin: "https://letterboxed.asadillahunty.com/", // Allow requests from this origin
	methods: ["GET"], // Allow only GET requests
	allowedHeaders: ["Content-Type"], // Allow only specified headers
}));

// Define route to fetch puzzle data
app.get("/api/", async (_req, res) => {
	try {
		const puzzleData = await scrapePuzzleData();
		res.json(puzzleData);
	} catch (error) {
		console.error("Error fetching puzzle data:", error);
		res.status(500).json({ error: "Internal server error" });
	}
});
app.get('/api/hello', (_req, res) => {
    res.send('Hello, World!');
});

exports.api = functions.https.onRequest(app);
/* eslint-enable */
