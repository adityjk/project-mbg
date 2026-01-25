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

const fileToGenerativePart = async (path, mimeType) => {
  console.log('[DEBUG] fileToGenerativePart called with path:', path);
  // Handle Cloudinary/Remote URLs
  if (path.startsWith('http')) {
    console.log('[DEBUG] Fetching remote image...', path);
    const response = await fetch(path);
    console.log('[DEBUG] Cloudinary Response Status:', response.status, response.statusText);
    
    if (!response.ok) {
        throw new Error(`Failed to fetch image from Cloudinary. Status: ${response.status}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    console.log('[DEBUG] Image fetched, converting buffer...');
    return {
      inlineData: {
        data: Buffer.from(arrayBuffer).toString("base64"),
        mimeType,
      },
    };
  }
  
  // Handle Local Files
  console.log('[DEBUG] Reading local file...');
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(path)).toString("base64"),
      mimeType,
    },
  };
};

module.exports = { model, fileToGenerativePart };