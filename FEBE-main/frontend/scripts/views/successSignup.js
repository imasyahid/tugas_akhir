export function renderSuccessSignup() {
  document.getElementById("app").innerHTML = `
    <section class="screen">
      <div class="logo-group">
        <img src="./assets/logo.png" class="logo-icon" />
      </div>
      <h2>You're Registered!</h2>
      <p style="margin-bottom:1.5rem;">Your account has been successfully created.<br>Please login to continue.</p>
      <button id="btn-login">Go to Login</button>
    </section>
  `;

  document.getElementById("btn-login").addEventListener("click", () => {
    import('./opening.js').then(m => m.renderOpening());
  });
}
