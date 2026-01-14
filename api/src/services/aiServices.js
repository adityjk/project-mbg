const { model, fileToGenerativePart } = require("../config/gemini");

const analyzeImageGizi = async (filePath, mimeType) => {
  const prompt = `Analisis foto menu makanan bergizi ini.
  Berikan hasil dalam format JSON murni tanpa markdown (tanpa kata kata lain).
  Gunakan struktur ini:
  {
    "nama_menu": "string (nama menu makanan)",
    "deskripsi": "string (deskripsi singkat menu)",
    "kalori": number (dalam kkal),
    "karbohidrat": number (dalam gram),
    "protein": number (dalam gram),
    "lemak": number (dalam gram),
    "serat": number (dalam gram),
    "porsi": "besar" atau "kecil",
    "jumlah_porsi": number
  }
  Ambil data dari bagian 'PM Porsi Besar' jika ada. 
  Jika tidak ada data porsi besar, ambil data yang tersedia.
  Pastikan semua nilai numerik adalah angka, bukan string.`;

  try {
    const imagePart = fileToGenerativePart(filePath, mimeType);
    
    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();

    // Clean the response - remove markdown code blocks if present
    const cleanJson = text.replace(/```json|```/g, "").trim();
    
    const parsedData = JSON.parse(cleanJson);
    
    // Ensure all numeric fields are numbers
    return {
      nama_menu: parsedData.nama_menu || "Menu Tidak Diketahui",
      deskripsi: parsedData.deskripsi || "",
      kalori: parseFloat(parsedData.kalori) || 0,
      karbohidrat: parseFloat(parsedData.karbohidrat) || 0,
      protein: parseFloat(parsedData.protein) || 0,
      lemak: parseFloat(parsedData.lemak) || 0,
      serat: parseFloat(parsedData.serat) || 0,
      porsi: parsedData.porsi === "kecil" ? "kecil" : "besar",
      jumlah_porsi: parseInt(parsedData.jumlah_porsi) || 1
    };
  } catch (error) {
    console.error("AI Analysis Error:", error);
    throw new Error("Gagal menganalisis gambar: " + error.message);
  }
};

module.exports = { analyzeImageGizi };