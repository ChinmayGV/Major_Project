$(document).ready(function () {
  // This function remains the same
  function formatCountry(country) {
    if (!country.id) {
      return country.text;
    }
    var flagUrl = `https://flagcdn.com/w20/${country.id.toLowerCase()}.png`;
    var $country = $(
      '<span><img src="' +
        flagUrl +
        '" class="flag-icon" /> ' +
        country.text +
        "</span>"
    );
    return $country;
  }

  // We wrap the initialization in a function so we can call it again
  function initializeSelect2() {
    $("#country-select").select2({
      templateResult: formatCountry,
      templateSelection: formatCountry,
      width: "resolve", // Keep this for the initial load
    });
  }

  // 1. Initialize the dropdown when the page first loads
  initializeSelect2();

  // 2. Add a listener to destroy and re-create it on resize
  let resizeTimer;
  $(window).on("resize", function () {
    // This is a performance optimization to prevent the code from running too often
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      // Destroy the existing Select2 instance
      $("#country-select").select2("destroy");

      // Re-initialize it, which will force it to recalculate its width
      initializeSelect2();
    }, 1); // Wait 250ms after resizing stops
  });
});
