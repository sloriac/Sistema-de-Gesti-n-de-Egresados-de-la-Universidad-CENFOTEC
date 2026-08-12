console.log("El JS sí se está cargando");

// URL de la API
const API_URL = "http://localhost:3000/oportunidades-laborales";

// ID del usuario que publica la oportunidad
const ID_USUARIO = "6a6bfd5a5feb7bdc9243b743";

// Seleccionar los elementos del DOM
const empresa = document.getElementById("empresa");
const puesto = document.getElementById("puesto");
const descripcion = document.getElementById("descripcionTrabajo");
const area = document.getElementById("area");
const modalidad = document.getElementById("modalidadTrabajo");
const ubicacion = document.getElementById("ubicacionTrabajo");
const fechaPublicacion = document.getElementById("fechaPublicacion");
const fechaVencimiento = document.getElementById("fechaVencimiento");
const contacto = document.getElementById("contacto");
const estado = document.getElementById("estadoTrabajo");

const formulario = document.getElementById("formOportunidad");
const btnGuardar = document.getElementById("guardarOportunidad");

// Funciones de validación
function validarCorreo(correo) {
return /^[^\s@]+@[^\s@]+.[^\s@]+$/.test(correo);
}

function mostrarError(campo, mensaje) {

campo.classList.add("input-error");

let mensajeExistente = campo.nextElementSibling;

if (!mensajeExistente || !mensajeExistente.classList.contains("mensaje-error")) {

    let errorP = document.createElement("p");

    errorP.className = "mensaje-error";
    errorP.textContent = mensaje;

    campo.parentNode.insertBefore(errorP, campo.nextSibling);

} else {

    mensajeExistente.textContent = mensaje;

}

}

function limpiarError(campo) {

campo.classList.remove("input-error");

let mensajeExistente = campo.nextElementSibling;

if (mensajeExistente && mensajeExistente.classList.contains("mensaje-error")) {
    mensajeExistente.remove();
}


}

function resaltarCamposVacios() {

let error = false;

// Empresa
if (empresa.value.trim() === "") {
    mostrarError(empresa, "Este campo es obligatorio.");
    error = true;
} else {
    limpiarError(empresa);
}

// Puesto
if (puesto.value.trim() === "") {
    mostrarError(puesto, "Este campo es obligatorio.");
    error = true;
} else {
    limpiarError(puesto);
}

// Descripción
if (descripcion.value.trim() === "") {
    mostrarError(descripcion, "Este campo es obligatorio.");
    error = true;
} else if (descripcion.value.trim().length < 20) {
    mostrarError(descripcion, "Debe ingresar al menos 20 caracteres.");
    error = true;
} else {

    limpiarError(descripcion);
}

// Área
if (area.value === "") {
    mostrarError(area, "Este campo es obligatorio.");
    error = true;
} else {
    limpiarError(area);
}

// Modalidad
if (modalidad.value === "") {
    mostrarError(modalidad, "Este campo es obligatorio.");
    error = true;
} else {
    limpiarError(modalidad);
}

// Ubicación
if (ubicacion.value.trim() === "") {
    mostrarError(ubicacion, "Este campo es obligatorio.");
    error = true;
} else {
    limpiarError(ubicacion);
}
// Fecha Publicación
if (fechaPublicacion.value === "") {
    mostrarError(fechaPublicacion, "Este campo es obligatorio.");
    error = true;
} else {
    limpiarError(fechaPublicacion);
}

// Fecha Vencimiento
if (fechaVencimiento.value === "") {
    mostrarError(fechaVencimiento, "Este campo es obligatorio.");
    error = true;
} else if (
    fechaPublicacion.value !== "" &&
    fechaVencimiento.value < fechaPublicacion.value
) {
    mostrarError(
        fechaVencimiento,
        "La fecha no puede ser anterior a la de publicación."
    );
    error = true;
} else {
    limpiarError(fechaVencimiento);
}

// Correo / Contacto
if (contacto.value.trim() === "") {
    mostrarError(contacto, "Este campo es obligatorio.");
    error = true;
} else if (!validarCorreo(contacto.value.trim())) {
    mostrarError(contacto, "Debe ingresar un correo válido.");
    error = true;
} else {
    limpiarError(contacto);
}

// Estado
if (estado.value === "") {
    mostrarError(estado, "Este campo es obligatorio.");
    error = true;
} else {
    limpiarError(estado);
}
return error;

}

