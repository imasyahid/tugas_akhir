async function testML() {
  const res = await fetch('http://127.0.0.1:5501/predict', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      age: 30,
      bmi: 25,
      blood_glucose_level: 100,
      gender: 'Male',
      smoking_history: 'No',
      HbA1c_level: 5.5
    })
  });
  console.log('status', res.status);
  const data = await res.json();
  console.log(data);
}

testML().catch(console.error);
