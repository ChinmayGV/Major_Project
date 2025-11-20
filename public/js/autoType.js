document.addEventListener("DOMContentLoaded", function () {
  var typed = new Typed(".search-inp", {
    strings: [
      "Search for 'India'",
      "Search for 'USA'",
      "Search for 'Bali'",
      "Search for 'Taj Mahal'",
      "Search for 'mountains'",
      "Search for 'Pools'",
      "Search for Destinations...",
    ],
    typeSpeed: 120, // Slower speed to emphasize letter-by-letter typing
    backSpeed: 80, // Speed of deleting
    backDelay: 2000, // Wait 3 seconds before backspacing
    startDelay: 1500, // Wait 1 second before starting
    attr: "placeholder", // Typing into the placeholder attribute
    loop: false, // PLAY ONCE: Stops after the last string ('mountains')
    bindInputFocusEvents: false, // Stops typing if user clicks to type
    showCursor: false, // Hides the blinking cursor for cleaner placeholder look
  });
});
