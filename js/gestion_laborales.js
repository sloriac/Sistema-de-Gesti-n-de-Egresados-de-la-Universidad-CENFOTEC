console.log("El JS sí se está cargando");

// Seleccionar elementos del DOM.
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

// Se utiliza querySelector como lo solicita la práctica
const primerInput = document.querySelector("input");

let indiceEditar = -1;

// Validación con Regex
function validarCorreo(correo) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
}

function guardarOportunidad(e) {

    e.preventDefault();

    let error = false;

    const campos = formulario.querySelectorAll("input[required], select[required], textarea[required]");

    campos.forEach(function(campo) {

        if (campo.value.trim() === "") {
            campo.classList.add("input-error");
            error = true;
        } else {
            campo.classList.remove("input-error");
        }

    });

    if (descripcion.value.trim().length < 20) {
        descripcion.classList.add("input-error");
        error = true;
    }

  if (!validarCorreo(contacto.value.trim())) {
    contacto.classList.add("input-error");
    error = true;
    } else {
        contacto.classList.remove("input-error");
    }

    if (fechaVencimiento.value < fechaPublicacion.value) {
        alert("La fecha de vencimiento no puede ser anterior a la fecha de publicación.");
        fechaVencimiento.classList.add("input-error");
        error = true;
    } else {
        fechaVencimiento.classList.remove("input-error");
    }

    if (error) {
        alert("Debe completar correctamente los campos obligatorios.");
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
