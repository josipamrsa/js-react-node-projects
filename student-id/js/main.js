window.onload = function() {
    // Očisti podatke iz browsera da se ne učitava nova slika
    localStorage.clear(); 
    // Generiraj datum izrade
    document.getElementById("p-datum").innerHTML = new Date().toLocaleDateString("en-US"); 
    // Na klik provjeri i generiraj iskaznicu
    document.getElementById("generiraj").addEventListener("click", () => { validirajPodatke(); }); 
}

function validirajPodatke() {  
    // Podaci su u formi pa se inputi lako mogu dohvatiti
    var forma = document.forms["unosForma"]; 
    var info = document.getElementById("info-poruka");
    var flag = false;

    // Prostor za info poruke - čisti prethodno
    info.innerHTML = "";

    // Vrši provjeru postojanja slike u localStorage i popunjenost inputa forme
    if (localStorage.getItem("img") === null) {
        info.innerHTML += "Odaberite profilnu fotografiju!<br>";
        flag = true;
    } 

    var inputi = {
        "ime" : forma.ime.value, 
        "prezime" : forma.prezime.value, 
        "fakultet" : forma.fakultet.value, 
        "mjesto" : forma.mjesto.value
    };

    Object.keys(inputi).forEach(key => {
        if (inputi[key].length == 0) {
            info.innerHTML += "Unesite podatak: " + key + "!<br>";
            flag = true;
        } 
    });  
    
    inputi["slika"] = localStorage["img"];

    // Ako nema pogrešaka generira se iskaznica
    if (!flag) generirajIskaznicu(inputi, info);
}

function generirajIskaznicu(podaci) {  
    // Reset forme od unesenih podataka
    document.forms["unosForma"].reset();

    // Unos dobivenih podataka u prikladne elemente
    document.getElementById("p-ime").innerText = podaci["ime"];    
    document.getElementById("p-prezime").innerText = podaci["prezime"];  
    document.getElementById("p-fakultet").innerText = podaci["fakultet"];  
    document.getElementById("p-mjesto").innerText = podaci["mjesto"];   

    // Generiranje broja iskaznice
    const brojIskaznice = (max) => { return Math.floor(Math.random() * Math.floor(max)); }
    document.getElementById("p-broj").innerText = brojIskaznice(10000000);   

    document.getElementById("profilna-slika").src = podaci["slika"];
    localStorage.clear();      
}

var ucitanaSlika = (event) => {
    /*
    
    Kako sama putanja učitane slike nema nikakve vrijednosti jer je lažan podatak zbog sigurnosti, onda
    se slika učitava preko FileReadera. Slika se učitava u obliku Data URI-a, kojim se omogucava enkodiranje
    slike u oblik stringa i embediranje direktno u HTML/CSS strukturu. 
    https://medium.com/@martin.crabtree/the-what-and-when-of-a-data-uri-599fe72f90d8

    Kad se slika učita preko Readera, onda se sprema u localStorage da bi se kasnije mogla dohvatiti
    kod validacije podataka. Izvedeno je tako upravo zato što se putanja dohvaćena kasnije preko validacije
    ne može iskoristiti zato jer je lažna.

    */
    if (typeof(Storage) !== "undefined") {
        var slika = event.target;
        var citac = new FileReader();
        citac.onload = () => {         
            localStorage.setItem("img", citac.result);
        }
        citac.readAsDataURL(slika.files[0]);
      } 
      
      else {
        console.log("Nema podrške za LocalStorage");
      }  
}
