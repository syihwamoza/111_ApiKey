const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const crypto = require('crypto');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Koneksi ke MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Binoza2610', // ganti sesuai MySQL kamu
  database: 'apikeys'
});

db.connect((err) => {
  if (err) {
    console.error('❌ Gagal konek ke database:', err);
    return;
  }
  console.log('✅ Terhubung ke MySQL!');
});

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Rute utama
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Endpoint generate API key
app.post('/generate-apikey', (req, res) => {
  const newKey = crypto.randomBytes(16).toString('hex');
  const sql = 'INSERT INTO api_keys (api_key) VALUES (?)';
  db.query(sql, [newKey], (err, results) => {
    if (err) {
      console.error('❌ Gagal simpan API key:', err.message);
      return res.status(500).json({ error: 'Gagal menyimpan API key' });
    }
    res.json({ apiKey: newKey });
  });
});
