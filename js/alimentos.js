const ingredientesFitness = [
    // Grasas (9 kcal/g)
    { nombre: "Aceite de Oliva", cat: "grasas", kcal_por_gramo: 9.0 }, 
    { nombre: "Aguacate", cat: "grasas", kcal_por_gramo: 1.6 },
    { nombre: "Frutos Secos", cat: "grasas", kcal_por_gramo: 6.0 }, 
    { nombre: "Salmón", cat: "grasas", kcal_por_gramo: 2.0 }, 
    { nombre: "Semillas", cat: "grasas", kcal_por_gramo: 5.5 }, 
    
    // Carbohidratos (4 kcal/g)
    { nombre: "Arroz", cat: "carb", kcal_por_gramo: 1.3 },
    { nombre: "Avena", cat: "carb", kcal_por_gramo: 3.8 },
    { nombre: "Camote", cat: "carb", kcal_por_gramo: 0.8 },
    { nombre: "Quinoa", cat: "carb", kcal_por_gramo: 1.4 },
    { nombre: "Pasta", cat: "carb", kcal_por_gramo: 1.5 },
    
    // Proteínas (4 kcal/g)
    { nombre: "Carne Roja", cat: "proteina", kcal_por_gramo: 2.5 }, 
    { nombre: "Huevo", cat: "proteina", kcal_por_gramo: 1.4 },
    { nombre: "Legumbres", cat: "proteina", kcal_por_gramo: 1.1 },
    { nombre: "Pescado", cat: "proteina", kcal_por_gramo: 1.0 },
    { nombre: "Pollo", cat: "proteina", kcal_por_gramo: 1.6 }
];

// Contenedores (Elementos del DOM)
const contenedores = {
    proteina: document.getElementById("Proteina"),
    carb: document.getElementById("Carbohidratos"),
    grasas: document.getElementById("Grasas")
};

// Objeto para mapear rápidamente Nombre del Ingrediente -> kcal/g
const caloriasMap = ingredientesFitness.reduce((map, item) => {
    map[item.nombre] = item.kcal_por_gramo;
    return map;
}, {});


// --- GESTIÓN DE PLATILLOS (Variables Globales) ---
// Objeto para almacenar todas las recetas por su ID.
let recetasGuardadas = JSON.parse(localStorage.getItem('recetasGuardadas')) || {};

// Variable para saber qué platillo estamos editando. Siempre inicia en 'BotonPlatillo1'.
let platilloActivoId = 'BotonPlatillo1'; 


// ----------------------------------------------------
// FUNCIONES DE CÁLCULO Y GESTIÓN DE ESTADO
// ----------------------------------------------------

/**
 * Calcula la suma total de calorías de los ingredientes y actualiza el input "Actual".
 */
function actualizarCaloriasActuales() {
    let caloriasTotales = 0;
    
    document.querySelectorAll(".fila-entrada").forEach(fila => {
        const nombre = fila.querySelector(".entrada-nombre").value;
        const cantidadStr = fila.querySelector(".entrada-cantidad").value;
        
        const cantidadGramos = parseInt(cantidadStr) || 0; 

        if (nombre && caloriasMap[nombre]) {
            caloriasTotales += caloriasMap[nombre] * cantidadGramos;
        }
    });

    // Actualiza el input "Actual" y lo redondea
    document.getElementById("InputActual").value = Math.round(caloriasTotales) + " kcal";
}

/**
 * Guarda el estado actual de los inputs del DOM en 'recetasGuardadas' para el platillo activo.
 */
function guardarPlatillo() {
    const ingredientesPlatillo = [];

    document.querySelectorAll(".fila-entrada").forEach(fila => {
        const nombre = fila.querySelector(".entrada-nombre").value;
        const cantidad = fila.querySelector(".entrada-cantidad").value;
        
        // Solo guarda si el ingrediente tiene un nombre
        if (nombre) {
            ingredientesPlatillo.push({
                nombre: nombre,
                cantidad: cantidad 
            });
        }
    });

    // Usa el ID del platillo activo para guardar la receta en el objeto global
    recetasGuardadas[platilloActivoId] = ingredientesPlatillo;
    
    // Guarda el objeto completo en el almacenamiento local del navegador
    localStorage.setItem('recetasGuardadas', JSON.stringify(recetasGuardadas));
}

/**
 * Carga los ingredientes de un ID de platillo en el DOM.
 * Si el platillo no existe en recetasGuardadas, se limpia el formulario.
 */
