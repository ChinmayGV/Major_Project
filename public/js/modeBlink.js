const mode = localStorage.getItem("theme-mode");
// console.log("i clicked");

if (mode === "moon") {
  document.documentElement.classList.add("dark-theme");
} else {
  document.documentElement.classList.add("light-theme");
}
