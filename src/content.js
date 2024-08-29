// Create a style element for resetting and applying your styles
const style = document.createElement("style");
style.innerHTML = `
  /* CSS Reset */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  /* Apply default styles to your container */
  body {
    background-color: white;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Lato', 'Helvetica', 'Arial', sans-serif;
    font-size: 18px;
    line-height: 1.6;
    color: #333;
  }

  /* Custom styles for the reader container */
  #reader-container {
    max-width: 680px;
    width: 100%;
    margin: 0 auto;
    padding: 20px;
    background-color: white;
  }
`;

// Append the style to the head
document.head.appendChild(style);

// Grab the body content
const bodyContent =
  document.querySelector("article") ||
  document.querySelector("main") ||
  document.querySelector("div");

// Clear the page content
document.body.innerHTML = "";

// Create a new container for the reader mode
const readerContainer = document.createElement("div");
readerContainer.id = "reader-container"; // Assign an ID for styling

// Append the body content to the container
if (bodyContent) {
  readerContainer.appendChild(bodyContent);
}

// Append the reader container to the body
document.body.appendChild(readerContainer);
