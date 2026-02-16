import { API_BASE_URL } from '../main.js';

// Sidebar dan navigasi
function renderSidebar(activeLabel) {
  const items = ["Dashboard", "Profil", "Kadar Gula", "Manajemen Obat", "Prediksi", "Logout"];
  const icons = ["home", "user", "notes-medical", "pills", "chart-line", "sign-out-alt"];
  return `
    <aside class="sidebar">
      <div class="logo-sidebar">
        <img src="./assets/logo.png" class="logo-sidebar-img" />
      </div>
      <nav>
        <ul>
          ${items.map((item, i) => `
            <li class="${item === activeLabel ? "active" : ""}">
              <i class="fas fa-${icons[i]}"></i> ${item}
            </li>
          `).join("")}
        </ul>
      </nav>
    </aside>
  `;
}
function setupSidebarNavigation() {
  document.querySelectorAll(".sidebar li").forEach((item) => {
    const text = item.textContent.trim();
    if (text === "Dashboard") item.addEventListener("click", () => import('./dashboard.js').then(m => m.renderDashboard()));
    if (text === "Profil") item.addEventListener("click", () => import('./profile.js').then(m => m.renderProfileView()));
    if (text === "Kadar Gula") item.addEventListener("click", renderKadarGulaView);
    if (text === "Manajemen Obat") item.addEventListener("click", () => import('./obat.js').then(m => m.renderObatView()));
    if (text === "Logout") item.addEventListener("click", () => { localStorage.removeItem("token"); localStorage.removeItem("profileData"); import('./opening.js').then(m => m.renderOpening()); });
    if (text === "Prediksi") item.addEventListener("click", () => import('./prediksi.js').then(m => m.renderPrediksiView()));
  });
}
function setupBackToDashboard(id) {
  document.getElementById(id)?.addEventListener("click", () => import('./dashboard.js').then(m => m.renderDashboard()));
}

// List riwayat dengan tombol edit
function renderRiwayatList(riwayat) {
  return riwayat.map((item, idx) => `
    <li class="profile-item">
      ${item.time} – ${item.value} mg/dl (${item.tanggal})
      <button class="edit-gula-btn" data-idx="${idx}" title="Edit" style="float:right; background:none; border:none; color:#e5989b; font-size:1.2rem; cursor:pointer;">
        <i class="fas fa-edit"></i>
      </button>
    </li>
  `).join("");
}

// Tampilan utama kadar gula
export function renderKadarGulaView() {
  const riwayat = JSON.parse(localStorage.getItem("riwayatGula")) || [];
  document.getElementById("app").innerHTML = `
    <div class="dashboard-container">
      ${renderSidebar("Kadar Gula")}
      <main class="dashboard-main">
        <header class="profile-header">
          <button class="back-btn" id="backDashboard">←</button>
          <h2>Riwayat Kadar Gula</h2>
        </header>
        <section class="profile-section">
          <ul id="gula-riwayat-list">
            ${renderRiwayatList(riwayat)}
          </ul>
          <button class="save-btn" id="tambahGulaBtn">
            <i class="fas fa-plus-circle"></i> Tambah Kadar Gula
          </button>
        </section>
      </main>
    </div>
  `;
  document.getElementById("tambahGulaBtn").addEventListener("click", renderTambahGulaView);
  setupSidebarNavigation();
  setupBackToDashboard("backDashboard");
  document.querySelectorAll('.edit-gula-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const idx = this.getAttribute('data-idx');
      showEditGulaForm(idx);
    });
  });
}

// Form tambah kadar gula
export function renderTambahGulaView() {
  document.getElementById("app").innerHTML = `
    <div class="dashboard-container">
      ${renderSidebar("Prediksi Gula")}
      <main class="dashboard-main">
        <header class="profile-header">
          <button class="back-btn" id="backRiwayat">←</button>
          <h2>Tambah Kadar Gula</h2>
        </header>
        <section class="profile-section">
          <label>Tanggal</label>
          <input type="date" id="tanggalInput" />
          <label>Jam</label>
          <select id="jamInput">
            <option>08:00</option>
            <option>14:00</option>
            <option>17:00</option>
          </select>
          <label>Kadar Gula (mg/dL)</label>
          <input type="number" id="glucoseLevelInput" placeholder="Contoh: 110" />
          <button class="predict-btn" id="btnPrediksi">Simpan</button>
        </section>
      </main>
    </div>
  `;
  document.getElementById("backRiwayat").addEventListener("click", renderKadarGulaView);
  document.getElementById("btnPrediksi").addEventListener("click", () => {
    const tanggal = document.getElementById("tanggalInput").value;
    const jam = document.getElementById("jamInput").value;
    const glucoseLevel = parseFloat(document.getElementById("glucoseLevelInput").value);
    if (!tanggal || !jam || isNaN(glucoseLevel)) {
      alert("Lengkapi data dengan benar.");
      return;
    }
    const newEntry = { tanggal, time: jam, value: glucoseLevel };
    const existing = JSON.parse(localStorage.getItem("riwayatGula")) || [];
    existing.push(newEntry);
    localStorage.setItem("riwayatGula", JSON.stringify(existing));
    renderKadarGulaView();
  });
  setupSidebarNavigation();
}

// Form edit kadar gula
function showEditGulaForm(idx) {
  const riwayat = JSON.parse(localStorage.getItem("riwayatGula")) || [];
  const data = riwayat[idx];
  if (!data) return;
  document.getElementById("app").innerHTML = `
    <div class="dashboard-container">
      ${renderSidebar("Kadar Gula")}
      <main class="dashboard-main">
        <header class="profile-header">
          <button class="back-btn" id="backEditGula">←</button>
          <h2>Edit Kadar Gula</h2>
        </header>
        <section class="profile-section">
          <form id="edit-gula-form" class="form-grid">
            <label>Tanggal</label>
            <input type="date" id="edit-tanggal" value="${data.tanggal}" required />
            <label>Jam</label>
            <input type="time" id="edit-time" value="${data.time}" required />
            <label>Kadar Gula (mg/dL)</label>
            <input type="number" id="edit-value" value="${data.value}" required min="0" />
            <button type="submit" class="btn-primary">Simpan Perubahan</button>
          </form>
        </section>
      </main>
    </div>
  `;
  document.getElementById("backEditGula").addEventListener("click", renderKadarGulaView);
  document.getElementById("edit-gula-form").addEventListener("submit", function(e) {
    e.preventDefault();
    riwayat[idx] = {
      tanggal: document.getElementById("edit-tanggal").value,
      time: document.getElementById("edit-time").value,
      value: document.getElementById("edit-value").value
    };
    localStorage.setItem("riwayatGula", JSON.stringify(riwayat));
    renderKadarGulaView();
  });
  setupSidebarNavigation();
}
