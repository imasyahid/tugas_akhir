import { API_BASE_URL } from '../main.js';

export function renderPrediksiView() {
  document.getElementById("app").innerHTML = `
    <div class="dashboard-container">
      <main class="dashboard-main">
        <header class="profile-header">
          <button class="back-btn" id="backDashboard">←</button>
          <h2>Prediksi Diabetes</h2>
        </header>
        <section class="profile-section">
          <label>Gender</label>
          <select id="genderInput">
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          <label>Usia</label>
          <input type="number" id="ageInput" placeholder="Usia" min="0" />
          <label>BMI</label>
          <input type="number" step="0.1" id="bmiInput" placeholder="Contoh: 22.5" />
          <label>HbA1c Level (%)</label>
          <input type="number" step="0.1" id="hba1cInput" placeholder="Contoh: 5.6" />
          <label>Blood Glucose Level (mg/dL)</label>
          <input type="number" step="1" id="glucoseLevelInput" placeholder="Contoh: 110" />
          <label>Riwayat Merokok</label>
          <select id="smokingHistoryInput">
            <option value="yes">Yes</option>
            <option value="no">No</option>
            <option value="unknown">Unknown</option>
          </select>
          <button class="predict-btn" id="btnPrediksi">Prediksi</button>

          <div id="predictionResult" style="margin-top: 1rem; font-weight: bold; font-size: 1.1rem;"></div>
        </section>
      </main>
    </div>
  `;

  document.getElementById("btnPrediksi").addEventListener("click", async () => {
    const gender = document.getElementById("genderInput").value;
    const age = parseInt(document.getElementById("ageInput").value);
    const bmi = parseFloat(document.getElementById("bmiInput").value);
    const hba1c = parseFloat(document.getElementById("hba1cInput").value);
    const glucoseLevel = parseFloat(document.getElementById("glucoseLevelInput").value);
    const smokingHistory = document.getElementById("smokingHistoryInput").value;

    const resultBox = document.getElementById("predictionResult");
    resultBox.style.color = "#444";
    resultBox.innerText = "⏳ Memproses prediksi...";

    if (!gender || isNaN(age) || isNaN(bmi) || isNaN(hba1c) || isNaN(glucoseLevel) || !smokingHistory) {
      resultBox.style.color = "#eab308"; // kuning/abu
      resultBox.innerText = "⚠️ Harap lengkapi semua data dengan benar.";
      return;
    }

    try {
      // Mock prediction logic based on blood glucose level
      // Kategori risiko:
      // < 100 mg/dL → Risiko Rendah (Normal) = Negative
      // 100-125 mg/dL → Risiko Sedang (Pra-Diabetes) = Warning
      // >= 126 mg/dL → Risiko Tinggi (Diabetes) = Positive
      
      let prediction = "Negative";
      let resultMessage = "";
      let resultColor = "";

      if (glucoseLevel < 100) {
        prediction = "Negative";
        resultColor = "#16a34a";
        resultMessage = "✅ Risiko Rendah (Normal): Kadar gula Anda normal. Pertahankan gaya hidup sehat!";
      } else if (glucoseLevel >= 100 && glucoseLevel < 126) {
        prediction = "Warning";
        resultColor = "#f59e0b";
        resultMessage = "⚠️ Risiko Sedang (Pra-Diabetes): Kadar gula Anda dalam kondisi pra-diabetes. Mulai perhatikan pola makan dan olahraga.";
      } else if (glucoseLevel >= 126) {
        prediction = "Positive";
        resultColor = "#dc2626";
        resultMessage = "❌ Risiko Tinggi (Diabetes): Kadar gula Anda menunjukkan indikasi diabetes. Segera konsultasi dengan dokter.";
      }

      resultBox.style.color = resultColor;
      resultBox.innerText = resultMessage;

      // Try to fetch from production API if available for more accurate prediction
      try {
        const response = await fetch("https://diawellness-diabetes-api.hf.space/predict", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            gender: gender,
            age: age,
            bmi: bmi,
            HbA1c_level: hba1c,
            blood_glucose_level: glucoseLevel,
            smoking_history: smokingHistory
          })
        });

        if (response.ok) {
          const data = await response.json();
          prediction = data.prediction;
          
          if (prediction === "Negative") {
            resultBox.style.color = "#16a34a"; 
            resultBox.innerText = "✅ Hasil Prediksi: Tidak Terindikasi Diabetes (Negative)";
          } else if (prediction === "Positive") {
            resultBox.style.color = "#dc2626"; 
            resultBox.innerText = "❌ Hasil Prediksi: Terindikasi Diabetes (Positive)";
          }
        }
      } catch (apiError) {
        console.log("Production API not available, using blood glucose category prediction");
      }

    } catch (error) {
      console.error("Prediction error:", error);
      resultBox.style.color = "#dc2626"; 
      resultBox.innerText = `❌ Terjadi kesalahan: ${error.message}`;
    }
  });

  document.getElementById("backDashboard").addEventListener("click", () => {
    import('./dashboard.js').then(m => m.renderDashboard());
  });
}
