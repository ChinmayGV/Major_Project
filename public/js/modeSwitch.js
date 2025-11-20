// ==========================JUST BUTTON FUNCTION ==========================

// const previewBtn = document.getElementById("togglePreviewBtn");
// const previewIcon = previewBtn.querySelector("i");
// const hoverText = document.getElementById("hoverText");

// previewBtn.addEventListener("click", () => {
//   // Click animation
//   previewBtn.classList.add("toggle-anim");
//   setTimeout(() => previewBtn.classList.remove("toggle-anim"), 350);

//   // Toggle logic
//   if (previewIcon.classList.contains("fa-moon")) {
//     previewIcon.classList.replace("fa-moon", "fa-sun");
//     previewBtn.classList.remove("moon-mode");
//     previewBtn.classList.add("sun-mode");
//     hoverText.textContent = "Light Mode";
//   } else {
//     previewIcon.classList.replace("fa-sun", "fa-moon");
//     previewBtn.classList.remove("sun-mode");
//     previewBtn.classList.add("moon-mode");
//     hoverText.textContent = "Dark Mode";
//   }
// });

// ========================END HERE =====================================

const previewBtn = document.getElementById("togglePreviewBtn");
const previewIcon = previewBtn.querySelector("i");
const hoverText = document.getElementById("hoverText");

/* ---------------- LOAD SAVED THEME ----------------- */
const savedMode = localStorage.getItem("theme-mode");

if (savedMode === "moon") {
  previewBtn.classList.remove("sun-mode");
  previewBtn.classList.add("moon-mode");
  previewIcon.classList.replace("fa-sun", "fa-moon");
  hoverText.textContent = "Dark Mode";
} else {
  previewBtn.classList.remove("moon-mode");
  previewBtn.classList.add("sun-mode");
  previewIcon.classList.replace("fa-moon", "fa-sun");
  hoverText.textContent = "Light Mode";
}

/* ---------------- TOGGLE MODE ----------------- */
previewBtn.addEventListener("click", () => {
  // Animation
  previewBtn.classList.add("toggle-anim");
  setTimeout(() => previewBtn.classList.remove("toggle-anim"), 350);

  if (previewIcon.classList.contains("fa-moon")) {
    // Switch to Sun Mode
    previewIcon.classList.replace("fa-moon", "fa-sun");
    previewBtn.classList.remove("moon-mode");
    previewBtn.classList.add("sun-mode");
    hoverText.textContent = "Light Mode";

    localStorage.setItem("theme-mode", "sun");
  } else {
    // Switch to Moon Mode
    previewIcon.classList.replace("fa-sun", "fa-moon");
    previewBtn.classList.remove("sun-mode");
    previewBtn.classList.add("moon-mode");
    hoverText.textContent = "Dark Mode";

    localStorage.setItem("theme-mode", "moon");
  }
  location.reload();
});
