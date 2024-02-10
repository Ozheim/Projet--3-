import {addPicture} from "./index.js";


function isConnected () {
 return !! localStorage.token;
};



function navHeaderConnected (){
    if(isConnected()){
        document.getElementById("login-button").style.display = "none";
        document.getElementById("logout-button").style.display = "block";
    }

};

navHeaderConnected(); 


 const showEditMenu = () => {
    if(isConnected()){
        document.getElementById("edition-mod").style.display = "block";
    }

}

showEditMenu();


function isDisconnected () {
    const logoutEvent = document.getElementById("logout-button");
    logoutEvent.addEventListener("click", () =>{
        return localStorage.removeItem('token') 
    })
}

isDisconnected ();


const hideProjetFilter = () =>{
    if (isConnected()){
        document.getElementById("filterList").style.display = "none";

}
};


hideProjetFilter();


const showEditFilter = () => {
if (isConnected()){
    document.getElementById("editFilterr").style.display = "inline-block";
   
}
};

showEditFilter();

let photoAddFormExists = false;



async function generateGalleryInModal() {
    try {
    
        const res = await fetch("http://localhost:5678/api/works");
        const pictures = await res.json();

        
        if (isConnected()) {
           
            document.querySelector(".overlay").style.display = "flex";
            
          
            let sectionGallery = document.querySelector(".modale .gallery");
            
            if (!sectionGallery){
              const modal = document.querySelector(".modale");
              modal.innerHTML=`  <i class="fas fa-times close" id="closeModal"></i>
              <h2 id="GalleryinModalH2">Galerie photo</h2>
              <div id="modalGallery" class="gallery"></div>
              <div class="borderAboveButton"></div>
              <div id="borderAboveValidationButton"></div>
              <button id="addPhotoButton" class="custom-add-photo-button">Ajouter une photo</button>
              `
                sectionGallery= document.querySelector(".modale .gallery");
            }
           
            sectionGallery.innerHTML="";

            const addPhotoButton = document.getElementById("addPhotoButton");
            addPhotoButton.addEventListener("click", () => {
                showAddPhotoForm();
            });
          
            for (let i = 0; i < pictures.length; i++) {
                const pictureElement = document.createElement("figure");
                const img = document.createElement("img");
                img.id = "imageInModale";
                img.src = pictures[i].imageUrl;
                const nomElement = document.createElement("figcaption");
                nomElement.innerText = pictures[i].title;

              
                const deleteIcon = document.createElement("i");
                const id = pictures[i].id
                deleteIcon.classList.add("fa", "fa-trash-alt", "delete-icon");
                deleteIcon.addEventListener("click", () => deleteImage(i,id)); 

                pictureElement.appendChild(img);
                pictureElement.appendChild(nomElement);
                pictureElement.appendChild(deleteIcon);
                sectionGallery.appendChild(pictureElement);
            }
            const overlay = document.querySelector(".overlay");
            overlay.addEventListener("click", (event) => {
                if (event.target === overlay) {
                    overlay.style.display = "none";
                }
            });
        } 
    } catch (error) {
        console.error("Erreur : ", error);
    }
    
    const closeModalButton = document.getElementById('closeModal');
    const overlay = document.querySelector('.overlay');

    closeModalButton.addEventListener('click', () => {
        overlay.style.display = 'none';
    });

}

const editFilterElement = document.getElementById("editFilterr");
editFilterElement.addEventListener("click", generateGalleryInModal);


async function deleteImage(index, id) {
    try {
        await fetch(`http://localhost:5678/api/works/${id}`,{
            method: "DELETE",
            headers: {
            
              Authorization: `Bearer ${localStorage.token}`,
            },
        })

        const sectionGallery = document.querySelector(".modale #modalGallery");
        const imagesInModal = sectionGallery.querySelectorAll("figure");
        const imageToRemove = imagesInModal[index];

        if (imageToRemove) {
            sectionGallery.removeChild(imageToRemove);
        }

            
        const imagesInMainGallery = document.querySelectorAll(".gallery figure");
        if (imagesInMainGallery.length > index) {
            const imageToRemoveFromMainGallery = imagesInMainGallery[index];
            if (imageToRemoveFromMainGallery) {
                imageToRemoveFromMainGallery.remove();
            }
        }
    }
    catch (error) {
        console.error("Erreur :", error);
    }

        
}


