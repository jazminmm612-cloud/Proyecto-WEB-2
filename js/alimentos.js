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
    proteina: document.getElementById("proteina"),
    carb: document.getElementById("carb"),
    grasas: document.getElementById("grasas")
};

// Objeto para mapear rápidamente Nombre del Ingrediente -> kcal/g
const caloriasMap = ingredientesFitness.reduce((map, item) => {
    map[item.nombre] = item.kcal_por_gramo;
    return map;
}, {});


// --- GESTIÓN DE PLATILLOS (Variables Globales) ---
// Objeto para almacenar todas las recetas por su ID.
let recetasGuardadas = JSON.parse(localStorage.getItem('recetasGuardadas')) || {};

// Variable para saber qué platillo estamos editando. Siempre inicia en 'btn-platillo-1'.
let platilloActivoId = 'btn-platillo-1'; 


// ----------------------------------------------------
// FUNCIONES DE CÁLCULO Y GESTIÓN DE ESTADO
// ----------------------------------------------------

/**
 * Calcula la suma total de calorías de los ingredientes y actualiza el input "Actual".
 */
function actualizarCaloriasActuales() {
    let caloriasTotales = 0;
    
    document.querySelectorAll(".fila-input").forEach(fila => {
        const nombre = fila.querySelector(".input-nombre").value;
        const cantidadStr = fila.querySelector(".input-cantidad").value;
        
        const cantidadGramos = parseInt(cantidadStr) || 0; 

        if (nombre && caloriasMap[nombre]) {
            caloriasTotales += caloriasMap[nombre] * cantidadGramos;
        }
    });

    // Actualiza el input "Actual" y lo redondea
    document.getElementById("input-actual").value = Math.round(caloriasTotales) + " kcal";
}

/**
 * Guarda el estado actual de los inputs del DOM en 'recetasGuardadas' para el platillo activo.
 */
function guardarPlatillo() {
    const ingredientesPlatillo = [];

    document.querySelectorAll(".fila-input").forEach(fila => {
        const nombre = fila.querySelector(".input-nombre").value;
        const cantidad = fila.querySelector(".input-cantidad").value;
        
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
        const filas = Array.from(nutriente.querySelectorAll(".fila-input"));
        
        // Mantiene solo la primera fila y la vacía
        filas.slice(1).forEach(fila => fila.remove());
        
        if (filas.length > 0) {
            filas[0].querySelector(".input-nombre").value = "";
            filas[0].querySelector(".input-cantidad").value = "";
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
                    filaTarget = nutrienteContenedor.querySelector(".fila-input");
                } else {
                    // Si no, clonamos una nueva fila
                    const filaOriginal = nutrienteContenedor.querySelector(".fila-input");
                    filaTarget = filaOriginal.cloneNode(true);
                    // Aseguramos que el clon tenga valores vacíos antes de rellenar si es necesario
                    filaTarget.querySelector(".input-nombre").value = "";
                    filaTarget.querySelector(".input-cantidad").value = "";
                    nutrienteContenedor.appendChild(filaTarget);
                }
                
                // Asignamos los valores
                filaTarget.querySelector(".input-nombre").value = item.nombre;
                filaTarget.querySelector(".input-cantidad").value = item.cantidad;
                
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
    const inputOptimo = document.getElementById('input-optimo');
    const caloriasOptimas = localStorage.getItem('caloriasOptimas');

    if (inputOptimo) {
        inputOptimo.value = caloriasOptimas ? caloriasOptimas + " kcal" : "N/D";
    }

    // Listener para el cálculo dinámico
    document.querySelector(".down").addEventListener('input', (e) => {
        if (e.target.classList.contains('input-cantidad')) {
            actualizarCaloriasActuales();
        }
    });
}

/**
 * Función unificada para la eliminación y el recálculo (Maneja el botón 'X').
 */
const manejarEliminacion = (fila) => {
    const contenedorNutriente = fila.closest(".nutriente");
    const filasExistentes = contenedorNutriente.querySelectorAll(".fila-input");

    if (filasExistentes.length > 1) {
        fila.remove();
    } else {
        fila.querySelector(".input-nombre").value = "";
        fila.querySelector(".input-cantidad").value = "";
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
document.getElementById("filtroCategoria").addEventListener("change", e => {
    const cat = e.target.value;
    document.querySelectorAll(".ingrediente").forEach(div => {
        div.style.display = (cat === "todos" || div.dataset.cat === cat) ? "block" : "none";
    });
});

document.getElementById("busquedaIngrediente").addEventListener("input", e => {
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

document.querySelector(".btn button").addEventListener("click", () => {
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
            let inputTarget = Array.from(nutriente.querySelectorAll(".input-nombre"))
                .find(input => input.value === "");

            if (!inputTarget) {
                const filaOriginal = nutriente.querySelector(".fila-input");
                const nuevaFila = filaOriginal.cloneNode(true);
                
                nuevaFila.querySelector(".input-nombre").value = "";
                nuevaFila.querySelector(".input-cantidad").value = "";
                
                nutriente.appendChild(nuevaFila);
                inputTarget = nuevaFila.querySelector(".input-nombre");
            }

            inputTarget.value = ingredienteSeleccionado;
            inputTarget.closest(".fila-input").querySelector(".input-cantidad").value = "0";
            
            actualizarCaloriasActuales(); 
        }
    });

    document.querySelectorAll(".ingrediente").forEach(d => d.classList.remove("seleccionado"));
    ingredienteSeleccionado = null;
    categoriaSeleccionada = null;
});

// **********************************************
// 🌟 CORRECCIÓN 1: Agregar guardarPlatillo() al limpiar
// **********************************************
document.getElementById("btnLimpiar").addEventListener("click", () => {
    // Para limpiar, llamamos a manejarEliminacion en cada fila
    document.querySelectorAll(".nutriente").forEach(nutriente => {
        Array.from(nutriente.querySelectorAll(".fila-input")).reverse().forEach(fila => {
            manejarEliminacion(fila);
        });
    });
    
    // Guardamos el platillo activo como vacío
    guardarPlatillo(); 
});


document.querySelector(".down").addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-x')) {
        manejarEliminacion(e.target.closest(".fila-input"));
    }
});

document.getElementById("btnGuardar").addEventListener("click", () => {
    guardarPlatillo(); 
    
    // Lógica de impresión a consola (se mantiene)
    const datos = [];
    document.querySelectorAll(".nutriente").forEach(nutriente => {
        const filas = nutriente.querySelectorAll(".fila-input");
        filas.forEach(fila => {
            const ingrediente = fila.querySelector(".input-nombre").value;
            const cantidad = fila.querySelector(".input-cantidad").value;
            if (ingrediente) { datos.push({ categoria: nutriente.querySelector("h3").textContent, ingrediente, cantidad }); }
        });
    });
    console.log("Datos guardados:", datos);
    alert("¡Datos guardados en consola!");
});




// ----------------------------------------------------
// INICIALIZACIÓN DE PLATILLOS Y ARRANQUE
// ----------------------------------------------------

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


// INICIALIZACIÓN FINAL DEL SCRIPT
cargarIngredientes();
inicializarCalculoCalorias(); 
inicializarBotonesPlatillos();

// **********************************************
// 🌟 CORRECCIÓN 2: Guardado Automático al Recargar
// **********************************************
// Asegura que los últimos cambios se guarden antes de que el usuario cierre o recargue.
window.addEventListener('beforeunload', () => {
    guardarPlatillo();
});