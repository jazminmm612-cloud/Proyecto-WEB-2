// menú móvil
document.addEventListener('DOMContentLoaded', function() {
  const menuToggle = document.getElementById('AlternarMenu');
  const sidebar = document.getElementById('BarraLateral');
  
  if (menuToggle && sidebar) {
    menuToggle.addEventListener('click', function(e) {
      e.stopPropagation();
      sidebar.classList.toggle('activa');
    });

    document.addEventListener('click', function(e) {
      if (sidebar.classList.contains('activa') && 
          !sidebar.contains(e.target) && 
          !menuToggle.contains(e.target)) {
        sidebar.classList.remove('activa');
      }
    });

    window.addEventListener('resize', function() {
      if (window.innerWidth > 768 && sidebar.classList.contains('activa')) {
        sidebar.classList.remove('activa');
      }
    });
  }
});



document.querySelector(".formulario").addEventListener("submit", function (e) {
    e.preventDefault(); 

    // Obtener valores
    let peso = parseFloat(document.querySelectorAll(".grupo-formulario input")[0].value);
    let altura = parseFloat(document.querySelectorAll(".grupo-formulario input")[1].value);
    let actividad = document.querySelectorAll(".grupo-formulario select")[0].value;
    let objetivo = document.querySelectorAll(".grupo-formulario select")[1].value;
    let sexo = document.querySelector('input[name="sexo"]:checked');

    if (!peso || !altura || !actividad || !objetivo || !sexo) {
        alert("Por favor completa todos los campos.");
        return;
    }

    altura /= 100; // cm a m

   
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

    //mostrar resultados
    document.getElementById("Tmb").value = Math.round(tmb) + " kcal";
    document.getElementById("CaloriasActividad").value = Math.round(caloriasActividad) + " kcal";
    document.getElementById("CaloriasObjetivo").value = Math.round(caloriasObjetivo) + " kcal";

    //localStorage para la siguiente página
    localStorage.setItem('caloriasOptimas', Math.round(caloriasObjetivo));

    // Se guarda el id, etiqueta y un mensaje motivacional.
    localStorage.setItem('actividadNivel', actividad);

    const actividadLabels = {
      sedentario: 'Sedentario',
      ligero: 'Actividad ligera',
      moderado: 'Actividad moderada',
      intenso: 'Actividad intensa',
      muy_intenso: 'Actividad muy intensa'
    };

    const mensajesMotivacionales = {
      sedentario: '¡Pequeños pasos cuentan! Intenta caminar 10–15 minutos al día y ve aumentando gradualmente. Consejo de sueño: intenta dormir 7–9 horas y evita pantallas 30 minutos antes de acostarte.',
      ligero: '¡Bien hecho! Mantén tu constancia y añade 10 minutos más a tus sesiones si te sientes con energía. Consejo de sueño: apunta a 7–9 horas y sigue una rutina relajante antes de dormir.',
      moderado: '¡Excelente! Continúa con este ritmo y considera incluir fuerza 2 veces por semana. Consejo de sueño: duerme 7–9 horas y añade estiramientos suaves para mejorar la recuperación muscular.',
      intenso: '¡Genial! Mantén una buena recuperación y escucha a tu cuerpo para evitar sobrecargas. Consejo de sueño: prioriza el sueño profundo (7–9 horas) y evita entrenar muy tarde.',
      muy_intenso: '¡Eres un atleta! Prioriza la recuperación, la nutrición y el sueño para rendir al máximo. Consejo de sueño: procura 7–9 horas, mejora la higiene del sueño y considera siestas cortas cuando las necesites.'
    };

    //mensaje para usar despues
    localStorage.setItem('actividadLabel', actividadLabels[actividad] || actividad);
    localStorage.setItem('mensajeMotivacional', mensajesMotivacionales[actividad] || '¡Sigue así!');

    document.getElementById("TextoInicial").style.display = "none";

    document.getElementById("ContenedorResultados").style.display = "block";

    //habilitar botón siguiente
    const BotonSiguiente = document.getElementById("BotonSiguiente");
    const ContenedorBoton = document.getElementById("ContenedorBoton");
    document.querySelector(".resultados").appendChild(ContenedorBoton);
    BotonSiguiente.disabled = false;

});


