// Select elements
const button = document.getElementById("btn");
const message = document.getElementById("message");

// Add event listener
button.addEventListener("click", function() {
    message.innerText = "Button Clicked!";
    message.classList.add("highlight");
});