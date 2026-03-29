require('dotenv').config();
const { analyzeImageGizi } = require('./src/services/aiServices');
const path = require('path');

const testAnalysis = async () => {
  // Use a local image from uploads folder
  const sampleImagePath = path.join(__dirname, 'uploads', 'menu-1768197605579.jpeg');
  const mimeType = 'image/jpeg';

  console.log("🚀 Testing analyzeImageGizi with LOCAL file...");
  console.log("Path:", sampleImagePath);

  try {
    const result = await analyzeImageGizi(sampleImagePath, mimeType);
    console.log("✅ Analysis Result:", JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("❌ Test Failed:", error);
  }
};

testAnalysis();
