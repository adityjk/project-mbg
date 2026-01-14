const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');

// Use environment variable for API key
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn("WARNING: GEMINI_API_KEY not set in environment variables!");
}

// Singleton-like initialization via module caching
const genAI = new GoogleGenerativeAI(apiKey || "");
// Testing gemini-2.5-flash as originally requested by user
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const fileToGenerativePart = (path, mimeType) => {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(path)).toString("base64"),
      mimeType,
    },
  };
};

module.exports = { model, fileToGenerativePart };