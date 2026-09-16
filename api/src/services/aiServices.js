const { model, fileToGenerativePart } = require("../config/gemini");

const MAX_RETRIES = 5;
const BASE_DELAY_MS = 1000;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const isTransientError = (err) => {
  const status = Number(err?.status || err?.response?.status || 0);
  return [429, 500, 502, 503, 504].includes(status);
};

const generateContentWithRetry = async (prompt, imagePart) => {
  let lastError;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await model.generateContent([prompt, imagePart]);
    } catch (err) {
      lastError = err;
      const status = err?.status || err?.response?.status;
      console.error(
        `[AI] generateContent attempt ${attempt + 1}/${MAX_RETRIES + 1} failed (status: ${status}, message: ${err.message})`
      );

      if (!isTransientError(err)) {
        throw err;
      }

      if (attempt < MAX_RETRIES) {
        const jitter = Math.floor(Math.random() * 300);
        const delay = Math.min(BASE_DELAY_MS * 2 ** attempt, 15000) + jitter;
        console.warn(`[AI] Retrying in ${delay}ms...`);
        await sleep(delay);
      }
    }
  }

  throw lastError;
};

const analyzeImageGizi = async (filePath, mimeType) => {
  const prompt = `Bertindaklah sebagai Ahli Gizi untuk program makan siang sekolah (Makan Bergizi Gratis).
  Tugasmu adalah menganalisis foto yang diberikan, apakah itu berupa "Dokumen Menu" (teks/tabel) atau "Foto Makanan Asli" (piring/mangkok).

  Instruksi Utama:
  1. Jika gambar adalah **DOKUMEN/TEKS**:
     - Ekstrak data nutrisi secara presisi dari teks yang tersedia.
     - Prioritaskan data dari kolom/bagian 'PM Porsi Besar' jika ada.
     - Jangan mengarang angka jika teks terlihat jelas.

  2. Jika gambar adalah **FOTO MAKANAN ASLI** (Real Food):
     - Lakukan **Estimasi Visual** berdasarkan komponen yang terlihat (Nasi, Lauk, Sayur, Buah).
     - Asumsikan porsi standar siswa sekolah (kurang lebih 400-600 kkal untuk makan siang lengkap).
     - Hitung estimasi kalori dan makronutrisi (Protein, Karbo, Lemak) berdasarkan porsi tersebut.
     - Contoh referensi: Nasi putih 150g (~200 kkal), Ayam goreng 1 potong (~250 kkal), Sayur sop 1 mangkok (~50 kkal).
  
  Format Output Wajib (JSON Murni):
  {
    "nama_menu": "string (Nama menu utama, misal: 'Nasi Ayam Goreng & Sayur Sop')",
    "deskripsi": "string (Jelaskan komponen makanan yang terlihat atau terdeteksi)",
    "kalori": number (Estimasi total dalam kkal, gunakan angka bulat),
    "karbohidrat": number (Estimasi dalam gram),
    "protein": number (Estimasi dalam gram),
    "lemak": number (Estimasi dalam gram),
    "serat": number (Estimasi dalam gram),
    "porsi": "besar" (default untuk menu lengkap),
    "jumlah_porsi": 1
  }

  PENTING: Berikan output HANYA JSON. Tanpa markdown, tanpa teks pembuka/penutup.`;

  try {
    console.log('[DEBUG] Analyzing image:', JSON.stringify({ filePath, mimeType }, null, 2));
    const imagePart = await fileToGenerativePart(filePath, mimeType);
    console.log('[DEBUG] Image converted to generative part');
    
    // Check if imagePart is valid
    if (!imagePart || !imagePart.inlineData || !imagePart.inlineData.data) {
        throw new Error("Gagal mengkonversi gambar (data kosong)");
    }

    const result = await generateContentWithRetry(prompt, imagePart);
    console.log('[DEBUG] Content generated');
    const response = await result.response;
    const text = response.text();
    console.log('[DEBUG] Response text received');

    // Clean the response - remove markdown code blocks if present
    const cleanJson = text.replace(/```json|```/g, "").trim();
    
    const parsedData = JSON.parse(cleanJson);
    
    // Ensure all numeric fields are numbers
    return {
      nama_menu: parsedData.nama_menu || "Menu Tidak Diketahui",
      deskripsi: parsedData.deskripsi || "Tidak ada deskripsi",
      kalori: parseFloat(parsedData.kalori) || 0,
      karbohidrat: parseFloat(parsedData.karbohidrat) || 0,
      protein: parseFloat(parsedData.protein) || 0,
      lemak: parseFloat(parsedData.lemak) || 0,
      serat: parseFloat(parsedData.serat) || 0,
      porsi: parsedData.porsi === "kecil" ? "kecil" : "besar",
      jumlah_porsi: parseInt(parsedData.jumlah_porsi) || 1
    };
  } catch (error) {
    const errorDetail = JSON.stringify(error, Object.getOwnPropertyNames(error), 2);
    console.error("AI Analysis Error Detail (FULL):", errorDetail);
    throw new Error("Gagal menganalisis gambar. Detail Server: " + error.message);
  }
};

module.exports = { analyzeImageGizi };