const addPhotoFormValidator = {
    title: {
        value: null
    },
    category: {
        value: null,
    },
    image: {
        value: null,
    },
}

async function showAddPhotoForm() {
    if (!photoAddFormExists) {
        photoAddFormExists = true;
    } else {
        return;
    }

    const sectionGallery = document.querySelector(".modale");
    sectionGallery.innerHTML = "";

    const title = document.createElement("h2");
    title.id = "secondh2InModale";
    title.textContent = "Ajout Photo";
    sectionGallery.appendChild(title);

    const rectangle = document.createElement("div");
    rectangle.id = "customRectangle";
    sectionGallery.appendChild(rectangle);

    const titleLabel = document.createElement("label");
    titleLabel.textContent = "Titre";
    titleLabel.for = "photoTitle";
    titleLabel.classList.add("custom-label-title");

    const categoryLabel = document.createElement("label");
    categoryLabel.textContent = "Catégorie";
    categoryLabel.for = "photoCategory";
    categoryLabel.classList.add("custom-label-category");

    rectangle.appendChild(titleLabel);
    rectangle.appendChild(categoryLabel);

    const icon = document.createElement("i");
    icon.className = "fa-regular fa-image";
    icon.style.fontSize = "68px";
    icon.style.display = "block";
    icon.style.textAlign = "center";
    icon.style.position = "relative";
    icon.style.top = "16px";
    icon.style.color = " #B9C5CC";

    rectangle.appendChild(icon);

    const addPhotoFormContainer = document.createElement("form");
    addPhotoFormContainer.id = "addPhotoFormContainer";

    const closeButton = document.createElement("i");
    closeButton.classList.add("fas", "fa-times", "close");
    closeButton.id = "closeAddPhotoForm";

    const photoFileInput = document.createElement("input");
    photoFileInput.type = "file";
    photoFileInput.id = "photoFile";
    photoFileInput.accept = "image/*";
    photoFileInput.required = true;
    photoFileInput.addEventListener('change', previewImage);

    const fileInputLabel = document.createElement("label");
    fileInputLabel.htmlFor = "photoFile";
    fileInputLabel.id = "fileInputLabel";
    fileInputLabel.textContent = "+ Ajouter photo";

    const photoTitleInput = document.createElement("input");
    photoTitleInput.type = "text";
    photoTitleInput.id = "photoTitle";
    photoTitleInput.placeholder = "Titre de la photo";
    photoTitleInput.required = true;

    photoTitleInput.addEventListener('keyup', (event) => {
        addPhotoFormValidator.title.value = event.target.value;

        if (addPhotoFormValidator.image.value && addPhotoFormValidator.title.value !== '' && addPhotoFormValidator.category.value !== '') {
            document.getElementById("submitButton").classList.add('active');
        } else {
            document.getElementById("submitButton").classList.remove('active');
        }
    });

    const photoCategorySelecte = document.createElement("select");
    photoCategorySelecte.id = "photoCategory";
    photoCategorySelecte.required = true;

    photoCategorySelecte.addEventListener('change', (event) => {
        addPhotoFormValidator.category.value = event.target.value;
        console.log('addPhotoFormValidator.category.value', addPhotoFormValidator.category.value);
        if (addPhotoFormValidator.image.value && addPhotoFormValidator.title.value !== '' && addPhotoFormValidator.category.value !== '') {
            document.getElementById("submitButton").classList.add('active');
        } else {
            document.getElementById("submitButton").classList.remove('active');
        }
    });

    const addButton = document.createElement("button");
    addButton.id = "submitButton";
    addButton.type = "submit";
    addButton.textContent = "Valider";

    const previewImageContainer = document.createElement("div");
    previewImageContainer.id = "previewImageContainer";

    const borderDiv = document.createElement("div");
    borderDiv.style.width = "425px";
    borderDiv.style.bottom = "125px";
    borderDiv.style.right = "102px";
    borderDiv.style.position = "absolute";
    borderDiv.style.border = "1px solid #B3B3B3";
    borderDiv.style.outline = "none";

    addPhotoFormContainer.appendChild(closeButton);
    addPhotoFormContainer.appendChild(fileInputLabel);
    addPhotoFormContainer.appendChild(photoFileInput);
    addPhotoFormContainer.appendChild(photoTitleInput);
    addPhotoFormContainer.appendChild(photoCategorySelecte);
    addPhotoFormContainer.appendChild(addButton);
    addPhotoFormContainer.appendChild(previewImageContainer);
    addPhotoFormContainer.appendChild(rectangle);
    addPhotoFormContainer.appendChild(borderDiv);

    rectangle.appendChild(fileInputLabel);
    rectangle.appendChild(photoFileInput);

    const backButton = document.createElement("i");
    backButton.classList.add("fas", "fa-arrow-left");
    backButton.style.position = "absolute";
    backButton.style.top = "23px";
    backButton.style.left = "23px";
    backButton.style.fontSize = "21px";
    backButton.style.cursor = "pointer";
    backButton.addEventListener("click", () => {
        generateGalleryInModal();
        photoAddFormExists = false;
    });

    const categories = await fetchCategories();

    const photoCategorySelect = addPhotoFormContainer.querySelector("#photoCategory");

    categories.push({ id: "", name: "" })

    categories.reverse();
    categories.forEach((category) => {
        const option = document.createElement("option");

        if (category.id === "") {
            option.value = "";
            option.disabled = true;
            option.selected = true;
        } else {
            option.value = category.id;
            option.text = category.name;
        }
        photoCategorySelect.appendChild(option);
    });

    addPhotoFormContainer.addEventListener("submit", (event) => {
        event.preventDefault();
        addPhoto();
    });

    sectionGallery.appendChild(addPhotoFormContainer);
    sectionGallery.appendChild(backButton);

    const maxFileSizeText = document.createElement("p");
    maxFileSizeText.textContent = "jpg, png : 4 Mo max";
    maxFileSizeText.classList.add("custom-max-file-size"); 
    sectionGallery.appendChild(maxFileSizeText);

    const closeModalButton = document.getElementById('closeAddPhotoForm');
    const overlay = document.querySelector('.overlay');

    closeModalButton.addEventListener('click', () => {
        overlay.style.display = 'none';
        photoAddFormExists = false;
    });
}


