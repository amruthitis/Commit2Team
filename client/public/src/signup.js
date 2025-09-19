document.getElementById("signupForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const message = document.getElementById("message");

  // Basic validation
  if (!name || !email || !password || !confirmPassword) {
    message.textContent = "⚠️ Please fill all fields.";
    message.style.color = "orange";
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    message.textContent = "⚠️ Enter a valid email address.";
    message.style.color = "orange";
    return;
  }

  if (password.length < 6) {
    message.textContent = "⚠️ Password must be at least 6 characters.";
    message.style.color = "orange";
    return;
  }

  if (password !== confirmPassword) {
    message.textContent = "⚠️ Passwords do not match.";
    message.style.color = "orange";
    return;
  }

  // Success
  message.textContent = "✅ Signup successful! Redirecting...";
  message.style.color = "lightgreen";
  

  // Simulate redirect
  setTimeout(() => {
    window.location.href = "portfolio.html"; // change to dashboard page later
  }, 2000);
});
