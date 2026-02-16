// sidebar.js

export function renderSidebar(activeLabel) {
  const items = ["Dashboard", "Profil", "Kadar Gula", "Manajemen Obat", "Prediksi", "Logout"];
  const icons = ["home", "user", "notes-medical", "pills", "chart-line", "sign-out-alt"];
  return `
    <aside class="sidebar">
      <div class="logo-sidebar">
        <img src="./assets/logo.png" alt="DiaWellnes" class="logo-sidebar-img" />
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

export function setupSidebarNavigation() {
  document.querySelectorAll(".sidebar li").forEach((item) => {
    const text = item.textContent.trim();

    // Event listener untuk setiap item sidebar
    item.addEventListener("click", () => {
      switch (text) {
        case "Dashboard":
          import('./dashboard.js').then(m => m.renderDashboard());
          break;
        case "Profil":
          import('./profile.js').then(m => m.renderProfileView());
          break;
        case "Kadar Gula":
          import('./kadargula.js').then(m => m.renderKadarGulaView());
          break;
        case "Manajemen Obat":
          import('./obat.js').then(m => m.renderObatView());
          break;
        case "Logout":
          import('./logout.js').then(m => m.renderLogoutView());
          break;
        case "Prediksi":
          import('./prediksi.js').then(m => m.renderPrediksiView());
          break;
      }
    });
  });
}

export function setupBackToDashboard(buttonId) {
  const backBtn = document.getElementById(buttonId);
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      import('./dashboard.js').then(m => m.renderDashboard());
    });
  }
}

document.getElementById("app").innerHTML = `
  <div class="dashboard-container">
    ${renderSidebar("Dashboard")}
    <main class="dashboard-main">
      <!-- isi -->
    </main>
  </div>
`;