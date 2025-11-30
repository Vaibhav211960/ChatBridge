import { isSpoofedBot } from "@arcjet/inspect";
import  aj  from "../lib/arcjet.js";

export const arcMiddleware = async (req, res) => {
  const decision = await aj.protect(req); // Deduct 5 tokens from the bucket

  if (decision.isDenied()) {
    if (decision.reason.isRateLimit()) return  res.status(429).json({ error: "Too many requests. Please try again later." });
    else if (decision.reason.isBot()) return res.status(400).json({ error: "No bots allowed" })
    else return res.status(403).json({ error: "Forbidden" });
  } else if (decision.results.some(isSpoofedBot)) return res.status(400).json({ error: "No bots allowed" });
    next();
};

export default arcMiddleware;