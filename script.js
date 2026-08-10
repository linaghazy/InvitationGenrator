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