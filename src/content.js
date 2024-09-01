console.log("Content script loaded");

// Function to extract content using Readability
function extractContent() {
  const documentClone = document.cloneNode(true);
  const article = new Readability(documentClone).parse();
  return article;
}

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
  max-width: 700px;
  margin: 0 auto;
  font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  line-height: 1.6;
  color: #333;
  padding: 0 20px;
  box-sizing: border-box;
`;

// Function to toggle the overlay
function toggleOverlay() {
  if (overlay.style.top === "0px") {
    overlay.style.top = "-100%";
  } else {
    overlay.style.top = "0px";
    if (!overlay.hasChildNodes()) {
      const article = extractContent();

      // Inject font-face styles
      const fontStyles = document.createElement("style");
      fontStyles.textContent = `
        @font-face {
          font-family: 'General Sans';
          src: url('${chrome.runtime.getURL(
            "fonts/GeneralSans-Regular.otf"
          )}') format('opentype');
          font-weight: normal;
          font-style: normal;
        }
        @font-face {
          font-family: 'General Sans';
          src: url('${chrome.runtime.getURL(
            "fonts/GeneralSans-SemiBold.otf"
          )}') format('opentype');
          font-weight: 600;
          font-style: normal;
        }
      `;
      document.head.appendChild(fontStyles);

      // Create the heading
      const heading = document.createElement("h1");
      heading.textContent = article.title;
      heading.style.cssText = `
        font-family: 'General Sans', -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
        font-size: 36px;
        line-height: 42px;
        font-weight: 600;
        color: #0D0E25;
        margin-top: 40px;
        margin-bottom: 32px;
        max-width: 700px;
        width: 100%;
        margin-left: auto;
        margin-right: auto;
      `;
      contentContainer.appendChild(heading);

      // Create the body content
      const bodyContent = document.createElement("div");
      bodyContent.innerHTML = article.content;
      bodyContent.style.cssText = `
        font-size: 18px;
        width: 100%;
        word-wrap: break-word;
        overflow-wrap: break-word;
      `;

      // Add styles for paragraphs and images
      const style = document.createElement("style");
      style.textContent = `
        #reader-mode-overlay p {
          margin-bottom: 1.5em;
        }
        #reader-mode-overlay img {
          max-width: 100%;
          height: auto;
          display: block;
          margin: 1em auto;
        }
      `;
      document.head.appendChild(style);

      contentContainer.appendChild(bodyContent);
      overlay.appendChild(contentContainer);
    }
  }
}

// Listen for messages from the extension
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "toggleReaderMode") {
    toggleOverlay();
  }
});

// Append overlay to the body
document.body.appendChild(overlay);

console.log("Content script setup complete");
