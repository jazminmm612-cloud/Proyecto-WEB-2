const menuToggle = document.getElementById("menu-toggle");
const sidebar = document.getElementById("sidebar");

menuToggle.addEventListener("click", () => {
  sidebar.classList.toggle("open");
  menuToggle.classList.toggle("active"); 
});

if (location.pathname.endsWith('/')) {
    history.replaceState({}, '', location.pathname.slice(0, -1)); 
}


document.querySelector(".formulario").addEventListener("submit", function (e) {
    e.preventDefault(); 

    // Obtener valores
    let peso = parseFloat(document.querySelectorAll(".form-group input")[0].value);
    let altura = parseFloat(document.querySelectorAll(".form-group input")[1].value);
    let actividad = document.querySelectorAll(".form-group select")[0].value;
    let objetivo = document.querySelectorAll(".form-group select")[1].value;
    let sexo = document.querySelector('input[name="sexo"]:checked');

    if (!peso || !altura || !actividad || !objetivo || !sexo) {
        alert("Por favor completa todos los campos.");
        return;
    }

    altura /= 100; // m a cm

   
    let tmb = (sexo.value === "hombre")
        ? 10 * peso + 6.25 * (altura * 100) - 5 * 25 + 5
        : 10 * peso + 6.25 * (altura * 100) - 5 * 25 - 161;

    const factorActividad = {
        sedentario: 1.2,
        ligero: 1.375,
        moderado: 1.55,
        intenso: 1.725,
        muy_intenso: 1.9
    };

    let caloriasActividad = tmb * factorActividad[actividad];
    let caloriasObjetivo = (objetivo === "bajar") 
        ? caloriasActividad - 400
        : (objetivo === "subir")
        ? caloriasActividad + 300
        : caloriasActividad;

    // resultados
    document.getElementById("tmb").value = Math.round(tmb) + " kcal";
    document.getElementById("caloriasActividad").value = Math.round(caloriasActividad) + " kcal";
    document.getElementById("caloriasObjetivo").value = Math.round(caloriasObjetivo) + " kcal";


    document.getElementById("texto-inicial").style.display = "none";

    document.getElementById("contenedor-resultados").style.display = "block";

    // boton
    const boton = document.getElementById("btn-siguiente");
    const contenedorBoton = document.getElementById("btn-container");
    document.querySelector(".resultados").appendChild(contenedorBoton);
    boton.disabled = false;

});


