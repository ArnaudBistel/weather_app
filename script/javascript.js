/**
* Fichier qui regroupe le code javascript pour la page index.html
*/

// vérifie qu'il y a bien eu une saisie dans le formulaire
function checker_ville(formulaire) {
    // affiche un pop up si mauvaise saisie
    if (formulaire.ville.value == null ||  formulaire.ville.value == "" ) {alert("Ville saisie invalide.\n")}
    // appel la fonction qui appelle l'API sinon
    else {
       chercher_meteo(formulaire);
    }
}


// permet de valider la saisie par appui sur la touche ENTER
document.onkeydown=function(evt){
    var keyCode = evt ? (evt.which ? evt.which : evt.keyCode) : event.keyCode;
    if(keyCode == 13)
    {
        // permet d'empêcher la page de se recharger à cause de la validation du formulaire
        // (index.html?ville=...)
        evt.preventDefault();
        checker_ville(document.form);
    }
}

// Méthode qui effectue la requête à l'API en spécifiant la ville saisie par l'utilisateur
// ainsi que certain paramètre concernant la langue et le système métrique.
// Elle insert les données obtenues dans le document html index.html
function chercher_meteo(formulaire) {
    var req = new XMLHttpRequest();

    // appel asynchrone
    req.onreadystatechange = function() {
    // si succès de la réponse de l'API
     if (this.readyState == 4 && this.status == 200) {
       var meteo_json = JSON.parse(this.responseText);

       // pour le débuggage
       console.log(meteo_json);

       //récupère les paramètres concis à affaicher en premier
       var temperature = meteo_json.main.temp;
       var meteo_icone = meteo_json.weather[0].icon;
       var meteo_desc = meteo_json.weather[0].description;

       // masque la vue d'erreur si elle a été affichée précédemment
       var error_label = document.getElementById("error");
       error_label.setAttribute("class", "hidden");
       error_label.setAttribute("style", "display: none");

       // rend le tabelau de réponse visible
       var tabl = document.getElementById("tableau");
       tabl.setAttribute("class", "w3-table w3-table-all w3-bordered unhidden");

       // création de la partie textuelle de la prévision météo affcihée sur le site
       var desc_res = document.getElementById("text");

       // formate l'affichage du nom de la ville pour avoir la première lettre en majuscule
       // et le reste en minuscule
       var ville_formated = formulaire.ville.value.trim();
       var first_letter = (ville_formated.substring(0,1)).toUpperCase();
       var ville_rest = ville_formated.substring(1).toLowerCase();
       ville_formated = first_letter + ville_rest;

       desc_res.innerHTML = "À " + ville_formated + ", il fait " + temperature + "°C, "
       + meteo_desc + ".";

       // création du logo représentant la météo actuelle
       var image_res = document.getElementById("logo");
       // appel de l'API pour obtenirr le bon logo
       image_res.setAttribute("src", "http://openweathermap.org/img/w/" + meteo_icone + ".png");


       // ----
       // Paramètres supplémentaires affichés lorsque l'utilisateur appuie sur "voir_plus"
       // ----
       var lat = meteo_json.coord.lat;
       var lat_case = document.getElementById("lat");
       lat_case.innerHTML = lat + "°";

       var long = meteo_json.coord.lon;
       var long_case = document.getElementById("long");
       long_case.innerHTML = long + "°";

       var press = meteo_json.main.pressure;
       var pression_case = document.getElementById("pression").innerHTML = press + " hPa";

       var humidity = meteo_json.main.humidity;
       var hum_case = document.getElementById("hum").innerHTML = humidity + "%";

       var temp_max = meteo_json.main.temp_max;
       var temp_max_case = document.getElementById("temp_max").innerHTML = temp_max + "°C";

       var temp_min = meteo_json.main.temp_min;
       document.getElementById("temp_min").innerHTML = temp_min + "°C";

       var visibility = meteo_json.visibility;
       document.getElementById("visibilite").innerHTML = visibility +" m";

       var clouds = meteo_json.clouds.all;
       document.getElementById("clouds").innerHTML = clouds +"%";

       var wind_speed = meteo_json.wind.speed;
       document.getElementById("vent").innerHTML = wind_speed + " m/s";
     }

     // si échec de l'appel ( cas où pas de réponse pour la ville saisie)
     if (this.status == 404) {
       // rend visible la vue d'erreur
       var error_label = document.getElementById("error");
       error_label.setAttribute("class", "unhidden");
       error_label.setAttribute("style", "display: block");


       // masque le tableau si il avait été affiché précédemment via une réponse réussie
       var tabl = document.getElementById("tableau");
       tabl.setAttribute("class", "w3-table w3-table-all w3-bordered hidden");
       var tabl = document.getElementById("tableau_etendu");
       tabl.setAttribute("class", "w3-table w3-table-all w3-bordered hidden");

       // modifie l'apparence du bouton qui permet d'étendre le tableau
       var boutton_voir_plus = document.getElementById("voir_plus");
       boutton_voir_plus.innerHTML = "Voir plus";

       // création de la partie textuelle de la vue d'erreur
       var desc_res = document.getElementById("error_text");
       desc_res.innerHTML = "Veuillez saisir un nom de ville française.";

       // création du logo de la vue d'éereur
       var image_res = document.getElementById("error_logo");
       image_res.setAttribute("src", "img/oops_logo.jpg");
       image_res.setAttribute("class", "oops_logo");
     }

 };

// appel de l'API en spécifiant la ville saisie par l'utilisateur
 var url = "http://api.openweathermap.org/data/2.5/weather?q=" + formulaire.ville.value;
 url += ",fr&APPID=ee07e2bf337034f905cde0bdedae3db8&units=metric&lang=fr ";

 req.open("GET", url, true);
 req.send();
}

// fonction qui permet de dérouler le tableau de météo pour afficher des infos plus détaillées
function etendre_tableau() {
    // si le tableau est déjà déroulé on appelle la méthode pour le réduire
    if ( document.getElementById("voir_plus").innerHTML == "Voir moins" ){
    	reduire_tableau();

    // sinon on déroule le tableau
    }else {
      // récupère le tableau
      var tabl_etendu = document.getElementById("tableau_etendu");

    	// remplace la classe css "cachée" par "visible"
      tabl_etendu.setAttribute("class", "w3-table w3-table-all w3-bordered unhidden");

    // modifie le texte contenu dans le bouton pour étendre le tableau
      var boutton_voir_plus = document.getElementById("voir_plus");
      boutton_voir_plus.innerHTML = "Voir moins";
    // modifie le comportement du bouton en cas de clic
      boutton_voir_plus.setAttribute("onclick", "reduire_tableau()");
     }
}


// méthode qui réduit le tableau de météo pour n'afficher que les infos concises
function reduire_tableau() {
    // remplace la classe css "visible" par "cachée"
    var tabl_etendu = document.getElementById("tableau_etendu");
    tabl_etendu.setAttribute("class", "w3-table w3-table-all w3-bordered hidden");

    // modifie le texte contenu dans le bouton pour étendre le tableau
    var boutton_voir_plus = document.getElementById("voir_plus");
    boutton_voir_plus.innerHTML = "Voir plus";
    // modifie le comportement du bouton en cas de clic
    boutton_voir_plus.setAttribute("onclick", "etendre_tableau()");
}
