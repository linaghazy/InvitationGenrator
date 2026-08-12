let generatedInvitations = [];
let guestNames = [];
const canvas = document.getElementById("invitationCanvas");
const ctx = canvas.getContext("2d");
const input = document.getElementById("invitationInput");
const image = document.getElementById("invitationPreview");
const downloadButton = document.getElementById("downloadButton");


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

     positionText.textContent =
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
            guestNames = [];
            results.data.forEach(function(row){
                const name = row.Name;
                console.log(name);
                if (name){
                    guestNames.push(name);
                    const paragraph = document.createElement("p");
                    paragraph.textContent = name;
                    namesList.appendChild(paragraph);
                }
            })
               
            console.log("Guest Nmaes:", guestNames);
        }
    });

});

function generateInvitation(name) {

    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;

    ctx.drawImage(
        image,
        0,
        0,
        canvas.width,
        canvas.height
    );

    ctx.font = "50px Arial";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";

    ctx.fillText(
        name,
        namePositionX,
        namePositionY
    );

    const generatedImage = canvas.toDataURL("image/png");

    generatedInvitations.push({
        name: name,
        image: generatedImage
    });
}

const generateButton = document.getElementById("generateButton");

generateButton.addEventListener("click", function () {

    if (guestNames.length === 0) {
        alert("Please upload a CSV with guest names first.");
        return;
    }

    generatedInvitations = [];

    guestNames.forEach(function(name) {

        console.log("Generating invitation for:", name);

        generateInvitation(name);

    });

     console.log("Generated invitations:", generatedInvitations);

});

downloadButton.addEventListener("click", function () {

    if (generatedInvitations.length === 0) {
        alert("Please generate the invitations first.");
        return;
    }

    const zip = new JSZip();

    generatedInvitations.forEach(function(invitation) {

        const imageData = invitation.image.split(",")[1];

        zip.file(
            `${invitation.name}.png`,
            imageData,
            { base64: true }
        );

    });

    zip.generateAsync({ type: "blob" })
        .then(function(content) {

            const downloadLink = document.createElement("a");

            downloadLink.href = URL.createObjectURL(content);

            downloadLink.download = "invitations.zip";

            downloadLink.click();

            URL.revokeObjectURL(downloadLink.href);
        });
});