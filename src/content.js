console.log("Content script loaded");

// Grab the heading of the web page
const pageHeading =
  document.querySelector("h1")?.textContent ||
  document.querySelector("header h1")?.textContent ||
  document.querySelector(".page-title")?.textContent ||
  document.querySelector("#main-title")?.textContent ||
  document.title;

// Function to extract main content
function extractMainContent() {
  const article =
    document.querySelector("article") ||
    document.querySelector("main") ||
    document.body;
  const paragraphs = article.querySelectorAll("p");
  return Array.from(paragraphs)
    .map((p) => p.textContent.trim())
    .filter((text) => text.length > 0)
    .join("\n\n");
}

// Store the body content as text
const pageBodyContent = extractMainContent();

// Function to extract subheadings
function extractSubheadings() {
  const subheadings = document.querySelectorAll("h2, h3, h4, h5, h6");
  return Array.from(subheadings)
    .map((h) => h.textContent.trim())
    .filter((text) => text.length > 0);
}

// Store the subheadings
const pageSubheadings = extractSubheadings();

// Create the overlay element
const overlay = document.createElement("div");
overlay.id = "reader-mode-overlay";
overlay.style.cssText = `
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #fff;
  z-index: 9999;
  overflow-y: auto;
  padding: 20px;
  box-sizing: border-box;
  display: none;
`;

// Create the content container
const contentContainer = document.createElement("div");
contentContainer.style.cssText = `
  max-width: 648px;
  margin: 0 auto;
  font-family: Arial, sans-serif;
  line-height: 1.6;
  color: #333;
`;

// Create the heading element
const heading = document.createElement("h1");
heading.textContent = pageHeading;
heading.style.cssText = `
  font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  font-size: 36px;
  line-height: 48px;
  color: rgba(18, 18, 18, 0.87);
  margin-bottom: 10px;
`;

// Create and add subheadings if they exist
if (pageSubheadings.length > 0) {
  const subheadingElement = document.createElement("h2");
  subheadingElement.textContent = pageSubheadings[0]; // Display the first subheading
  subheadingElement.style.cssText = `
    font-size: 22px;
    margin-bottom: 20px;
    color: #666;
  `;
  contentContainer.appendChild(heading);
  contentContainer.appendChild(subheadingElement);
} else {
  heading.style.marginBottom = "20px";
  contentContainer.appendChild(heading);
}

// Create the body content element
const bodyContent = document.createElement("div");
bodyContent.innerHTML = pageBodyContent
  .split("\n\n")
  .map((p) => `<p>${p}</p>`)
  .join("");
bodyContent.style.cssText = `
  font-size: 18px;
`;

// Add paragraph spacing
const style = document.createElement("style");
style.textContent = `
  #reader-mode-overlay p {
    margin-bottom: 1.5em;
  }
`;
document.head.appendChild(style);

// Append elements to the DOM
contentContainer.appendChild(bodyContent);
overlay.appendChild(contentContainer);
document.body.appendChild(overlay);

// Function to toggle the overlay
function toggleOverlay() {
  overlay.style.display = overlay.style.display === "none" ? "block" : "none";
}

// Listen for messages from the extension
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Message received:", request);
  if (request.action === "toggleReaderMode") {
    console.log("Toggling reader mode");
    toggleOverlay();
  }
});

console.log("Content script setup complete");
