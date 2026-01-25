require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const testGemini = async () => {
  const apiKey = process.env.GEMINI_API_KEY;
  console.log("Checking API Key exists:", !!apiKey);
  
  if (!apiKey) {
    console.error("❌ GEMINI_API_KEY is missing!");
    return;
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    console.log("Sending test prompt...");
    const result = await model.generateContent("Hello, are you working?");
    const response = await result.response;
    const text = response.text();
    
    console.log("✅ Gemini API Response:", text);
  } catch (error) {
    console.error("❌ Gemini API Error:", error.message);
  }
};

testGemini();
