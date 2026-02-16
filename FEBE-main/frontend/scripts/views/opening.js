export function renderOpening() {
  document.getElementById("app").innerHTML = `
    <main class="opening-main">
      <!-- tampilan opening di sini -->
    </main>
    <div class="decorative-wave"></div>
    <div class="dashboard-container">
      <main class="dashboard-main center-screen">
        <div class="logo-group">
          <img src="./assets/logo.png" class="logo-icon" style="background:transparent; box-shadow:none; border:none;" />
        </div>
        <h2>Let’s get started</h2>
        <p>Login to enjoy the features and <b>STAY HEALTHY!</b></p>
        <div class="btn-group">
          <button id="btn-login" class="btn-secondary">Login</button>
          <button id="btn-signup" class="btn-primary">Sign Up</button>
        </div>
      </main>
    </div>
  `;

  document.getElementById("btn-login").addEventListener("click", () => {
    import('./login.js').then(m => m.renderLogin());
  });

  document.getElementById("btn-signup").addEventListener("click", () => {
    import('./signup.js').then(m => m.renderSignup());
  });
}
