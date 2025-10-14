document.addEventListener("DOMContentLoaded", () => {
  const togglePassword = document.querySelector("#togglePassword");
  const password = document.querySelector("#password");

  togglePassword.addEventListener("click", function () {
    // Toggle the type of the password field
    const type =
      password.getAttribute("type") === "password" ? "text" : "password";
    password.setAttribute("type", type);

    // Toggle the icon class
    this.classList.toggle("fa-eye-slash");
  });
});

// const passwordInput = document.getElementById("password");
// const messageContainer = document.getElementById("password-message");

// // An array of objects, each representing a validation rule
// const validationRules = [
//   { regex: /.{8,}/, message: "✗ Minimum 8 characters" },
//   { regex: /[a-z]/, message: "✗ At least one lowercase letter" },
//   { regex: /[A-Z]/, message: "✗ At least one uppercase letter" },
//   { regex: /[0-9]/, message: "✗ At least one number" },
//   { regex: /[!@#$%^&*]/, message: "✗ At least one special character" },
// ];

// passwordInput.addEventListener("keyup", () => {
//   const password = passwordInput.value;

//   // If the input is empty, hide the message and do nothing else
//   if (password.length === 0) {
//     messageContainer.textContent = "";
//     return;
//   }

//   // A variable to hold the first error message found
//   let firstErrorMessage = "";

//   // Loop through rules to find the first one that fails
//   for (const rule of validationRules) {
//     if (!rule.regex.test(password)) {
//       // If a rule fails, store its message and stop the loop
//       firstErrorMessage = rule.message;
//       break;
//     }
//   }

//   // Now, update the UI based on what we found
//   if (firstErrorMessage) {
//     // If we found an error, display it and style it as an error
//     messageContainer.textContent = firstErrorMessage;
//     messageContainer.className = "error";
//   } else {
//     // If the loop finished with no errors, the password is strong
//     messageContainer.textContent = "✓ Password is strong!";
//     messageContainer.className = "success";
//   }
// });
