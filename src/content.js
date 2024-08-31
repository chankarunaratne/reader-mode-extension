console.log("Content script loaded");

// Grab the heading of the web page
const pageHeading =
  document.querySelector("h1")?.textContent ||
  document.querySelector("header h1")?.textContent ||
  document.querySelector(".page-title")?.textContent ||
  document.querySelector("#main-title")?.textContent ||
  document.title;

// Function to extract main content including relevant images
function extractMainContent() {
  const article =
    document.querySelector("article") ||
    document.querySelector("main") ||
    document.body;

  const contentNodes = article.querySelectorAll("p, img, figure");
  let content = "";
  const seenImages = new Set();
  let isFirstImage = true;

  contentNodes.forEach((node) => {
    if (node.tagName === "P") {
      content += `<p>${node.textContent.trim()}</p>`;
    } else if (node.tagName === "IMG" || node.tagName === "FIGURE") {
      if (!isIrrelevantImage(node)) {
        let imgSrc = "";
        let imgAlt = "";
        let caption = "";

        if (node.tagName === "IMG") {
          imgSrc = node.src;
          imgAlt = node.alt;
        } else {
          const img = node.querySelector("img");
          if (img) {
            imgSrc = img.src;
            imgAlt = img.alt;
            caption = node.querySelector("figcaption")?.textContent || "";
          }
        }

        if (imgSrc && !seenImages.has(imgSrc)) {
          seenImages.add(imgSrc);
          const imgStyle = isFirstImage
            ? "max-width: 700px; width: 100%; height: auto; margin: 1em auto; display: block;"
            : "max-width: 100%; height: auto; margin: 1em 0;";

          if (caption) {
            content += `<figure style="margin: 1em auto; ${
              isFirstImage ? "max-width: 700px;" : ""
            }">
              <img src="${imgSrc}" alt="${imgAlt}" style="${imgStyle}">
              <figcaption style="font-size: 0.9em; color: #666; margin-top: 0.5em; text-align: center;">${caption}</figcaption>
            </figure>`;
          } else {
            content += `<img src="${imgSrc}" alt="${imgAlt}" style="${imgStyle}">`;
          }

          isFirstImage = false;
        }
      }
    }
  });

  return content;
}

// Helper function to check if an image is irrelevant
function isIrrelevantImage(node) {
  const irrelevantClasses = ["ad", "sidebar", "related", "promo", "thumbnail"];
  const irrelevantIds = ["ad", "sidebar", "related", "promo"];

  // Check if the node or its ancestors have irrelevant classes or ids
  let current = node;
  while (current && current !== document.body) {
    if (
      irrelevantClasses.some((cls) => current.className.includes(cls)) ||
      irrelevantIds.some((id) => current.id.includes(id))
    ) {
      return true;
    }
    current = current.parentElement;
  }

  return false;
}

// Store the body content as text
const pageBodyContent = extractMainContent();

// Create the overlay element
const overlay = document.createElement("div");
overlay.id = "reader-mode-overlay";
overlay.style.cssText = `
  position: fixed;
  top: -100%;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #fff;
  z-index: 9999;
  overflow-y: auto;
  padding: 20px;
  box-sizing: border-box;
  transition: top 0.5s ease-in-out;
`;

// Create the content container
const contentContainer = document.createElement("div");
contentContainer.style.cssText = `
  max-width: 648px;
  margin: 0 auto;
  font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  line-height: 1.6;
  color: #333;
  padding: 0 20px;
  box-sizing: border-box;
`;

// Create the heading element
const heading = document.createElement("h1");
heading.textContent = pageHeading;
heading.style.cssText = `
  font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  font-size: 36px;
  line-height: 44px;
  font-weight: 700;
  color: rgba(18, 18, 18, 0.87);
  margin-top: 40px;
  margin-bottom: 32px;
`;

contentContainer.appendChild(heading);

// Modify the body content creation
const bodyContent = document.createElement("div");
bodyContent.innerHTML = extractMainContent();
bodyContent.style.cssText = `
  font-size: 18px;
  width: 100%;
  word-wrap: break-word;
  overflow-wrap: break-word;
`;

// Add paragraph spacing styles
const style = document.createElement("style");
style.textContent = `
  #reader-mode-overlay p {
    margin-bottom: 1.5em;
  }
  #reader-mode-overlay {
    transition: top 0.5s ease-in-out;
  }
`;
document.head.appendChild(style);

// Append elements to the DOM
contentContainer.appendChild(bodyContent);
overlay.appendChild(contentContainer);
document.body.appendChild(overlay);

// Function to toggle the overlay
function toggleOverlay() {
  if (overlay.style.top === "0px") {
    overlay.style.top = "-100%";
  } else {
    overlay.style.top = "0px";
  }
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
