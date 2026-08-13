let generatedInvitations = [];
let guestNames = [];
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

     positionText.textContent =
     `Original position: X = ${Math.round(originalX)}, Y = ${Math.round(originalY)}`;


     console.log("Original X:", originalX);
     console.log("Original Y:", originalY);

});

const csvInput = document.getElementById("csvInput");
const namesList = document.getElementById("namesList");
const loadedCount = document.getElementById("loadedCount");

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
                    const nameItem = document.createElement("div");
                    nameItem.className = "name-item";

                    const dot = document.createElement("span");
                    dot.className = "name-dot";

                    const nameText = document.createElement("span");
                    nameText.className = "name-text";
                    nameText.textContent = name;

                    nameItem.appendChild(dot);
                    nameItem.appendChild(nameText);

                    namesList.appendChild(nameItem);
                }
            })
             loadedCount.textContent = `${guestNames.length} loaded`;  
            console.log("Guest Names:", guestNames);
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

    if (namePositionX === null || namePositionY === null) {
        alert("Please click on the invitation to choose where to put the name.");
        return;
    }

    generatedInvitations = [];

    guestNames.forEach(function(name) {

        console.log("Generating invitation for:", name);

        generateInvitation(name);

    });

     console.log("Generated invitations:", generatedInvitations);
     
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

            document.body.appendChild(downloadLink);

            downloadLink.click();

            document.body.removeChild(downloadLink);

            URL.revokeObjectURL(downloadLink.href);

        });

     image.style.display = "none";
     canvas.style.display = "block";
});

