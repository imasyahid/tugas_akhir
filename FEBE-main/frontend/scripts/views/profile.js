import { renderSidebar, setupSidebarNavigation, setupBackToDashboard } from './sidebar.js';

export function renderProfileView() {
  const profileData = JSON.parse(localStorage.getItem("profileData")) || {};

  document.getElementById("app").innerHTML = `
    <div class="dashboard-container">
      ${renderSidebar("Profil")}
      <main class="dashboard-main">
        <header class="profile-header">
          <button class="back-btn" id="backDashboard">←</button>
          <h2>Profile</h2>
          <button id="editBtn" class="edit-btn"><i class="fas fa-pen"></i></button>
        </header>

        <section class="profile-section">
          <div class="profile-item"><i class="fas fa-user"></i> ${profileData.nama || "Pengguna"}</div>
          <div class="profile-item"><i class="fas fa-birthday-cake"></i> ${profileData.umur ? profileData.umur + " tahun" : "-"}</div>
          <div class="profile-item"><i class="fas fa-venus-mars"></i> ${profileData.gender || "-"}</div>
          <div class="profile-item"><i class="fas fa-envelope"></i> ${profileData.email || "-"}</div>
          <div class="profile-item"><i class="fas fa-phone"></i> ${profileData.no_telepon || "-"}</div>
        </section>
      </main>
    </div>
  `;

  document.getElementById("editBtn").addEventListener("click", renderEditProfileView);

  setupSidebarNavigation();
  setupBackToDashboard("backDashboard");
}

export function renderEditProfileView() {
  const profileData = JSON.parse(localStorage.getItem("profileData")) || {};

  document.getElementById("app").innerHTML = `
    <div class="dashboard-container">
      ${renderSidebar("Profil")}
      <main class="dashboard-main">
        <header class="profile-header">
          <button class="back-btn" id="backBtn">←</button>
          <h2>Edit Profile</h2>
        </header>

        <section class="profile-section">
          <label>Nama</label>
          <div class="profile-item"><i class="fas fa-user"></i><input type="text" id="editNama" value="${profileData.nama || ''}" placeholder="Nama Lengkap"></div>
          <label>Umur</label>
          <div class="profile-item"><i class="fas fa-birthday-cake"></i><input type="number" id="editUmur" value="${profileData.umur || 0}" placeholder="Umur" min="0"></div>
          <label>Gender</label>
          <div class="profile-item">
            <i class="fas fa-venus-mars"></i>
            <select id="editGender">
              <option value="Male" ${profileData.gender === 'Male' ? 'selected' : ''}>Male</option>
              <option value="Female" ${profileData.gender === 'Female' ? 'selected' : ''}>Female</option>
            </select>
          </div>
          <label>Email</label>
          <div class="profile-item"><i class="fas fa-envelope"></i><input type="email" id="editEmail" value="${profileData.email || ''}" placeholder="Email"></div>
          <label>No. Telepon</label>
          <div class="profile-item"><i class="fas fa-phone"></i><input type="tel" id="editNoTelepon" value="${profileData.no_telepon || ''}" placeholder="No. Telepon"></div>
          <button id="saveProfileBtn" class="save-btn">Simpan Perubahan</button>
        </section>
      </main>
    </div>
  `;

  document.getElementById("saveProfileBtn").addEventListener("click", () => {
    const updatedProfile = {
      ...profileData,
      nama: document.getElementById("editNama").value,
      umur: document.getElementById("editUmur").value,
      gender: document.getElementById("editGender").value,
      email: document.getElementById("editEmail").value,
      no_telepon: document.getElementById("editNoTelepon").value
    };

    localStorage.setItem("profileData", JSON.stringify(updatedProfile));
    alert("Perubahan berhasil disimpan!");
    renderProfileView();
  });

  document.getElementById("backBtn").addEventListener("click", renderProfileView);

  setupSidebarNavigation();
}