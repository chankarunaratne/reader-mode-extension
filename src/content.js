console.log("Content script loaded");

// Function to extract content using Readability
function extractContent() {
  const documentClone = document.cloneNode(true);
  const article = new Readability(documentClone).parse();

  // Remove metadata elements
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = article.content;

  // Remove specific metadata elements (adjust selectors as needed)
  tempDiv
    .querySelectorAll(
      '[data-component="byline-block"], [data-component="tag-list"], [data-component="topic-list"]'
    )
    .forEach((el) => el.remove());

  // Remove any remaining metadata containers (adjust selector as needed)
  tempDiv
    .querySelectorAll(".metadata, .article-info")
    .forEach((el) => el.remove());

  article.content = tempDiv.innerHTML;
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
  background-color: #F8F9FB;
  z-index: 2147483647;
  overflow-y: auto;
  padding: 20px;
  box-sizing: border-box;
  transition: top 0.5s ease-in-out;
`;

// Inject font-face styles and body text styles
const styles = document.createElement("style");
styles.textContent = `
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
  #reader-mode-overlay {
    font-family: 'Inter', sans-serif;
    font-size: 16px;
    line-height: 26px;
    color: #4F5667;
  }
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
document.head.appendChild(styles);

// Create the content container
const contentContainer = document.createElement("div");
contentContainer.style.cssText = `
  max-width: 700px;
  margin: 28px auto 0;
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

      // Create the website name element
      const websiteName = document.createElement("p");
      const url = new URL(document.location.href);
      const domain = url.hostname.replace("www.", "");
      websiteName.textContent = domain;
      websiteName.style.cssText = `
        font-family: 'Inter', sans-serif;
        font-size: 14px;
        line-height: 20px;
        font-weight: 400;
        color: rgba(13, 14, 37, 0.6);
        margin: 0 0 12px 0;
        max-width: 700px;
        width: 100%;
        margin-left: auto;
        margin-right: auto;
      `;
      contentContainer.appendChild(websiteName);

      // Create the heading
      const heading = document.createElement("h1");
      heading.textContent = article.title;
      heading.style.cssText = `
        font-family: 'General Sans', -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
        font-size: 36px;
        line-height: 42px;
        font-weight: 600;
        color: #0D0E25;
        margin-top: 0;
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
        font-family: 'Inter', sans-serif;
        font-size: 16px;
        line-height: 26px;
        color: #4F5667;
      `;

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
