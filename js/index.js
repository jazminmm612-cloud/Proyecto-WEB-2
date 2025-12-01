
//Codigo para busqueda de AJAX con las operaciones  
//URL base 
const API_BASE = "http://www.nutrilink.com/api"; 
 
// utilidades 
function qs(sel, parent = document) { return parent.querySelector(sel); } 
function qsa(sel, parent = document) { return [...parent.querySelectorAll(sel)]; } 
 
// cliente 
async function apiRequest(endpoint, options = {}) { 
 
    const url = `${API_BASE}${endpoint.startsWith("/") ? endpoint : "/" + endpoint}`; 
 
    const config = { 
        method: options.method || "GET", 
        headers: { 
            "Content-Type": "application/json", 
            ...(options.headers || {}) 
        } 
    }; 
 
    if (options.body) { 
        config.body = JSON.stringify(options.body); 
    } 
 
    try { 
        const res = await fetch(url, config); 
        const text = await res.text(); 
 
        if (!res.ok) { 
            throw new Error(`HTTP ${res.status} → ${text}`); 
        } 
 
        try { 
            return JSON.parse(text); 
        } catch { 
            return null; 
        } 
 
    } catch (err) { 
        console.error("Error", err); 
        throw err; 
    } 
} 
 
// metodos 
const api = { 
    get: (endpoint) => apiRequest(endpoint), 
    post: (endpoint, body) => apiRequest(endpoint, { method: "POST", body }), 
    put: (endpoint, body) => apiRequest(endpoint, { method: "PUT", body }), 
    delete: (endpoint) => apiRequest(endpoint, { method: "DELETE" }) 
}; 
 
// ingredientes 
async function apiGetIngredientes() { 
    return await api.get("/ingredientes"); 
} 
 
// platillos 
async function apiGetPlatillos() { 
    return await api.get("/platillos"); 
} 
 
// Guardar platillo (según el PDF) 
async function apiPostPlatillo(nombre, ingredientesArray) { 
    return await api.post("/platillos", { 
        nombre: nombre, 
        ingredientes: ingredientesArray 
    }); 
} 
 
// buscar por nombre 
async function apiBuscarPlatillo(nombre) { 
    return await api.get(`/platillos/byname?name=${encodeURIComponent(nombre)}`); 
} 
 
// calcular kcal 
async function apiCalcularKcal(id) { 
    return await api.post(`/platillos/${id}/calcular-kcal`); 
} 
 
async function apiCalcularIntake(data) { 
    return await api.post("/calcular-kcal-intake", data); 
}


//Codigo para controlar los platillos y buscarlos
//sistema de platillos 
async function guardarPlatillo(platilloActual, platillos) { 
 
    const ingredientes = platillos[platilloActual].map(i => i.nombre); 
 
    if (ingredientes.length === 0) { 
        alert("No puedes guardar un platillo vacío."); 
        return; 
    } 
 
    const nombre = `Platillo ${platilloActual}`; 
 
    try { 
        const res = await apiPostPlatillo(nombre, ingredientes); 
        alert("Platillo guardado con éxito."); 
    } catch (err) { 
        alert("Error al guardar el platillo."); 
        console.error(err); 
    } 
} 

