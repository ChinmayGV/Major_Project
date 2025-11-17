// Get the button and the menu
// const menuButton = document.getElementById("menu-button");
// const dropdownMenu = document.getElementById("dropdown-menu");

// // Add a click event listener to the button
// menuButton.addEventListener("click", () => {
//   // Toggle the .show class on the menu
//   dropdownMenu.classList.toggle("show");
// });

// // Optional: Close the menu if the user clicks outside of it
// window.addEventListener("click", (event) => {
//   if (
//     !menuButton.contains(event.target) &&
//     !dropdownMenu.contains(event.target)
//   ) {
//     dropdownMenu.classList.remove("show");
//   }
// });

// Wait for the document to be fully loaded
// Wait for the document to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Find the button and menu that EJS has rendered
  const menuButton = document.getElementById("menu-button");
  const dropdownMenu = document.getElementById("dropdown-menu");

  // Only run if the button and menu exist on the page
  if (menuButton && dropdownMenu) {
    // 1. Toggle the menu when the button is clicked
    menuButton.addEventListener("click", (event) => {
      // Stop the click from bubbling up to the window
      event.stopPropagation();
      dropdownMenu.classList.toggle("show");
    });

    // 2. Close the menu if the user clicks anywhere else
    window.addEventListener("click", (event) => {
      // Check if the menu is open
      if (dropdownMenu.classList.contains("show")) {
        // Check if the click was *outside* both the button and the menu
        if (
          !menuButton.contains(event.target) &&
          !dropdownMenu.contains(event.target)
        ) {
          dropdownMenu.classList.remove("show");
        }
      }
    });
  }
});
