import { renderSidebar, setupSidebarNavigation, setupBackToDashboard } from './sidebar.js';

export function renderLogoutView() {
  document.getElementById("app").innerHTML = `
    <div class="dashboard-container">
      ${renderSidebar("Logout")}
      <main class="dashboard-main">
        <header class="profile-header">
          <button class="back-btn" id="backDashboard">←</button>
          <h2>Logout</h2>
        </header>

        <section class="profile-section" style="text-align: center;">
          <h3 style="font-weight: bold;">Mau Keluar?</h3>
          <p>Terimakasih ya<br>Semangat</p>

          <div style="margin-top: 2rem; display: flex; justify-content: center; gap: 2rem;">
            <button id="confirmLogout" style="
              padding: 0.9rem 2rem;
              background-color: #e5989b;
              color: white;
              border: none;
              border-radius: 25px;
              font-size: 1rem;
              cursor: pointer;
            ">Ya</button>

            <button id="cancelLogout" style="
              padding: 0.9rem 2rem;
              background-color: #f8f8f8;
              color: #d58c8c;
              border: 2px solid #e5989b;
              border-radius: 25px;
              font-size: 1rem;
              cursor: pointer;
            ">Tidak</button>
          </div>
        </section>
      </main>
    </div>
  `;

  setupSidebarNavigation();
  setupBackToDashboard("backDashboard");

  document.getElementById("confirmLogout").addEventListener("click", () => {
    localStorage.removeItem("token");
    localStorage.removeItem("profileData");
    import('./opening.js').then(m => m.renderOpening());
  });
  document.getElementById("cancelLogout").addEventListener("click", () => {
    import('./dashboard.js').then(m => m.renderDashboard());
  });
}
