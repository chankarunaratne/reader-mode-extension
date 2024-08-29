// change the background color to white
document.body.style.backgroundColor = "white";

// grab the heading
const heading = document.querySelector("h1");

//grab the body content
const bodyContent =
  document.querySelector("article") ||
  document.querySelector("main") ||
  document.querySelector("div");

//clear the page content
document.body.innerHTML = "";

// new container
const bodyContainer = document.createElement("div");
bodyContainer.style.margin = "40";
bodyContainer.style.fontSize = "16px";
bodyContainer.style.lineHeight = "40";
bodyContainer.style.maxWidth = "40";
bodyContainer.style.margin = "auto";

// append the body content to the container
if (bodyContent) {
  readerContainer.appendChild(bodyContent);
}

document.body.appendChild(readerContainer);
