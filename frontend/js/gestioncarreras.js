// Variables para los inputs principales
const inputCodigo = document.getElementById("codigo-carrera");
const inputNombre = document.getElementById("nombre-carrera");
const inputDescripcion = document.getElementById("descripcion-carrera");
const inputEscuela = document.getElementById("escuela-carrera");
const inputDuracion = document.getElementById("duracion-carrera");
const inputCreditos = document.getElementById("creditos-carrera");
const inputModalidad = document.getElementById("modalidad-carrera");
const inputEstado = document.getElementById("estado-carrera");

const contadorDescripcion = document.getElementById("contador-descripcion-carrera");

const API = "http://localhost:3000/carreras";

const botonRegistrar = document.getElementById("crear-carrera");

// Spans donde se muestra cada mensaje de error (están vacíos en el HTML,
// el JS les pone el texto cuando corresponde)
const errorCodigo = document.getElementById("error-codigo-carrera");
const errorNombre = document.getElementById("error-nombre-carrera");
const errorDescripcion = document.getElementById("error-descripcion-carrera");
const errorEscuela = document.getElementById("error-escuela-carrera");
const errorDuracion = document.getElementById("error-duracion-carrera");
const errorCreditos = document.getElementById("error-creditos-carrera");
const errorModalidad = document.getElementById("error-modalidad-carrera");
const errorEstado = document.getElementById("error-estado-carrera");

const mensajeExito = document.getElementById("mensaje-exito");
const contenedorLista = document.getElementById("lista-carreras");
const mensajeVacio = document.getElementById("mensaje-vacio");


// FUNCIONES DE VALIDACIÓN
// (validamos los 8 campos, aunque al backend solo viajen nombre y descripción,
// porque el formulario le pide estos datos a la persona igual)

function validarCodigo(codigo) {
    return /^CAR-\d{3}$/i.test(codigo);
}

function validarNombre(nombre) {
    return /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]{5,80}$/.test(nombre);
}

function validarDescripcion(descripcion) {
    return descripcion.length >= 10 && descripcion.length <= 300;
}

function validarEscuela(escuela) {
    return /^ESC-\d{3}$/i.test(escuela);
}

function validarDuracion(duracion) {
    if (!/^\d{1,2}(\.[05])?$/.test(duracion)) return false;
    const numero = parseFloat(duracion);
    return numero >= 1 && numero <= 8;
}

function validarCreditos(creditos) {
    if (!/^\d{1,4}$/.test(creditos)) return false;
    return parseInt(creditos, 10) > 0;
}

function validarModalidad(modalidad) {
    return /^(presencial|virtual|h[ií]brida)$/i.test(modalidad);
}

function validarEstado(estado) {
    return /^(activa|inactiva)$/i.test(estado);
}


// FUNCIÓN PARA RESALTAR ERRORES
// A diferencia de título (que ocultaba/mostraba un mensaje ya escrito en el HTML),
// aquí los spans de error vienen vacíos, así que hay que escribirles el texto con textContent.
function resaltarCamposVacios() {
    let error = false; // Asumimos que no hay errores

    // Comprobación para el código
    const codigo = inputCodigo.value.trim();
    if (!validarCodigo(codigo)) {
        inputCodigo.classList.add("invalido");
        errorCodigo.textContent = "Use el formato CAR- seguido de 3 dígitos, por ejemplo: CAR-014.";
        error = true;
    } else {
        inputCodigo.classList.remove("invalido");
        errorCodigo.textContent = "";
    }

    // Comprobación para el nombre
    const nombre = inputNombre.value.trim();
    if (!validarNombre(nombre)) {
        inputNombre.classList.add("invalido");
        errorNombre.textContent = "Ingrese solo letras y espacios (mínimo 5 caracteres).";
        error = true;
    } else {
        inputNombre.classList.remove("invalido");
        errorNombre.textContent = "";
    }

    // Comprobación para la descripción
    const descripcion = inputDescripcion.value.trim();
    if (!validarDescripcion(descripcion)) {
        inputDescripcion.classList.add("invalido");
        errorDescripcion.textContent = "La descripción debe tener entre 10 y 300 caracteres.";
        error = true;
    } else {
        inputDescripcion.classList.remove("invalido");
        errorDescripcion.textContent = "";
    }

    // Comprobación para la escuela
    const escuela = inputEscuela.value.trim();
    if (!validarEscuela(escuela)) {
        inputEscuela.classList.add("invalido");
        errorEscuela.textContent = "Use el formato ESC- seguido de 3 dígitos, por ejemplo: ESC-001.";
        error = true;
    } else {
        inputEscuela.classList.remove("invalido");
        errorEscuela.textContent = "";
    }

    // Comprobación para la duración
    const duracion = inputDuracion.value.trim();
    if (!validarDuracion(duracion)) {
        inputDuracion.classList.add("invalido");
        errorDuracion.textContent = "Ingrese un número entre 1 y 8 (puede usar .5 para medios años).";
        error = true;
    } else {
        inputDuracion.classList.remove("invalido");
        errorDuracion.textContent = "";
    }

    // Comprobación para los créditos
    const creditos = inputCreditos.value.trim();
    if (!validarCreditos(creditos)) {
        inputCreditos.classList.add("invalido");
        errorCreditos.textContent = "Ingrese solo números mayores a 0, por ejemplo: 160.";
        error = true;
    } else {
        inputCreditos.classList.remove("invalido");
        errorCreditos.textContent = "";
    }

    // Comprobación para la modalidad
    const modalidad = inputModalidad.value.trim();
    if (!validarModalidad(modalidad)) {
        inputModalidad.classList.add("invalido");
        errorModalidad.textContent = "Escriba: Presencial, Virtual o Híbrida.";
        error = true;
    } else {
        inputModalidad.classList.remove("invalido");
        errorModalidad.textContent = "";
    }

    // Comprobación para el estado
    const estado = inputEstado.value.trim();
    if (!validarEstado(estado)) {
        inputEstado.classList.add("invalido");
        errorEstado.textContent = "Escriba: Activa o Inactiva.";
        error = true;
    } else {
        inputEstado.classList.remove("invalido");
        errorEstado.textContent = "";
    }

    return error;
}


