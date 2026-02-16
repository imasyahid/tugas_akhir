const express = require('express');
const cors = require('cors');
const path = require('path');
const fetch = require('node-fetch'); // npm install node-fetch@2
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const userRoutes = require('./routes/users');
const obatRoutes = require('./routes/obat');
const prediksiRoutes = require('./routes/prediksi');
const kadarGulaRoutes = require('./routes/kadar-gula');

app.use('/users', userRoutes);      // Tambahkan baris ini
app.use('/obat', obatRoutes);       // Tambahkan baris ini
app.use('/prediksi', prediksiRoutes);
app.use('/kadar-gula', kadarGulaRoutes);
app.use(express.static(path.join(__dirname, 'public')));

// Root endpoint
app.get('/', (req, res) => {
  res.send('RESTful API is running!');
});

app.post('/predict', async (req, res) => {
  try {
    console.log('Data dari frontend:', req.body); // Tambahkan baris ini untuk melihat data inputan
    // Kirim data ke ML API
    const mlResponse = await fetch('http://127.0.0.1:5501/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    const result = await mlResponse.json();
    // (Opsional) Simpan ke database/file di sini
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Gagal memproses prediksi' });
  }
});

// Error handling global (letakkan di sini, sebelum app.listen)
app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message || "Internal server error" });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

app.get('/kadargula', (req, res) => {
  res.redirect('https://apidiaw-production.up.railway.app/kadar-gula');
});
