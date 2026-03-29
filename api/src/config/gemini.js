const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');

// Use environment variable for API key
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn("WARNING: GEMINI_API_KEY not set in environment variables!");
}

// Singleton-like initialization via module caching
const genAI = new GoogleGenerativeAI(apiKey || "");
// Use gemini-2.5-flash for AI analysis
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const fileToGenerativePart = async (path, mimeType) => {
  console.log('[DEBUG] fileToGenerativePart called with path:', path);
  // Handle Cloudinary/Remote URLs
  if (path.startsWith('http')) {
    console.log('[DEBUG] Fetching remote image...', path);
    try {
      const response = await fetch(path, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      console.log('[DEBUG] Cloudinary Response Status:', response.status, response.statusText);
      
      if (!response.ok) {
          throw new Error(`Failed to fetch image from Cloudinary. Status: ${response.status} ${response.statusText}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      console.log('[DEBUG] Image fetched, converting buffer...');
      return {
        inlineData: {
          data: Buffer.from(arrayBuffer).toString("base64"),
          mimeType,
        },
      };
    } catch (error) {
      console.error('[CRITICAL] Error fetching remote image:', error);
      throw error;
    }
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