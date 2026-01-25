const { model, fileToGenerativePart } = require("../config/gemini");

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

    const result = await model.generateContent([prompt, imagePart]);
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