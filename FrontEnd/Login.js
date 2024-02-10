const form = {
 email : document.getElementById('email'),
 password : document.getElementById("password"),
 submit : document.getElementById("connexion"),
};

let button = form.submit.addEventListener("click", (e)=>{
e.preventDefault();
const login = "http://localhost:5678/api/users/login"; 

fetch(login, {
   method: "POST", 
   headers: {accept: "application/json", "Content-Type": "application/json", },
   body: JSON.stringify ({ email: form.email.value, password: form.password.value,}),
})
.then((response) => response.json())
        
    .then((data) => {
      
      console.log("data:" , data);
     
      if (data.message === "user not found" || data.error){
        alert("Error Password or Username");
      } else {
        open(
            "index.html"
        ); 
        localStorage.token = data.token;
      }
    })
    .catch((err) => {
      console.log("erreur : ", err);
    });
});


