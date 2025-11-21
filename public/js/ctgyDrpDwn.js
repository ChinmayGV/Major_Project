const checks = document.querySelectorAll(".category-check");
const categoryContainer = document.getElementById("category-container");
const validatorInput = document.getElementById("category-validator");
const text = document.getElementById("dropdown-text");
const form = document.getElementById("listingForm");

// Create hidden inputs for real array submission
function updateHiddenInputs() {
  // Clear old hidden inputs
  categoryContainer.innerHTML = "";

  const selected = Array.from(checks)
    .filter((c) => c.checked)
    .map((c) => c.value);

  // Create new hidden inputs: category[]=value
  selected.forEach((val) => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = "category[]";
    input.value = val;
    categoryContainer.appendChild(input);
  });

  // Update dropdown text
  text.textContent = selected.length
    ? selected.join(", ")
    : "⬇️ Select Categories";

  // Update bootstrap validator
  validatorInput.value = selected.length > 0 ? "ok" : "";
}

// Run on page load (edit mode)
updateHiddenInputs();

// Update on checkbox click
checks.forEach((ch) => {
  ch.addEventListener("change", updateHiddenInputs);
});

// Form validation
form.addEventListener("submit", (event) => {
  const selectedCount = Array.from(checks).filter((c) => c.checked).length;

  validatorInput.value = selectedCount > 0 ? "ok" : "";

  if (!form.checkValidity() || selectedCount === 0) {
    event.preventDefault();
    event.stopPropagation();
  }

  form.classList.add("was-validated");
});
