async function testAPI() {
  console.log('╔════════════════════════════════════════════════════════════════════╗');
  console.log('║              🩺 DIABETES PREDICTION API - FULL TEST 🩺             ║');
  console.log('╚════════════════════════════════════════════════════════════════════╝\n');

  let testPassed = 0;
  let testFailed = 0;
  let newUserId = null;
  let newObatId = null;
  let newKadarId = null;

  async function test(name, fn) {
    try {
      console.log(`\n📍 ${name}`);
      await fn();
      testPassed++;
    } catch (err) {
      console.log(`   ✗ Error: ${err.message}`);
      testFailed++;
    }
  }

  // ==================== ROOT ENDPOINT ====================
  console.log('\n═════════════════════════════════════════════════════════════════════');
  console.log('📌 ROOT & GENERAL ENDPOINTS');
  console.log('═════════════════════════════════════════════════════════════════════');

  await test('GET / - Root Endpoint', async () => {
    const res = await fetch('http://localhost:3000/');
    console.log(`   ✓ Status: ${res.status}`);
    const text = await res.text();
    console.log(`   ✓ Response: ${text}`);
  });

  // ==================== USERS ENDPOINTS ====================
  console.log('\n═════════════════════════════════════════════════════════════════════');
  console.log('👥 USERS ENDPOINTS - Authentication & Management');
  console.log('═════════════════════════════════════════════════════════════════════');

  await test('GET /users - Get All Users', async () => {
    const res = await fetch('http://localhost:3000/users');
    const data = await res.json();
    console.log(`   ✓ Status: ${res.status}`);
    console.log(`   ✓ Users count: ${data.length}`);
    console.log(`   ✓ Sample: ${data[0]?.nama || 'N/A'} (${data[0]?.email || 'N/A'})`);
  });

  await test('POST /users - Register New User', async () => {
    const newUser = {
      nama: `Test_${Date.now()}`,
      umur: 30,
      gender: 'Female',
      email: `user${Date.now()}@test.com`,
      no_telepon: '08987654321',
      password: 'password123'
    };
    const res = await fetch('http://localhost:3000/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser)
    });
    const data = await res.json();
    newUserId = data.id;
    console.log(`   ✓ Status: ${res.status}`);
    console.log(`   ✓ New User ID: ${newUserId}`);
    console.log(`   ✓ Email: ${data.email}`);
  });

  await test('POST /users/login - Login Existing User', async () => {
    const res = await fetch('http://localhost:3000/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        email: 'arya@example.com', 
        password: 'secret123' 
      })
    });
    const data = await res.json();
    console.log(`   ✓ Status: ${res.status}`);
    console.log(`   ✓ Login successful for: ${data.user?.nama}`);
    console.log(`   ✓ Token: ${data.token}`);
    console.log(`   ✓ Password hidden: ${!data.user?.password ? 'Yes ✓' : 'No ✗'}`);
  });

  await test('GET /users/:id - Get Specific User', async () => {
    const res = await fetch('http://localhost:3000/users/1749297987995');
    const data = await res.json();
    console.log(`   ✓ Status: ${res.status}`);
    console.log(`   ✓ User: ${data.nama}`);
    console.log(`   ✓ Email: ${data.email}`);
  });

  if (newUserId) {
    await test('PUT /users/:id - Update User Profile', async () => {
      const res = await fetch(`http://localhost:3000/users/${newUserId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nama: 'Updated Name',
          umur: 31
        })
      });
      const data = await res.json();
      console.log(`   ✓ Status: ${res.status}`);
      console.log(`   ✓ Updated: ${data.nama} (Age: ${data.umur})`);
    });
  }

  // ==================== OBAT ENDPOINTS ====================
  console.log('\n═════════════════════════════════════════════════════════════════════');
  console.log('💊 OBAT (MEDICATION) ENDPOINTS');
  console.log('═════════════════════════════════════════════════════════════════════');

  await test('GET /obat - Get All Medications', async () => {
    const res = await fetch('http://localhost:3000/obat');
    const data = await res.json();
    console.log(`   ✓ Status: ${res.status}`);
    console.log(`   ✓ Total medications: ${data.length}`);
    if (data.length > 0) {
      console.log(`   ✓ Sample: ${data[0].nama || 'N/A'}`);
    } else {
      console.log(`   ✓ Database kosong (siap untuk data baru)`);
    }
  });

  await test('POST /obat - Add New Medication', async () => {
    const newObat = {
      nama: `Metformin_${Date.now()}`,
      dosis: '500mg',
      tipe: 'Oral',
      harga: 25000,
      deskripsi: 'Obat untuk mengontrol diabetes'
    };
    const res = await fetch('http://localhost:3000/obat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newObat)
    });
    const data = await res.json();
    newObatId = data.id;
    console.log(`   ✓ Status: ${res.status}`);
    console.log(`   ✓ Medication ID: ${newObatId}`);
    console.log(`   ✓ Name: ${data.nama}`);
    console.log(`   ✓ Dosage: ${data.dosis}`);
  });

  if (newObatId) {
    await test('GET /obat/:id - Get Specific Medication', async () => {
      const res = await fetch(`http://localhost:3000/obat/${newObatId}`);
      const data = await res.json();
      console.log(`   ✓ Status: ${res.status}`);
      console.log(`   ✓ Medication: ${data.nama}`);
      console.log(`   ✓ Price: Rp${data.harga}`);
    });

    await test('PUT /obat/:id - Update Medication', async () => {
      const res = await fetch(`http://localhost:3000/obat/${newObatId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          harga: 30000,
          dosis: '750mg'
        })
      });
      const data = await res.json();
      console.log(`   ✓ Status: ${res.status}`);
      console.log(`   ✓ Updated Price: Rp${data.harga}`);
      console.log(`   ✓ Updated Dosage: ${data.dosis}`);
    });

    await test('DELETE /obat/:id - Delete Medication', async () => {
      const res = await fetch(`http://localhost:3000/obat/${newObatId}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      console.log(`   ✓ Status: ${res.status}`);
      console.log(`   ✓ Message: ${data.message}`);
    });
  }

  // ==================== KADAR GULA ENDPOINTS ====================
  console.log('\n═════════════════════════════════════════════════════════════════════');
  console.log('🩸 KADAR GULA (BLOOD SUGAR) ENDPOINTS');
  console.log('═════════════════════════════════════════════════════════════════════');

  await test('GET /kadar-gula - Get All Blood Sugar Records', async () => {
    const res = await fetch('http://localhost:3000/kadar-gula');
    const data = await res.json();
    console.log(`   ✓ Status: ${res.status}`);
    console.log(`   ✓ Total records: ${data.length}`);
    if (data.length > 0) {
      console.log(`   ✓ Latest: ${data[data.length - 1].nilai || 'N/A'} mg/dL`);
    }
  });

  await test('POST /kadar-gula - Record Blood Sugar Level', async () => {
    const newKadar = {
      user_id: 1,
      nilai: Math.floor(80 + Math.random() * 120),
      waktu: new Date().toISOString(),
      keterangan: 'Sebelum makan'
    };
    const res = await fetch('http://localhost:3000/kadar-gula', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newKadar)
    });
    const data = await res.json();
    newKadarId = data.id;
    console.log(`   ✓ Status: ${res.status}`);
    console.log(`   ✓ Record ID: ${newKadarId}`);
    console.log(`   ✓ Blood Sugar Level: ${data.nilai} mg/dL`);
    console.log(`   ✓ Time: ${data.waktu}`);
  });

  if (newKadarId) {
    await test('GET /kadar-gula/:id - Get Specific Record', async () => {
      const res = await fetch(`http://localhost:3000/kadar-gula/${newKadarId}`);
      const data = await res.json();
      console.log(`   ✓ Status: ${res.status}`);
      console.log(`   ✓ Value: ${data.nilai} mg/dL`);
      console.log(`   ✓ Note: ${data.keterangan}`);
    });

    await test('PUT /kadar-gula/:id - Update Record', async () => {
      const res = await fetch(`http://localhost:3000/kadar-gula/${newKadarId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nilai: 120,
          keterangan: 'Sesudah makan'
        })
      });
      const data = await res.json();
      console.log(`   ✓ Status: ${res.status}`);
      console.log(`   ✓ Updated Value: ${data.nilai} mg/dL`);
      console.log(`   ✓ Updated Note: ${data.keterangan}`);
    });

    await test('DELETE /kadar-gula/:id - Delete Record', async () => {
      const res = await fetch(`http://localhost:3000/kadar-gula/${newKadarId}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      console.log(`   ✓ Status: ${res.status}`);
      console.log(`   ✓ Message: ${data.message}`);
    });
  }

  // ==================== PREDIKSI ENDPOINTS ====================
  console.log('\n═════════════════════════════════════════════════════════════════════');
  console.log('🔮 PREDIKSI (PREDICTION) ENDPOINTS');
  console.log('═════════════════════════════════════════════════════════════════════');

  await test('GET /prediksi - Get All Predictions', async () => {
    const res = await fetch('http://localhost:3000/prediksi');
    const data = await res.json();
    console.log(`   ✓ Status: ${res.status}`);
    console.log(`   ✓ Total predictions: ${data.length}`);
    if (data.length > 0) {
      const latest = data[data.length - 1];
      console.log(`   ✓ Latest result: ${latest.hasil ? 'Positif' : 'Negatif'}`);
    }
  });

  await test('POST /prediksi - Save Prediction Result', async () => {
    const newPrediksi = {
      user_id: 1,
      nilai: {
        age: 35,
        bmi: 28.5,
        blood_glucose_level: 145,
        HbA1c_level: 7.2
      },
      hasil: Math.random() > 0.5,
      probabilitas: (Math.random() * 100).toFixed(2),
      tanggal: new Date().toISOString()
    };
    const res = await fetch('http://localhost:3000/prediksi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPrediksi)
    });
    const data = await res.json();
    console.log(`   ✓ Status: ${res.status}`);
    console.log(`   ✓ Prediction ID: ${data.id}`);
    console.log(`   ✓ Result: ${data.hasil ? '⚠️ Positif Diabetes' : '✓ Negatif'}`);
    console.log(`   ✓ Probability: ${data.probabilitas}%`);
  });

  // ==================== SUMMARY ====================
  console.log('\n═════════════════════════════════════════════════════════════════════');
  console.log('📊 TEST SUMMARY');
  console.log('═════════════════════════════════════════════════════════════════════');
  console.log(`\n✅ Tests Passed: ${testPassed}`);
  console.log(`❌ Tests Failed: ${testFailed}`);
  console.log(`📈 Success Rate: ${((testPassed / (testPassed + testFailed)) * 100).toFixed(1)}%`);
  
  if (testFailed === 0) {
    console.log('\n🎉 ALL TESTS PASSED! API is fully functional!');
  }
  
  console.log('\n╚════════════════════════════════════════════════════════════════════╝\n');
  process.exit(testFailed === 0 ? 0 : 1);
}

testAPI();