async function fetchCategories() {
    try {
        const res = await fetch("http://localhost:5678/api/categories");
        return await res.json();
    } catch (error) {
        console.error("Erreur :", error);
        return [];
    }
}

function previewImage() {
    const photoFileInput = document.getElementById("photoFile");
    const previewImageContainer = document.getElementById("previewImageContainer");
    const fileInputLabel = document.getElementById("fileInputLabel");
    const icon = document.getElementById("icon");

    if (photoFileInput.files.length > 0) {
        const file = photoFileInput.files[0];
        const imageURL = URL.createObjectURL(file);

        const previewImage = document.createElement("img");
        previewImage.src = imageURL;
        
      
        previewImage.classList.add("preview-image");

        previewImageContainer.innerHTML = "";
        previewImageContainer.appendChild(previewImage);

       
        fileInputLabel.style.display = "none";
        addPhotoFormValidator.image.value = file;
    }

    if (addPhotoFormValidator.image.value && addPhotoFormValidator.title.value && addPhotoFormValidator.category.value) {
        document.getElementById("submitButton").classList.add('active');
    }
}

async function addPhoto() {
    try {
        const photoFileInput = document.getElementById("photoFile");
        const photoTitleInput = document.getElementById("photoTitle");
        const photoCategorySelect = document.getElementById("photoCategory");
        
        if (photoFileInput.files.length === 0) {
            alert("Veuillez sélectionner une image.");
            return;
        }

        const formData = new FormData();
        formData.append("image", photoFileInput.files[0]);
        formData.append("title", photoTitleInput.value);
        formData.append("category", photoCategorySelect.value);

       
        const token = localStorage.token;

      
        const response = await fetch("http://localhost:5678/api/works", {
            method: "POST",
            headers: {
                accept: "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });

        
        if (response.ok) {
            const result = await response.json()
            addPicture(result)
            document.querySelector(".overlay").style.display = "none";
            photoAddFormExists= false;
        } else {
           
            alert("Erreur");
        }
    } catch (error) {
        console.error("Erreur :", error);
    }
}


const closeModalButton = document.getElementById('closeModal');
const overlay = document.querySelector('.overlay');

closeModalButton.addEventListener('click', () => {
    overlay.style.display = 'none';
    photoAddFormExists= false;
});

overlay.addEventListener('click', (event) => {
    if (event.target === overlay) {
        overlay.style.display = 'none';
        photoAddFormExists= false;
    }
});




