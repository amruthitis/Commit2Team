document.getElementById("loginForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const loginMessage = document.getElementById("loginMessage");

  // Simple validation
  if (!email || !password) {
    loginMessage.textContent = "⚠️ Please fill in all fields.";
    loginMessage.style.color = "orange";
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    loginMessage.textContent = "⚠️ Enter a valid email address.";
    loginMessage.style.color = "orange";
    return;
  }

  if (password.length < 6) {
    loginMessage.textContent = "⚠️ Password must be at least 6 characters.";
    loginMessage.style.color = "orange";
    return;
  }

  // Simulated success (you can replace with real backend API later)
  loginMessage.textContent = "✅ Login successful! Redirecting...";
  loginMessage.style.color = "lightgreen";

  // Redirect after 2 sec
  setTimeout(() => {
    window.location.href = "basic.html"; // change to your page
  }, 2000);
});
