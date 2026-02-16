const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const filePath = path.join(__dirname, '../data/users.json');

// Baca semua user
router.get('/', (req, res) => {
  const data = JSON.parse(fs.readFileSync(filePath));
  res.json(data);
});

// Tambah user
router.post('/', (req, res) => {
  const data = JSON.parse(fs.readFileSync(filePath));
  const newUser = { id: Date.now(), ...req.body };
  data.push(newUser);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  res.status(201).json(newUser);
});

// Ambil user by ID
router.get('/:id', (req, res) => {
  const data = JSON.parse(fs.readFileSync(filePath));
  const user = data.find(u => u.id == req.params.id);
  if (user) res.json(user);
  else res.status(404).json({ message: 'User not found' });
});

// Update user by ID (PUT)
router.put('/:id', (req, res) => {
  const data = JSON.parse(fs.readFileSync(filePath));
  const userIndex = data.findIndex(u => u.id == req.params.id);

  if (userIndex === -1) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Update data user dengan data baru dari req.body
  data[userIndex] = { ...data[userIndex], ...req.body };

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  res.json(data[userIndex]);
});

// Login user
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const data = JSON.parse(fs.readFileSync(filePath));
  const user = data.find(u => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ message: 'Email atau password salah' });
  }
  // Jangan kirim password ke frontend
  const { password: _, ...userWithoutPassword } = user;
  res.json({ user: userWithoutPassword, token: "dummy-token" });
});

module.exports = router;
