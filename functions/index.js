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
const getBySlug = require("./polymarketData");

functions.setGlobalOptions({ maxInstances: 2 });

const app = express();

app.use(
  cors({
    origin: [
      "https://letterboxed.asadillahunty.com/",
      "https://www.asadillahunty.com/",
    ], // Allow requests from these origins
    // origin: true, // for testing only
    methods: ["GET"], // Allow only GET requests
    allowedHeaders: ["Content-Type"], // Allow only specified headers
  }),
);

// app.options("*", cors({ origin: true })); // for local testing

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

app.get("/api/polymarket/:slug", async (req, res) => {
  try {
    const slug = req.params.slug;

    if (!slug) {
      return res.status(400).json({ error: "Missing slug parameter" });
    }

    const eventData = await getBySlug(slug);
    res.json(eventData);
  } catch (error) {
    console.error("Error fetching event data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
  // const slug = req.params.slug;
  // const options = { method: "GET" };

  // console.log("Polymarket slug: ", slug);
  // try {
  //   const response = await fetch(
  //     `https://gamma-api.polymarket.com/events/slug/${slug}`,
  //     options,
  //   );

  //   if (!response.ok) {
  //     throw new Error(`Polymarket API error: ${response.status}`);
  //   }

  //   const data = await response.json();
  //   return data;
  // } catch (error) {
  //   console.error("Error getting event data:", error);
  //   return null;
  // }
});

app.get("/api/hello", (_req, res) => {
  res.send("Hello, World!");
});

exports.api = functions.https.onRequest(app);
