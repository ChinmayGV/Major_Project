// 1. Find the elements
const toggle = document.getElementById("dark-mode-toggle");
const body = document.body;
const themeKey = "theme"; // Key for localStorage

// --- 2. ON PAGE LOAD: Apply the saved theme ---

// Get the saved theme from localStorage
const savedTheme = localStorage.getItem(themeKey);

if (savedTheme) {
  // If a theme IS saved in localStorage, use it
  if (savedTheme === "light") {
    body.classList.add("light-mode");
    body.classList.remove("dark-mode");
    toggle.checked = true; // Sync the checkbox
  } else {
    body.classList.add("dark-mode");
    body.classList.remove("light-mode");
    toggle.checked = false; // Sync the checkbox
  }
} else {
  // If NO theme is saved, use your OS preference logic as a ONE-TIME default
  const prefersDark =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  if (prefersDark) {
    body.classList.add("dark-mode");
    toggle.checked = false;
  } else {
    body.classList.add("light-mode");
    toggle.checked = true;
  }
}

// --- 3. ON TOGGLE CLICK: Save the new choice ---

toggle.addEventListener("change", () => {
  let newTheme;
  if (toggle.checked) {
    // If checked, it's light mode
    body.classList.add("light-mode");
    body.classList.remove("dark-mode");
    newTheme = "light";
  } else {
    // If not checked, it's dark mode
    body.classList.add("dark-mode");
    body.classList.remove("light-mode");
    newTheme = "dark";
  }

  // **THE FIX:** Save the user's choice to localStorage
  localStorage.setItem(themeKey, newTheme);
});