// POST - GUARDAR OPORTUNIDAD EN LA API
async function guardarOportunidad(e) {
e.preventDefault();
const hayError = resaltarCamposVacios();
if (hayError) {
    return;
}

// Objeto con la estructura exacta que espera la API
const nuevaOportunidad = {

    publicadoPor: ID_USUARIO,

    empresa: empresa.value.trim(),

    puesto: puesto.value.trim(),

    descripcion: descripcion.value.trim(),

    areaProfesional: area.value,

    modalidad: modalidad.value,

    ubicacion: ubicacion.value.trim(),

    fechaPublicacion: fechaPublicacion.value,

    fechaVencimiento: fechaVencimiento.value,

    contacto: contacto.value.trim(),

    estado: estado.value
};


try {
    const respuesta = await fetch(API_URL, {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(nuevaOportunidad)
    });


    if (!respuesta.ok) {
        throw new Error(
            "No se pudo registrar la oportunidad. Código: " +
            respuesta.status
        );
    }


    const resultado = await respuesta.json();
    console.log("Oportunidad registrada:", resultado);

    // Limpiar formulario
    formulario.reset();

    // Actualizar la tabla utilizando GET
    await obtenerOportunidades();

    alert("Oportunidad registrada correctamente.");

} catch (error) {
    console.error("Error al registrar la oportunidad:", error);

    alert(
        "Ocurrió un error al registrar la oportunidad. " +
        "Verifique que el servidor esté funcionando."
    );
}


}
// GET - OBTENER OPORTUNIDADES DESDE LA API
async function obtenerOportunidades() {

try {

    const respuesta = await fetch(API_URL);

    if (!respuesta.ok) {

        throw new Error(
            "No se pudieron consultar las oportunidades. Código: " +
            respuesta.status
        );

    }


    const oportunidades = await respuesta.json();

    mostrarOportunidades(oportunidades);

} catch (error) {

    console.error("Error al consultar las oportunidades:", error);

    mostrarErrorTabla(
        "No se pudieron cargar las oportunidades laborales."
    );

}


}

// MOSTRAR OPORTUNIDADES EN LA TABLA

function mostrarOportunidades(oportunidades) {

let tabla = document.getElementById("tablaOportunidades");

if (tabla === null) {

    tabla = document.createElement("table");

    tabla.id = "tablaOportunidades";

    tabla.border = "1";


    tabla.innerHTML =
        "<thead>" +
        "<tr>" +
        "<th>Empresa</th>" +
        "<th>Puesto</th>" +
        "<th>Descripción</th>" +
        "<th>Área profesional</th>" +
        "<th>Modalidad</th>" +
        "<th>Ubicación</th>" +
        "<th>Fecha de publicación</th>" +
        "<th>Fecha de vencimiento</th>" +
        "<th>Contacto</th>" +
        "<th>Estado</th>" +
        "<th>Publicado por</th>" +
        "</tr>" +
        "</thead>" +
        "<tbody></tbody>";


    formulario.parentNode.appendChild(tabla);

}


let cuerpo = tabla.querySelector("tbody");

cuerpo.innerHTML = "";


for (let i = 0; i < oportunidades.length; i++) {

    const op = oportunidades[i];

    //publicadoPor puede ser null o sino, muestra el email para no mostrar contraseñas
    const publicadoPor = op.publicadoPor
    ? op.publicadoPor.email
    : "N/A";

    cuerpo.innerHTML +=
        "<tr>" +
        "<td>" + op.empresa + "</td>" +
        "<td>" + op.puesto + "</td>" +
        "<td>" + op.descripcion + "</td>" +
        "<td>" + op.areaProfesional + "</td>" +
        "<td>" + op.modalidad + "</td>" +
        "<td>" + op.ubicacion + "</td>" +
        "<td>" + op.fechaPublicacion.substring(0, 10) + "</td>" +
        "<td>" + op.fechaVencimiento.substring(0, 10) + "</td>" +
        "<td>" + op.contacto + "</td>" +
        "<td>" + op.estado + "</td>" +
        "<td>" + publicadoPor + "</td>" +
        "</tr>";

}


}

// MOSTRAR ERROR EN LA TABLA

function mostrarErrorTabla(mensaje) {

let tabla = document.getElementById("tablaOportunidades");


if (tabla === null) {

    tabla = document.createElement("table");

    tabla.id = "tablaOportunidades";

    tabla.border = "1";

    tabla.innerHTML =
        "<thead>" +
        "<tr>" +
        "<th>Empresa</th>" +
        "<th>Puesto</th>" +
        "<th>Descripción</th>" +
        "<th>Área profesional</th>" +
        "<th>Modalidad</th>" +
        "<th>Ubicación</th>" +
        "<th>Fecha de publicación</th>" +
        "<th>Fecha de vencimiento</th>" +
        "<th>Contacto</th>" +
        "<th>Estado</th>" +
        "<th>Publicado por</th>" +
        "</tr>" +
        "</thead>" +
        "<tbody></tbody>";


    formulario.parentNode.appendChild(tabla);

}

let cuerpo = tabla.querySelector("tbody");

cuerpo.innerHTML =
    "<tr>" +
    "<td colspan='11'>" +
    mensaje +
    "</td>" +
    "</tr>";

}

formulario.addEventListener("submit", guardarOportunidad);

obtenerOportunidades();