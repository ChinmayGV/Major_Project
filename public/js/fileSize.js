const fileInput = document.getElementById("fileInput");
const MAX_SIZE = 1024 * 1024 * 3; // 5MB

fileInput.addEventListener("change", () => {
  if (fileInput.files.length > 0) {
    const file = fileInput.files[0];
    if (file.size > MAX_SIZE) {
      alert(`File is too large! Please select a file smaller than 3MB.`);
      fileInput.value = ""; // Clear the selected file
    }
  }
});
