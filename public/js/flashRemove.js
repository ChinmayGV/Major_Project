// Paste the entire JavaScript code here, but without the <script> tags.
document.addEventListener("DOMContentLoaded", () => {
  const allFlashAlerts = document.querySelectorAll(".alert");
  if (allFlashAlerts.length > 0) {
    allFlashAlerts.forEach((flashAlert) => {
      setTimeout(() => {
        const dismissAlert = () => {
          flashAlert.remove();
        };
        document.addEventListener("click", dismissAlert);
        document.addEventListener("keydown", dismissAlert);
        window.addEventListener("scroll", dismissAlert);
      }, 500);
    });
  }
});
