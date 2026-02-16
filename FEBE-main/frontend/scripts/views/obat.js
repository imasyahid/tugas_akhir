import { renderSidebar, setupSidebarNavigation, setupBackToDashboard } from './sidebar.js';

export async function renderObatView() {
  // Ambil token jika perlu autentikasi
  const token = localStorage.getItem("token");

  let dataObat = JSON.parse(localStorage.getItem("daftarObat")) || [];
  try {
    // Coba dari backend Railway
    const response = await fetch("https://apidiaw-production.up.railway.app/obat", {
      headers: token ? { "Authorization": `Bearer ${token}` } : {}
    });
    if (response.ok) {
      dataObat = await response.json();
      localStorage.setItem("daftarObat", JSON.stringify(dataObat));
    }
  } catch (err) {
    console.log("Backend tidak tersedia, menggunakan data lokal");
  }

  document.getElementById("app").innerHTML = `
    <div class="dashboard-container">
      ${renderSidebar("Manajemen Obat")}
      <main class="dashboard-main">
        <header class="profile-header">
          <button class="back-btn" id="backDashboard">←</button>
          <h2>Daftar Obat</h2>
        </header>
        <section class="profile-section">
          <button class="save-btn" id="btnTambahObat">
            <i class="fas fa-plus-circle"></i> Tambah Obat
          </button>
          <ul id="listObat">
            ${dataObat.map((obat, i) => `
              <li class="obat-item" data-id="${i}">
                <div class="obat-content">
                  <div class="obat-info" style="cursor:pointer;">
                    <strong>${obat.nama || "-"}</strong>
                    <small>${obat.dosis || "-"} – ${obat.waktu || "-"}</small>
                    ${obat.catatan ? `<small style="display:block; margin-top:4px; font-style:italic;">${obat.catatan}</small>` : ''}
                  </div>
                  <div class="obat-actions">
                    <button class="edit-btn" data-edit="${i}" title="Edit">
                      <i class="fas fa-pen"></i>
                    </button>
                    <button class="delete-btn" data-delete="${i}" title="Hapus">
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              </li>
            `).join("")}
          </ul>
        </section>
      </main>
    </div>
  `;

  document.getElementById("btnTambahObat").addEventListener("click", () => renderTambahObatView());

  // Setup click handlers for medicine info (for details view)
  document.querySelectorAll(".obat-info").forEach((info, index) => {
    info.addEventListener("click", (e) => {
      e.stopPropagation();
      renderDetailObatView(dataObat[index]);
    });
  });

  // Setup edit button handlers
  document.querySelectorAll(".edit-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      e.stopPropagation();
      const i = btn.dataset.edit;
      renderTambahObatView(dataObat[i], i);
    });
  });

  // Setup delete button handlers
  document.querySelectorAll(".delete-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      e.stopPropagation();
      const i = btn.dataset.delete;
      if (confirm(`Apakah Anda yakin ingin menghapus obat "${dataObat[i].nama}"?`)) {
        const list = [...dataObat];
        list.splice(i, 1);
        localStorage.setItem("daftarObat", JSON.stringify(list));
        renderObatView(); // Re-render the view
      }
    });
  });

  setupSidebarNavigation();
  setupBackToDashboard("backDashboard");
}

export function renderTambahObatView(obatEdit = null, editIndex = null) {
  document.getElementById("app").innerHTML = `
    <div class="dashboard-container">
      ${renderSidebar("Manajemen Obat")}
      <main class="dashboard-main">
        <header class="profile-header">
          <button class="back-btn" id="backObat">←</button>
          <h2>${editIndex !== null ? "Edit" : "Tambah"} Obat</h2>
        </header>
        <section class="profile-section">
          <label>Nama Obat</label>
          <input type="text" id="namaInput" value="${obatEdit?.nama || ""}" placeholder="Contoh: Metformin 500 mg">
          
          <label>Dosis</label>
          <input type="text" id="dosisInput" value="${obatEdit?.dosis || ""}" placeholder="Contoh: 2 butir">
          
          <label>Waktu Konsumsi</label>
          <input type="text" id="waktuInput" value="${obatEdit?.waktu || ""}" placeholder="Contoh: pagi dan malam">
          
          <label>Catatan (Opsional)</label>
          <input type="text" id="catatanInput" value="${obatEdit?.catatan || ""}" placeholder="Contoh: minum setelah makan">
          
          <button class="save-btn" id="simpanObat">
            <i class="fas fa-save"></i> Simpan Obat
          </button>
        </section>
      </main>
    </div>
  `;

  document.getElementById("backObat").addEventListener("click", renderObatView);

  document.getElementById("simpanObat").addEventListener("click", async () => {
    const nama = document.getElementById("namaInput").value.trim();
    const dosis = document.getElementById("dosisInput").value.trim();
    const waktu = document.getElementById("waktuInput").value.trim();
    const catatan = document.getElementById("catatanInput").value.trim();

    if (!nama || !dosis || !waktu) {
      alert("Harap lengkapi Nama Obat, Dosis, dan Waktu Konsumsi!");
      return;
    }

    const obat = { nama, dosis, waktu, catatan };

    try {
      const response = await fetch("https://apidiaw-production.up.railway.app/obat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(obat)
      });
      if (!response.ok) throw new Error("Gagal menambah obat");
      alert("Obat berhasil ditambahkan!");
      renderObatView();
    } catch (err) {
      alert("Gagal menambah obat: " + err.message);
    }
  });

  setupSidebarNavigation();
}

export function renderDetailObatView(obat) {
  document.getElementById("app").innerHTML = `
    <div class="dashboard-container">
      ${renderSidebar("Manajemen Obat")}
      <main class="dashboard-main">
        <header class="profile-header">
          <button class="back-btn" id="backObat">←</button>
          <h2>Detail Obat</h2>
        </header>
        <section class="profile-section">
          <div style="margin-bottom: var(--spacing-xl);">
            <h3 style="color: var(--primary-color); margin-bottom: var(--spacing-lg);">${obat.nama}</h3>
            
            <div style="margin-bottom: var(--spacing-lg);">
              <strong style="display: block; margin-bottom: var(--spacing-xs);">Dosis:</strong>
              <span>${obat.dosis}</span>
            </div>
            
            <div style="margin-bottom: var(--spacing-lg);">
              <strong style="display: block; margin-bottom: var(--spacing-xs);">Waktu Konsumsi:</strong>
              <span>${obat.waktu}</span>
            </div>
            
            <div style="margin-bottom: var(--spacing-lg);">
              <strong style="display: block; margin-bottom: var(--spacing-xs);">Catatan:</strong>
              <span>${obat.catatan || "Tidak ada catatan"}</span>
            </div>
          </div>
          
          <button class="save-btn" id="backToList">
            <i class="fas fa-arrow-left"></i> Kembali ke Daftar
          </button>
        </section>
      </main>
    </div>
  `;

  // Back to medicine list
  document.getElementById("backObat").addEventListener("click", renderObatView);
  document.getElementById("backToList").addEventListener("click", renderObatView);

  setupSidebarNavigation();
}