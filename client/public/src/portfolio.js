// Function to convert file to base64
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

document.getElementById("portfolioForm").addEventListener("submit", async function(e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const year = document.getElementById("year").value.trim();
  const college = document.getElementById("college").value.trim();
  const gender = document.getElementById("gender").value;
  const skillCategory = document.getElementById("skillCategory").value;
  const fileInput = document.getElementById("portfolioFile");
  const profilePicInput = document.getElementById("profilepic");
  const fileInfo = document.getElementById("fileInfo");
  const submitBtn = document.querySelector('.btn');

  // Validation
  if (!fileInput.files.length) {
    fileInfo.textContent = "⚠️ Please upload your portfolio PDF.";
    fileInfo.style.color = "orange";
    return;
  }

  if (!gender) {
    fileInfo.textContent = "⚠️ Please select your gender.";
    fileInfo.style.color = "orange";
    return;
  }

  if (!skillCategory) {
    fileInfo.textContent = "⚠️ Please select a skill category.";
    fileInfo.style.color = "orange";
    return;
  }


  const file = fileInput.files[0];

  if (file.type !== "application/pdf") {
    fileInfo.textContent = "❌ Only PDF files are allowed.";
    fileInfo.style.color = "red";
    return;
  }

  // Show loading state
  submitBtn.disabled = true;
  submitBtn.textContent = "Uploading Portfolio...";
  fileInfo.textContent = "Uploading your portfolio...";
  fileInfo.style.color = "blue";

  try {
    // Get user email from localStorage
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
      throw new Error('User session expired. Please sign up again.');
    }

    // Convert files to base64
    const resumeBase64 = await fileToBase64(file);
    let profilePicBase64 = '';
    
    if (profilePicInput.files.length > 0) {
      profilePicBase64 = await fileToBase64(profilePicInput.files[0]);
    }

    // Prepare portfolio data
    const portfolioData = {
      year,
      college,
      gender,
      skillCategory: skillCategory,
      profilePic: profilePicBase64,
      resumeFile: resumeBase64
    };

    // Update portfolio in database
    const response = await fetch('http://localhost:5000/api/portfolio/update-portfolio', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: userEmail,
        portfolioData
      })
    });

    const data = await response.json();

    if (data.success) {
      fileInfo.textContent = `✅ ${name}, your portfolio has been uploaded successfully!`;
      fileInfo.style.color = "lightgreen";

      localStorage.setItem('userProfilePic', profilePicBase64);
      // Clear localStorage
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userName');

      // Redirect to the main page after a short delay
      setTimeout(() => {
        window.location.href = "main.html";
      }, 2000);
    } else {
      fileInfo.textContent = `❌ ${data.message}`;
      fileInfo.style.color = "red";
    }

  } catch (error) {
    console.error('Portfolio upload error:', error);
    fileInfo.textContent = "❌ Upload failed. Please try again.";
    fileInfo.style.color = "red";
  } finally {
    // Reset button state
    submitBtn.disabled = false;
    submitBtn.textContent = "Submit";
  }
});

// Pre-fill name from localStorage if available
document.addEventListener('DOMContentLoaded', () => {
  const userName = localStorage.getItem('userName');
  if (userName) {
    document.getElementById('name').value = userName;
  }
});