// Contador de caracteres en vivo para la descripción (detalle visual, no afecta la validación)
function actualizarContadorDescripcion() {
    const longitud = inputDescripcion.value.length;
    contadorDescripcion.textContent = `${longitud} / 300`;
}
inputDescripcion.addEventListener("input", actualizarContadorDescripcion);


// FUNCIÓN PARA VALIDAR LOS CAMPOS VACÍOS
function validarCamposVacios(event) {
    mensajeExito.textContent = "";
    event.preventDefault();

    const error = resaltarCamposVacios();
    if (!error) {
        guardarRegistro();
    }
}

function limpiarFormulario() {
    document.getElementById("form-carreras").reset();
    actualizarContadorDescripcion();
}


// JSON — POST
async function guardarRegistro() {

    // Solo mandamos nombre y descripción, porque son los únicos campos
    // que existen en el modelo de Carrera en el backend
    const nuevoRegistro = {
        nombre: inputNombre.value.trim(),
        descripcion: inputDescripcion.value.trim()
    };

    try {
        const respuesta = await fetch(API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(nuevoRegistro)
        });

        if (!respuesta.ok) throw new Error(`Error del servidor (${respuesta.status})`);

        Swal.fire({
            title: "Registro Exitoso",
            text: "La carrera fue registrada exitosamente",
            icon: "success"
        });

        await obtenerCarreras();
        limpiarFormulario();

    } catch (error) {
        Swal.fire({
            title: "Error",
            text: "No se pudo registrar la carrera: " + error.message,
            icon: "error"
        });
    }
}


// GET
async function obtenerCarreras() {
    try {
        const respuesta = await fetch(API);

        if (!respuesta.ok) throw new Error("No se pudieron consultar las carreras");

        const carreras = await respuesta.json();

        renderizarLista(carreras);

    } catch (error) {
        Swal.fire({
            title: "Error",
            text: error.message,
            icon: "error"
        });
    }
}


// Dibuja la lista de carreras que devuelve el servidor.
// Solo mostramos nombre y descripción porque son los únicos datos reales que existen.
function renderizarLista(carreras) {
    contenedorLista.innerHTML = "";

    if (carreras.length === 0) {
        mensajeVacio.style.display = "block";
        return;
    }

    mensajeVacio.style.display = "none";

    carreras.forEach(carrera => {
        const articulo = document.createElement("article");
        articulo.className = "tarjeta-carrera";
        articulo.innerHTML = `
            <h3>${carrera.nombre}</h3>
            <p><strong>Descripción:</strong> ${carrera.descripcion ?? "-"}</p>
        `;
        contenedorLista.appendChild(articulo);
    });
}

// Al cargar la página, consultar lo que ya existe en el servidor
document.addEventListener("DOMContentLoaded", obtenerCarreras);

// Para que también funcione con Enter
document.getElementById("form-carreras").addEventListener("submit", validarCamposVacios);