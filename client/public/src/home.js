// Example: small welcome popup
document.addEventListener("DOMContentLoaded", () => {
  console.log("Home page loaded ✅");
  
  // show a welcome alert once
  if (!localStorage.getItem("visitedHome")) {
    alert("🎉 Welcome to Commit2Team! Find your perfect hackathon team.");
    localStorage.setItem("visitedHome", true);
  }
});
