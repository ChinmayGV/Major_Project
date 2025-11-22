// TAX SWITCH
let taxSwitch = document.getElementById("switchCheckDefault");
taxSwitch.addEventListener("click", () => {
  document.querySelectorAll(".price-info").forEach((price) => {
    price.querySelector(".price-without-tax").style.display = taxSwitch.checked
      ? "none"
      : "inline";
    price.querySelector(".price-with-tax").style.display = taxSwitch.checked
      ? "inline"
      : "none";
  });
});

const filters = document.getElementById("filters");
const leftBtn = document.getElementById("scroll-left");
const rightBtn = document.getElementById("scroll-right");

// Button Scroll
leftBtn.addEventListener("click", () => (filters.scrollLeft -= 200));
rightBtn.addEventListener("click", () => (filters.scrollLeft += 200));

// Wheel Scroll (mouse wheel, trackpad, magic mouse)
filters.addEventListener("wheel", (e) => {
  if (e.deltaY !== 0) {
    e.preventDefault();
    filters.scrollLeft += e.deltaY;
  }
});

// Save scroll position on filter click
document.querySelectorAll(".filter a").forEach((link) => {
  link.addEventListener("click", () => {
    localStorage.setItem("filterScroll", filters.scrollLeft);
  });
});

// Restore scroll position
window.addEventListener("load", () => {
  const saved = localStorage.getItem("filterScroll");
  if (saved !== null) filters.scrollLeft = parseInt(saved);
});
