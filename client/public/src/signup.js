document.getElementById("signupForm").addEventListener("submit", async function(e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const message = document.getElementById("message");
  const submitBtn = document.querySelector('.btn');

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

  // Show loading state
  submitBtn.disabled = true;
  submitBtn.textContent = "Creating Account...";
  message.textContent = "Creating your account...";
  message.style.color = "blue";

  try {
    // Register user with backend
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        password
      })
    });

    const data = await response.json();

    if (data.success) {
      // Store user email in localStorage for portfolio page
      localStorage.setItem('userEmail', email);
      localStorage.setItem('userName', name);
      
      message.textContent = "✅ Signup successful! Redirecting...";
      message.style.color = "lightgreen";
      
      // Redirect to portfolio page
      setTimeout(() => {
        window.location.href = "portfolio.html";
      }, 1500);
    } else {
      message.textContent = `❌ ${data.message}`;
      message.style.color = "red";
    }

  } catch (error) {
    console.error('Signup error:', error);
    message.textContent = "❌ Network error. Please try again.";
    message.style.color = "red";
  } finally {
    // Reset button state
    submitBtn.disabled = false;
    submitBtn.textContent = "Next";
  }
});
