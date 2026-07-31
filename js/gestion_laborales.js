console.log("El JS sí se está cargando");

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

let indiceEditar = -1;

// Funciones de validación
function validarCorreo(correo) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
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
    let error = false; // Asumir que no hay errores

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
    } else if (fechaPublicacion.value !== "" && fechaVencimiento.value < fechaPublicacion.value) {
        mostrarError(fechaVencimiento, "La fecha no puede ser anterior a la de publicación.");
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

function guardarOportunidad(e) {

    e.preventDefault();

    const hayError = resaltarCamposVacios();

    if (hayError) {
        return;
    }

    let oportunidades = JSON.parse(localStorage.getItem("oportunidades"));

    if (oportunidades === null) {
        oportunidades = [];
    }

    let existe = false;

    for (let i = 0; i < oportunidades.length; i++) {
        if (
            oportunidades[i].empresa === empresa.value &&
            oportunidades[i].puesto === puesto.value &&
            i !== indiceEditar
        ) {
            existe = true;
        }
    }

    if (existe) {
        alert("La oportunidad laboral ya existe.");
        return;
    }

    const nuevaOportunidad = {
        empresa: empresa.value,
        puesto: puesto.value,
        descripcion: descripcion.value,
        area: area.value,
        modalidad: modalidad.value,
        ubicacion: ubicacion.value,
        fechaPublicacion: fechaPublicacion.value,
        fechaVencimiento: fechaVencimiento.value,
        contacto: contacto.value,
        estado: estado.value
    };

    if (indiceEditar === -1) {
        oportunidades.push(nuevaOportunidad);
    } else {
        oportunidades[indiceEditar] = nuevaOportunidad;
        indiceEditar = -1;
        btnGuardar.textContent = "Publicar oportunidad";
    }

    localStorage.setItem("oportunidades", JSON.stringify(oportunidades));

    formulario.reset();

    mostrarOportunidades();

    alert("Oportunidad registrada correctamente.");

}

function mostrarOportunidades() {

    let oportunidades = JSON.parse(localStorage.getItem("oportunidades"));

    if (oportunidades === null) {
        oportunidades = [];
    }

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
        "<th>Modalidad</th>" +
        "<th>Estado</th>" +
        "<th>Acciones</th>" +
        "</tr>" +
        "</thead>" +
        "<tbody></tbody>";

        formulario.parentNode.appendChild(tabla);

    }

    let cuerpo = tabla.querySelector("tbody");

    cuerpo.innerHTML = "";

    for (let i = 0; i < oportunidades.length; i++) {

        cuerpo.innerHTML +=
        "<tr>" +
        "<td>" + oportunidades[i].empresa + "</td>" +
        "<td>" + oportunidades[i].puesto + "</td>" +
        "<td>" + oportunidades[i].modalidad + "</td>" +
        "<td>" + oportunidades[i].estado + "</td>" +
        "<td>" +
        "<button type='button' onclick='editarOportunidad(" + i + ")'>Editar</button> " +
        "<button type='button' onclick='eliminarOportunidad(" + i + ")'>Eliminar</button>" +
        "</td>" +
        "</tr>";

    }

}

function editarOportunidad(indice) {

    let oportunidades = JSON.parse(localStorage.getItem("oportunidades"));

    empresa.value = oportunidades[indice].empresa;
    puesto.value = oportunidades[indice].puesto;
    descripcion.value = oportunidades[indice].descripcion;
    area.value = oportunidades[indice].area;
    modalidad.value = oportunidades[indice].modalidad;
    ubicacion.value = oportunidades[indice].ubicacion;
    fechaPublicacion.value = oportunidades[indice].fechaPublicacion;
    fechaVencimiento.value = oportunidades[indice].fechaVencimiento;
    contacto.value = oportunidades[indice].contacto;
    estado.value = oportunidades[indice].estado;

    indiceEditar = indice;

    btnGuardar.textContent = "Actualizar oportunidad";

}

function eliminarOportunidad(indice) {

    if (!confirm("¿Desea eliminar esta oportunidad?")) {
        return;
    }

    let oportunidades = JSON.parse(localStorage.getItem("oportunidades"));

    oportunidades.splice(indice, 1);

    localStorage.setItem("oportunidades", JSON.stringify(oportunidades));

    mostrarOportunidades();

}

btnGuardar.addEventListener("click", guardarOportunidad);

mostrarOportunidades();