// 1. Find the checkbox element by its ID
const toggle = document.getElementById("dark-mode-toggle");

// 2. Find the <body> element
const body = document.body;

// 3. Add an event listener that runs when the checkbox's state changes
toggle.addEventListener("change", () => {
  // 4. Check if the checkbox is now "checked"
  if (toggle.checked) {
    // If checked, it's light mode
    body.classList.add("light-mode");
    body.classList.remove("dark-mode");
  } else {
    // If not checked, it's dark mode
    body.classList.add("dark-mode");
    body.classList.remove("light-mode");
  }
});

// --- Optional: Set initial state based on user's OS preference ---
const prefersDark =
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches;

if (prefersDark) {
  body.classList.add("dark-mode");
  toggle.checked = false; // Uncheck the box
} else {
  body.classList.add("light-mode");
  toggle.checked = true; // Check the box
}
