// Get the button and the menu
const menuButton = document.getElementById("menu-button");
const dropdownMenu = document.getElementById("dropdown-menu");

// Add a click event listener to the button
menuButton.addEventListener("click", () => {
  // Toggle the .show class on the menu
  dropdownMenu.classList.toggle("show");
});

// Optional: Close the menu if the user clicks outside of it
window.addEventListener("click", (event) => {
  if (
    !menuButton.contains(event.target) &&
    !dropdownMenu.contains(event.target)
  ) {
    dropdownMenu.classList.remove("show");
  }
});