function cargarPlatillo(id) {
    // 1. Limpieza total y reinicio del DOM para el nuevo platillo
    document.querySelectorAll(".nutriente").forEach(nutriente => {
        const filas = Array.from(nutriente.querySelectorAll(".fila-entrada"));
        
        // Mantiene solo la primera fila y la vacía
        filas.slice(1).forEach(fila => fila.remove());
        
        if (filas.length > 0) {
            filas[0].querySelector(".entrada-nombre").value = "";
            filas[0].querySelector(".entrada-cantidad").value = "";
        }
    });

    // 2. Carga los ingredientes guardados para el nuevo platillo.
    const receta = recetasGuardadas[id] || [];
    
    // Si la receta existe, la cargamos.
    if (receta.length > 0) {
        let inputContador = { 'proteina': 0, 'carb': 0, 'grasas': 0 };

        receta.forEach(item => {
            const ingredienteData = ingredientesFitness.find(i => i.nombre === item.nombre);
            if (!ingredienteData) return; 
            
            const categoria = ingredienteData.cat;
            const nutrienteContenedor = contenedores[categoria];

            if (nutrienteContenedor) {
                let filaTarget = null;
                
                // Si es el primer ingrediente de esta categoría, usamos la fila existente (que limpiamos)
                if (inputContador[categoria] === 0) {
                    filaTarget = nutrienteContenedor.querySelector(".fila-entrada");
                } else {
                    // Si no, clonamos una nueva fila
                    const filaOriginal = nutrienteContenedor.querySelector(".fila-entrada");
                    filaTarget = filaOriginal.cloneNode(true);
                    // Aseguramos que el clon tenga valores vacíos antes de rellenar si es necesario
                    filaTarget.querySelector(".entrada-nombre").value = "";
                    filaTarget.querySelector(".entrada-cantidad").value = "";
                    nutrienteContenedor.appendChild(filaTarget);
                }
                
                // Asignamos los valores
                filaTarget.querySelector(".entrada-nombre").value = item.nombre;
                filaTarget.querySelector(".entrada-cantidad").value = item.cantidad;
                
                inputContador[categoria]++;
            }
        });
    }

    // 3. Resalta el botón activo
    document.querySelectorAll('.platillos button').forEach(btn => btn.classList.remove('activo'));
    const btnActivo = document.getElementById(id);
    if (btnActivo) {
        btnActivo.classList.add('activo');
    }

    // 4. Actualiza el total de calorías actuales
    actualizarCaloriasActuales();
    
    // 5. Guarda el ID del platillo como activo
    platilloActivoId = id;
}

/**
 * Carga el objetivo calórico de localStorage y añade listeners dinámicos.
 */
function inicializarCalculoCalorias() {
    const inputOptimo = document.getElementById('InputOptimo');
    const caloriasOptimas = localStorage.getItem('caloriasOptimas');

    if (inputOptimo) {
        inputOptimo.value = caloriasOptimas ? caloriasOptimas + " kcal" : "N/D";
    }

    // Listener para el cálculo dinámico
    document.querySelector(".abajo").addEventListener('input', (e) => {
        if (e.target.classList.contains('entrada-cantidad')) {
            actualizarCaloriasActuales();
        }
    });
}

/**
 * Función unificada para la eliminación y el recálculo (Maneja el botón 'X').
 */
const manejarEliminacion = (fila) => {
    const contenedorNutriente = fila.closest(".nutriente");
    const filasExistentes = contenedorNutriente.querySelectorAll(".fila-entrada");

    if (filasExistentes.length > 1) {
        fila.remove();
    } else {
        fila.querySelector(".entrada-nombre").value = "";
        fila.querySelector(".entrada-cantidad").value = "";
    }
    
    actualizarCaloriasActuales(); 
};


// ----------------------------------------------------
// LÓGICA DE INTERFAZ Y EVENTOS
// ----------------------------------------------------

// Cargar ingredientes en HTML
function cargarIngredientes() {
    ingredientesFitness.forEach(i => {
        const div = document.createElement("div");
        div.classList.add("ingrediente");
        div.textContent = i.nombre;
        div.dataset.cat = i.cat;
        contenedores[i.cat].appendChild(div);
    });
}

// Event Listeners (Filtro, Búsqueda, Selección, Agregar, Limpiar, Eliminar, Guardar, Imprimir)
document.getElementById("FiltroCategoria").addEventListener("change", e => {
    const cat = e.target.value;
    document.querySelectorAll(".ingrediente").forEach(div => {
        div.style.display = (cat === "todos" || div.dataset.cat === cat) ? "block" : "none";
    });
});

document.getElementById("BusquedaIngrediente").addEventListener("input", e => {
    const texto = e.target.value.toLowerCase();
    document.querySelectorAll(".ingrediente").forEach(div => {
        div.style.display = div.textContent.toLowerCase().includes(texto) ? "block" : "none";
    });
});

let ingredienteSeleccionado = null;
let categoriaSeleccionada = null;

document.addEventListener("click", e => {
    if (e.target.classList.contains("ingrediente")) {
        document.querySelectorAll(".ingrediente").forEach(d => d.classList.remove("seleccionado"));
        e.target.classList.add("seleccionado");
        ingredienteSeleccionado = e.target.textContent;
        categoriaSeleccionada = e.target.dataset.cat;
    }
});

