// ===== login.js (versi terhubung backend) =====
import { API_BASE_URL } from '../main.js';

export function renderLogin() {
  document.getElementById("app").innerHTML = `
    <section class="screen">
      <button class="back-btn" id="btn-back" title="Kembali">
        <i class="fas fa-arrow-left"></i>
      </button>
      <div class="logo-group">
        <img src="./assets/logo.png" class="logo-icon" />
      </div>
      <h2>Login</h2>
      <p style="font-size:0.9rem; color:#fefefe;">Welcome back! Please login to your account</p>
      <form id="login-form" class="form-grid">
        <div class="input-icon">
          <i class="fas fa-envelope"></i>
          <input type="email" placeholder="Email address" required />
        </div>
        <div class="input-icon">
          <i class="fas fa-lock"></i>
          <input type="password" id="login-password" placeholder="Password" required />
          <button type="button" class="toggle-password" tabindex="-1">
            <i class="fas fa-eye"></i>
          </button>
        </div>
        <button type="submit" class="btn-primary">Login</button>
      </form>
      <small>Don't have an account? <a href="#" id="link-signup">Sign Up</a></small>
    </section>
  `;

  // Toggle password visibility
  document.querySelector('.toggle-password').addEventListener('click', function () {
    const pwd = document.getElementById('login-password');
    const icon = this.querySelector('i');
    if (pwd.type === 'password') {
      pwd.type = 'text';
      icon.classList.remove('fa-eye');
      icon.classList.add('fa-eye-slash');
    } else {
      pwd.type = 'password';
      icon.classList.remove('fa-eye-slash');
      icon.classList.add('fa-eye');
    }
  });

  document.getElementById("btn-back").addEventListener("click", () => {
    import('./opening.js').then(m => m.renderOpening());
  });

  document.getElementById("link-signup").addEventListener("click", (e) => {
    e.preventDefault();
    import('./signup.js').then(m => m.renderSignup());
  });

  document.getElementById("login-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.querySelector('input[type="email"]').value;
    const password = document.getElementById('login-password').value;

    try {
      const response = await fetch("https://apidiaw-production.up.railway.app/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      if (!response.ok) throw new Error("Login gagal");
      const data = await response.json();
      // Simpan token dan data user jika perlu
      localStorage.setItem("token", data.token);
      localStorage.setItem("profileData", JSON.stringify(data.user));
      // Redirect ke dashboard
      import('./dashboard.js').then(m => m.renderDashboard());
    } catch (err) {
      alert("Login gagal: " + err.message);
    }
  });
}
