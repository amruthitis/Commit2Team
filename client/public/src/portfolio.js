document.getElementById("portfolioForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const year = document.getElementById("year").value.trim();
  const college = document.getElementById("college").value.trim();
  const skillCategory = document.getElementById("skillCategory").value;
  const rating = parseInt(document.getElementById("rating").value, 10);
  const fileInput = document.getElementById("portfolioFile");
  const fileInfo = document.getElementById("fileInfo");

  if (!fileInput.files.length) {
    fileInfo.textContent = "⚠️ Please upload your portfolio PDF.";
    fileInfo.style.color = "orange";
    return;
  }

  if (!skillCategory) {
    fileInfo.textContent = "⚠️ Please select a skill category.";
    fileInfo.style.color = "orange";
    return;
  }

  if (rating < 1 || rating > 10) {
    fileInfo.textContent = "⚠️ Please enter a skill rating between 1 and 10.";
    fileInfo.style.color = "orange";
    return;
  }

  const file = fileInput.files[0];

  if (file.type !== "application/pdf") {
    fileInfo.textContent = "❌ Only PDF files are allowed.";
    fileInfo.style.color = "red";
    return;
  }

  // Show confirmation
  fileInfo.textContent = `✅ ${name}, your portfolio (${file.name}) has been uploaded successfully!`;
  fileInfo.style.color = "lightgreen";

  // Redirect to the main page after a short delay
  setTimeout(() => {
    window.location.href = "main.html";
  }, 2000);
});