document.querySelector(".boton button").addEventListener("click", () => {
    if (!ingredienteSeleccionado || !categoriaSeleccionada) {
        alert("Selecciona primero un ingrediente.");
        return;
    }

    document.querySelectorAll(".nutriente").forEach(nutriente => {
        const h3 = nutriente.querySelector("h3").textContent.toLowerCase();
        
        if (
            (categoriaSeleccionada === "proteina" && h3.includes("proteína")) ||
            (categoriaSeleccionada === "carb" && h3.includes("carbohidrato")) ||
            (categoriaSeleccionada === "grasas" && h3.includes("grasa"))
        ) {
            let inputTarget = Array.from(nutriente.querySelectorAll(".entrada-nombre"))
                .find(input => input.value === "");

            if (!inputTarget) {
                const filaOriginal = nutriente.querySelector(".fila-entrada");
                const nuevaFila = filaOriginal.cloneNode(true);
                
                nuevaFila.querySelector(".entrada-nombre").value = "";
                nuevaFila.querySelector(".entrada-cantidad").value = "";
                
                nutriente.appendChild(nuevaFila);
                inputTarget = nuevaFila.querySelector(".entrada-nombre");
            }

            inputTarget.value = ingredienteSeleccionado;
            inputTarget.closest(".fila-entrada").querySelector(".entrada-cantidad").value = "0";
            
            actualizarCaloriasActuales(); 
        }
    });

    document.querySelectorAll(".ingrediente").forEach(d => d.classList.remove("seleccionado"));
    ingredienteSeleccionado = null;
    categoriaSeleccionada = null;
});


document.getElementById("BotonLimpiar").addEventListener("click", () => {
    // Para limpiar, llamamos a manejarEliminacion en cada fila
    document.querySelectorAll(".nutriente").forEach(nutriente => {
        Array.from(nutriente.querySelectorAll(".fila-entrada")).reverse().forEach(fila => {
            manejarEliminacion(fila);
        });
    });
    
    // Guardamos el platillo activo como vacío
    guardarPlatillo(); 
});


document.querySelector(".abajo").addEventListener('click', (e) => {
    if (e.target.classList.contains('boton-equis')) {
        manejarEliminacion(e.target.closest(".fila-entrada"));
    }
});

document.getElementById("BotonGuardar").addEventListener("click", () => {
    guardarPlatillo(); 
    
    // Lógica de impresión a consola (se mantiene)
    const datos = [];
    document.querySelectorAll(".nutriente").forEach(nutriente => {
        const filas = nutriente.querySelectorAll(".fila-entrada");
        filas.forEach(fila => {
            const ingrediente = fila.querySelector(".entrada-nombre").value;
            const cantidad = fila.querySelector(".entrada-cantidad").value;
            if (ingrediente) { datos.push({ categoria: nutriente.querySelector("h3").textContent, ingrediente, cantidad }); }
        });
    });
    console.log("Datos guardados:", datos);
    alert("¡Datos guardados en consola!");
});



document.getElementById("BotonImprimir").addEventListener("click", () => {
    guardarPlatillo();
    
    // frase motivacional de localStorage
    const mensajeMotivacional = localStorage.getItem('mensajeMotivacional') || '¡Sigue así!';
    const actividadLabel = localStorage.getItem('actividadLabel') || '';
    
    // actualizar el elemento para la frase 
    let fraseElement = document.querySelector('.frase-motivacional-print');
    if (!fraseElement) {
        fraseElement = document.createElement('div');
        fraseElement.className = 'frase-motivacional-print';
        document.querySelector('.izquierda').appendChild(fraseElement);
    }
   
    let textoFrase = '';
    if (actividadLabel) {
        textoFrase += `<strong>${actividadLabel}:</strong> `;
    }
    textoFrase += mensajeMotivacional;
    
    fraseElement.innerHTML = textoFrase;
    

    fraseElement.style.display = 'block';
    fraseElement.style.visibility = 'visible';
    
    console.log('Preparando para imprimir...');
    console.log('Frase motivacional:', textoFrase);
    
    const afterPrint = () => {

        fraseElement.style.display = 'none';
        fraseElement.style.visibility = 'hidden';
        
        window.removeEventListener('afterprint', afterPrint);
    };
    
    window.addEventListener('afterprint', afterPrint);

    window.print();

});


/**
 * Inicializa los listeners de los botones de platillo.
 */
function inicializarBotonesPlatillos() {
    const botonesPlatillo = document.querySelectorAll('.platillos button');

    botonesPlatillo.forEach(btn => {
        btn.addEventListener('click', () => {
            const nuevoId = btn.id;
            
            // 1. GUARDA el estado del platillo ANTES de cambiar (la clave para la navegación)
            guardarPlatillo(); 
            
            // 2. CARGA el nuevo platillo
            cargarPlatillo(nuevoId);
        });
    });

    // 3. Carga el platillo inicial al arrancar.
    cargarPlatillo(platilloActivoId);
}


cargarIngredientes();
inicializarCalculoCalorias(); 
inicializarBotonesPlatillos();

// Asegura que los últimos cambios se guarden antes de que el usuario cierre o recargue.
window.addEventListener('beforeunload', () => {
    guardarPlatillo();
});