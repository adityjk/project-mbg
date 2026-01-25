require('dotenv').config();
const { analyzeImageGizi } = require('./src/services/aiServices');

const testAnalysis = async () => {
  // Use a public sample image from Cloudinary demo
  const sampleImageUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Good_Food_Display_-_NCI_Visuals_Online.jpg/800px-Good_Food_Display_-_NCI_Visuals_Online.jpg';
  const mimeType = 'image/jpeg';

  console.log("🚀 Testing analyzeImageGizi with sample URL...");
  console.log("URL:", sampleImageUrl);

  try {
    const result = await analyzeImageGizi(sampleImageUrl, mimeType);
    console.log("✅ Analysis Result:", JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("❌ Test Failed:", error);
  }
};

testAnalysis();
