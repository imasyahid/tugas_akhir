import { renderSidebar, setupSidebarNavigation } from './sidebar.js';

export function renderDashboard() {
  document.getElementById("app").innerHTML = `
    <div class="dashboard-container">
      ${renderSidebar("Dashboard")}
      <main class="dashboard-main">
        <button class="back-btn" id="backDashboard" title="Kembali">
          <i class="fas fa-arrow-left"></i>
        </button>
        <header>
          <h2>Welcome back, ...</h2>
          ...
        </header>
        ...
      </main>
    </div>
  `;

  document.getElementById("backDashboard").addEventListener("click", () => {
    // Arahkan ke opening atau halaman lain sesuai kebutuhan
    import('./opening.js').then(m => m.renderOpening());
  });

  setupSidebarNavigation();
  const profileData = JSON.parse(localStorage.getItem("profileData")) || {};
  const fullName = profileData.nama || "Pengguna";

  document.getElementById("app").innerHTML = `
    <div class="dashboard-container">
      ${renderSidebar("Dashboard")}
      <main class="dashboard-main">
        <header>
          <h2>Welcome back, ${fullName}</h2>
          <p>Bagaimana, hari ini?</p>
        </header>
        <section class="card">
          <h3>Grafik Gula Anda</h3>
          <div class="chart-container">
            <canvas id="glucoseChart"></canvas>
          </div>
        </section>
        <section class="card">
          <h3>Berita</h3>
          <ul id="news-list"></ul>
        </section>
      </main>
    </div>
  `;

  setupSidebarNavigation();

  const riwayat = JSON.parse(localStorage.getItem("riwayatGula")) || [];
  let chartData = [];

  if (riwayat.length === 0) {
    chartData = [{ date: 'Belum Ada Data', value: 0 }];
  } else {
    const sorted = riwayat.sort((a, b) => {
      const dateA = new Date(`${a.tanggal} ${a.time}`);
      const dateB = new Date(`${b.tanggal} ${b.time}`);
      return dateA - dateB;
    });

    chartData = sorted.slice(-7).map(item => ({
      date: `${item.tanggal} ${item.time}`,
      value: parseFloat(item.value)
    }));
  }

  renderGlucoseChart(chartData);
  fetchDiabetesNews();
}

function renderGlucoseChart(data) {
  const ctx = document.getElementById('glucoseChart').getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.map(entry => entry.date),
      datasets: [{
        label: 'Gula Darah (mg/dL)',
        data: data.map(entry => entry.value),
        borderColor: '#e5989b',
        backgroundColor: 'rgba(229, 152, 155, 0.2)',
        tension: 0.3,
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: true }
      },
      scales: {
        y: {
          beginAtZero: true,
          suggestedMax: 200
        }
      }
    }
  });
}

function fetchDiabetesNews() {
  const newsList = document.getElementById('news-list');

  const articles = [
    {
      title: "Mengapa Diabetes Menjadi Masalah Kesehatan",
      url: "https://www.thejakartapost.com/opinion/2025/02/08/why-diabetes-is-a-growing-public-health-concern-in-indonesia.html",
      source: "Jakarta Post",
    },
    {
      title: "Berita Harian Diabetes - CNN Indonesia",
      url: "https://www.cnnindonesia.com/tag/diabetes",
      source: "CNN",
    },
    {
      title: "Topik: Diabetes - Tempo.co",
      url: "https://www.tempo.co/tag/diabetes",
      source: "Tempo",
    },
    {
      title: "Kumpulan Berita Diabetes - Okezone.com",
      url: "https://www.okezone.com/tag/diabetes",
      source: "Okezone",
    },
    {
      title: "Detikcom - Diabetes Hari Ini",
      url: "https://www.detik.com/tag/diabetes",
      source: "Detik",
    },
  ];

  newsList.innerHTML = `
    <div class="news-grid">
      ${articles.map(article => `
        <a class="news-card" href="${article.url}" target="_blank">
          <div class="news-info">
            <h4>${article.title}</h4>
            <span class="news-source">${article.source}</span>
          </div>
        </a>
      `).join('')}
    </div>
  `;
}
