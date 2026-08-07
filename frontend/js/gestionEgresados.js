/* ================================
   GESTIÓN DE EGRESADOS - Tarea 2
   ================================ */

/* --- Seleccionar los elementos del DOM --- */
const inputIdentificacion = document.getElementById("identificacion");
const inputNombre = document.getElementById("nombre");
const inputCorreo = document.getElementById("correo");
const inputTelefono = document.getElementById("telefono");
const inputFechaRegistro = document.getElementById("fecha-registro");
const inputLugarTrabajo = document.getElementById("lugar-trabajo");

const btnRegistrarEgresado = document.getElementById("guardar-egresado");

/* --- Funciones de validación (regex) --- */

function validarIdentificacion(identificacion) {
    return /^[0-9]{8,12}$/.test(identificacion);
}

function validarNombreCompleto(nombre) {
    return nombre.length >= 2;
}

function validarCorreo(correo) {
    return /^[a-z]+@[a-z]+\.[a-z]{2,4}(\.[a-z]{2,4})?$/.test(correo);
}

function validarTelefono(telefono) {
    return /^[0-9]{8}$/.test(telefono);
}

/* --- Fecha de registro automática --- */
function establecerFechaActual() {
    const hoy = new Date();
    const anno = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    const dia = String(hoy.getDate()).padStart(2, '0');
    inputFechaRegistro.value = `${anno}-${mes}-${dia}`;
}

/* --- Resaltar campos con error y devolver si hubo algún error --- */
function resaltarCamposVacios() {
    let error = false;

    // Identificación
    const identificacion = inputIdentificacion.value.trim();
    if (!validarIdentificacion(identificacion)) {
        inputIdentificacion.classList.add("input-error");
        error = true;
    } else {
        inputIdentificacion.classList.remove("input-error");
    }

    // Nombre completo
    const nombre = inputNombre.value.trim();
    if (!validarNombreCompleto(nombre)) {
        inputNombre.classList.add("input-error");
        error = true;
    } else {
        inputNombre.classList.remove("input-error");
    }

    // Correo
    const correo = inputCorreo.value.trim();
    if (!validarCorreo(correo)) {
        inputCorreo.classList.add("input-error");
        error = true;
    } else {
        inputCorreo.classList.remove("input-error");
    }

    // Teléfono
    const telefono = inputTelefono.value.trim();
    if (!validarTelefono(telefono)) {
        inputTelefono.classList.add("input-error");
        error = true;
    } else {
        inputTelefono.classList.remove("input-error");
    }

    return error;
}

/* --- Crear objeto y guardar en Local Storage --- */
function guardarEgresado() {
    // 1. Crear el objeto con los datos del formulario
    const nuevoEgresado = {
        identificacion: inputIdentificacion.value.trim(),
        nombre: inputNombre.value.trim(),
        correo: inputCorreo.value.trim(),
        telefono: inputTelefono.value.trim(),
        fechaRegistro: inputFechaRegistro.value,
        lugarTrabajo: inputLugarTrabajo.value.trim()
    };

    // 2. Leer lista existente en Local Storage (o crear una vacía si no hay nada aún)
    const egresadosGuardados = JSON.parse(localStorage.getItem("egresados")) || [];

    // 3. Agregar el nuevo egresado a la lista
    egresadosGuardados.push(nuevoEgresado);

    // 4. Guardar la lista completa de vuelta en Local Storage
    localStorage.setItem("egresados", JSON.stringify(egresadosGuardados));

    // 5. Mostrar en consola para verificar
    console.log("Lista completa de egresados registrados:", egresadosGuardados);

    // 6. Limpiar el formulario
    document.querySelector(".formulario").reset();
    establecerFechaActual(); // volver a poner la fecha de hoy después de limpiar

    // 7. Actualizar la lista visual de egresados
    mostrarEgresados();
}

/* --- Mostrar la lista de egresados guardados en pantalla --- */
function mostrarEgresados() {
    const contenedorEgresados = document.getElementById("egresados-registrados");
    const egresadosGuardados = JSON.parse(localStorage.getItem("egresados")) || [];

    // Quitar los <article> anteriores (pero dejar el <h2>)
    const articulosExistentes = contenedorEgresados.querySelectorAll("article");
    articulosExistentes.forEach(articulo => articulo.remove());

    // Crear un <article> por cada egresado
    egresadosGuardados.forEach(egresado => {
        const nuevoArticulo = document.createElement("article");
        nuevoArticulo.innerHTML = `
            <h3>${egresado.nombre}</h3>
            <p><strong>Identificación:</strong> ${egresado.identificacion}</p>
            <p><strong>Correo:</strong> ${egresado.correo}</p>
            <p><strong>Teléfono:</strong> ${egresado.telefono}</p>
            <p><strong>Fecha de registro:</strong> ${egresado.fechaRegistro}</p>
            <p><strong>Lugar de trabajo:</strong> ${egresado.lugarTrabajo || "No especificado"}</p>
        `;
        contenedorEgresados.appendChild(nuevoArticulo);
    });
}

/* --- Validar y mostrar mensajes con SweetAlert2 --- */
function validarCamposVacios() {
    const error = resaltarCamposVacios();
    if (error) {
        Swal.fire({
            title: "No se puede registrar el egresado",
            text: "Por favor, complete todos los campos requeridos correctamente.",
            icon: "warning",
            confirmButtonText: "Regresar"
        });
    } else {
        guardarEgresado();
        Swal.fire({
            title: "Egresado registrado",
            text: "Los datos han sido guardados correctamente.",
            icon: "success",
            confirmButtonText: "Aceptar"
        });
    }
}

/* --- Inicialización y eventos --- */
establecerFechaActual();
mostrarEgresados();

btnRegistrarEgresado.addEventListener("click", function (e) {
    e.preventDefault();
    validarCamposVacios();
});