
window.$ = $;
window.jQuery = jQuery;
$(document).ready(function () {
    $('#content').jstars({
        image_path: 'src/images/stars', // folder with magic image
        style: 'yellow',       // optional, color, default: white
        frequency: 19         // optional, from 1 to 19
    });

// Get the modal
const modal = document.getElementById('myModal');

// Get the button that opens the modal
const btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
const span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btn.onclick = function () {
    modal.style.display = "block";
};

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
    modal.style.display = "none";
};


// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
};
});