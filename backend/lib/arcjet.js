import arcjet, { shield, detectBot, slidingWindow } from "@arcjet/node";
import dotenv from "dotenv";

dotenv.config();

const aj = arcjet({
  key: process.env.AJ_API_KEY,
  rules: [
    shield({ mode: "LIVE" }),
    detectBot({
      mode: "LIVE",
      allow: [
        "CATEGORY:SEARCH_ENGINE", // Google, Bing, etc
      ],
    }),
    slidingWindow({
      mode: "LIVE",
      max : 100, // Max 100 requests
      interval: 60
    }),
  ],
});

export default aj;