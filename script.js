const canvas = document.getElementById("invitationCanvas");
const ctx = canvas.getContext("2d");
const input = document.getElementById("invitationInput");
const image = document.getElementById("invitationPreview");

input.addEventListener("change", function () {

    const file = input.files[0];

    if (!file) {
        return;
    }

    const imageURL = URL.createObjectURL(file);

    image.src = imageURL;
});

let namePositionX = null;
let namePositionY = null;

const positionText = document.getElementById("positionText");

image.addEventListener("click", function(event) {

     const rect = image.getBoundingClientRect();

     const x = event.clientX - rect.left;
     const y = event.clientY - rect.top;

     const originalWidth = image.naturalWidth;
     const originalHeight = image.naturalHeight;

     const scaleX = originalWidth / rect.width;
     const scaleY = originalHeight / rect.height

     const originalX = x * scaleX;
     const originalY = y * scaleY;

     namePositionX = originalX;
     namePositionY = originalY;

     postionText.textContent =
     `Original position: X = ${Math.round(originalX)}, Y = ${Math.round(originalY)}`;


     console.log("Original X:", originalX);
     console.log("Original Y:", originalY);

});

const csvInput = document.getElementById("csvInput");
const namesList = document.getElementById("namesList");

csvInput.addEventListener("change", function () {

    const file = csvInput.files[0];

    if (!file) {
        return;
    }

    Papa.parse(file, {
        header: true,
        complete: function (results) {

            console.log(results.data);
            namesList.innerHTML = "";
            results.data.forEach(function(row){
                const name = row.Name;
                console.log(name);
                if (name){
                    const paragraph = document.createElement("p");
                    paragraph.textContent = name;
                    namesList.appendChild(paragraph);
                }
            })
               
            
        }
    });

});

