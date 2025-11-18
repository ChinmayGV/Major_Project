// // Example starter JavaScript for disabling form submissions if there are invalid fields
// (() => {
//   "use strict";

//   // Fetch all the forms we want to apply custom Bootstrap validation styles to
//   const forms = document.querySelectorAll(".needs-validation");

//   // Loop over them and prevent submission
//   Array.from(forms).forEach((form) => {
//     form.addEventListener(
//       "submit",
//       (event) => {
//         if (!form.checkValidity()) {
//           event.preventDefault();
//           event.stopPropagation();
//         }

//         form.classList.add("was-validated");
//       },
//       false
//     );
//   });
// })();

// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  "use strict";

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll(".needs-validation");

  // Loop over them and prevent submission
  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        // 1. IF INVALID: Stop everything
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }
        // 2. IF VALID: Disable the button to prevent double-clicks
        else {
          const submitBtn = form.querySelector('button[type="submit"]');
          if (submitBtn) {
            submitBtn.disabled = true;
            // Optional: Add a spinner so they know it's working
            submitBtn.innerHTML =
              'Please wait...<span class="spinner-border spinner-border-sm"></span>';
          }
        }

        form.classList.add("was-validated");
      },
      false
    );
  });
})();
