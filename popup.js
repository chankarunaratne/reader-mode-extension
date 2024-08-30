console.log("Popup script running");

document.addEventListener("DOMContentLoaded", () => {
  console.log("Popup DOM fully loaded and parsed");
  const header = document.querySelector("h1");
  if (header) {
    header.textContent = "Hello from popup.js!";
  }
});
