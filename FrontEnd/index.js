let gallery = window.localStorage.getItem("gallery");
const res = await fetch ("http://localhost:5678/api/works");
const pictures = await res.json();


export function galleryGeneration (picture){
    
    for(let i=0; i<picture.length; i++){
        const sectionGallery = document.querySelector(".gallery");
        const pictureElement = document.createElement("figure");

        const img = document.createElement("img");
        img.src = pictures[i].imageUrl;

        const nomElement = document.createElement ("figcaption")
        nomElement.innerText = pictures[i].title; 
        pictureElement.dataset.id = pictures[i].id;

        sectionGallery.appendChild(pictureElement);
        pictureElement.appendChild(img);
        pictureElement.appendChild(nomElement);

    };
};

export function addPicture (picture) {
    const sectionGallery = document.querySelector(".gallery");
    const pictureElement = document.createElement("figure");

    const img = document.createElement("img");
    img.src = picture.imageUrl;

    const nomElement = document.createElement ("figcaption")
    nomElement.innerText = picture.title; 
    pictureElement.dataset.id = picture.id;

    sectionGallery.appendChild(pictureElement);
    pictureElement.appendChild(img);
    pictureElement.appendChild(nomElement);
}

galleryGeneration(pictures);






/******************************* filter area  *******************************/


const getCategories = await fetch ("http://localhost:5678/api/categories");
const pictureCategories = await getCategories.json(); 

const generateButton = ({id, name}) => {
    
    const button = document.createElement("button");
    button.classList.add("btn-object");
    button.id = `category-${id}`
    button.textContent = name;

    button.addEventListener("click", () => {
        let pictureListElement = document.querySelector(".gallery");
        pictureListElement.innerHTML = '';

        if (id === 'all') {
            pictureListElement.innerHTML = pictures.map(picture =>`<figure>
            <img src="${picture.imageUrl}" alt="${picture.title}">
            <figcaption>${picture.title}</figcaption>
        </figure>`).join('');
            
            return;
        }
      
        const filteredPictureList = pictures.filter(picture => picture.categoryId === id );

        pictureListElement.innerHTML = filteredPictureList.map(picture =>`<figure>
        <img src="${picture.imageUrl}" alt="${picture.title}">
        <figcaption>${picture.title}</figcaption>
    </figure>`).join('')
    });

    return button;
}

const filterList = document.querySelector("#filterList");

filterList.appendChild(
    generateButton(
        {id: 'all', name: 'Tous'}
    )
);

for (const pictureCategory of pictureCategories) {
    const button = generateButton(pictureCategory);
    filterList.appendChild(button);
}

/**********************  active  ************************/

const buttons = document.querySelectorAll('.btn-object');


function ActiveClasses() {
    buttons.forEach(button => {
        button.classList.remove('active');
    });
}

buttons.forEach(button => {
    button.addEventListener('click', function() {
       
     ActiveClasses();
       
        button.classList.add('active');
    });
});
