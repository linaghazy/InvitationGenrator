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