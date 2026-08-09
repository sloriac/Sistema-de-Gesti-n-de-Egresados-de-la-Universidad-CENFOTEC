/* Gestion Egresados - Final */
 
const API_URL = "http://localhost:3000/egresados";
 
/* --- Seleccionar los elementos del DOM --- */
const inputIdentificacion = document.getElementById("identificacion");
const inputNombre = document.getElementById("nombre");
const inputCorreo = document.getElementById("correo");
const inputTelefono = document.getElementById("telefono");
const inputFechaRegistro = document.getElementById("fecha-registro");
const inputLugarTrabajo = document.getElementById("lugar-trabajo");
const inputPuestoTrabajo = document.getElementById("puesto-trabajo");
const inputFechaInicioTrabajo = document.getElementById("fecha-inicio-trabajo");
 
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
 
/* --- Validación del grupo "lugar de trabajo" ---
   En el modelo Mongoose, lugarTrabajoSchema exige empresa, puesto
   y fechaInicio si se incluye un objeto en lugaresTrabajo.
   El grupo completo es opcional, pero si se llena UNO de los tres
   campos, los otros dos también son obligatorios. */
function validarLugarTrabajoCompleto() {
    const empresa = inputLugarTrabajo.value.trim();
    const puesto = inputPuestoTrabajo.value.trim();
    const fechaInicio = inputFechaInicioTrabajo.value;
 
    const algunoLleno = empresa !== "" || puesto !== "" || fechaInicio !== "";
    const todosLlenos = empresa !== "" && puesto !== "" && fechaInicio !== "";
 
    // Limpiar marcas de error primero
    inputLugarTrabajo.classList.remove("input-error");
    inputPuestoTrabajo.classList.remove("input-error");
    inputFechaInicioTrabajo.classList.remove("input-error");
 
    if (algunoLleno && !todosLlenos) {
        if (empresa === "") inputLugarTrabajo.classList.add("input-error");
        if (puesto === "") inputPuestoTrabajo.classList.add("input-error");
        if (fechaInicio === "") inputFechaInicioTrabajo.classList.add("input-error");
        return false; // hay un error: faltan campos del grupo
    }
 
    return true; // o está todo vacío, o está todo completo: ambos casos son válidos
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
 
    // Lugar de trabajo (empresa / puesto / fecha de inicio)
    if (!validarLugarTrabajoCompleto()) {
        error = true;
    }
 
    return error;
}
 
/* --- POST: enviar el nuevo egresado al servidor --- */
async function guardarEgresado() {
 
    // 1. Construir el objeto EXACTAMENTE con la estructura que espera el servidor
    const nuevoEgresado = {
        identificacion: inputIdentificacion.value.trim(),
        nombreCompleto: inputNombre.value.trim(),
        correoElectronico: inputCorreo.value.trim(),
        telefono: inputTelefono.value.trim(),
        fechaRegistro: inputFechaRegistro.value
    };
 
    // lugaresTrabajo sigue el subesquema real del backend: si se llenó
    // el grupo (ya validado antes en validarLugarTrabajoCompleto),
    // se manda como un arreglo con un objeto que trae los tres campos
    // obligatorios (empresa, puesto, fechaInicio).
    const empresa = inputLugarTrabajo.value.trim();
    const puesto = inputPuestoTrabajo.value.trim();
    const fechaInicio = inputFechaInicioTrabajo.value;
 
    if (empresa !== "" && puesto !== "" && fechaInicio !== "") {
        nuevoEgresado.lugaresTrabajo = [
            {
                empresa: empresa,
                puesto: puesto,
                fechaInicio: fechaInicio
            }
        ];
    }
 
    try {
        // 2. Petición POST al backend
        const respuesta = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(nuevoEgresado)
        });
 
        if (!respuesta.ok) {
            throw new Error("El servidor respondió con un error (" + respuesta.status + ")");
        }
 
        // 3. Limpiar el formulario y volver a poner la fecha de hoy
        document.querySelector(".formulario").reset();
        establecerFechaActual();
 
        // 4. Refrescar la vista de consulta (GET) con los datos actualizados,
        //    sin recargar la página
        await obtenerEgresados();
 
        Swal.fire({
            title: "Egresado registrado",
            text: "Los datos han sido guardados correctamente en el servidor.",
            icon: "success",
            confirmButtonText: "Aceptar"
        });
 
    } catch (error) {
        console.error("Error al guardar el egresado:", error);
        Swal.fire({
            title: "No se pudo registrar",
            text: "Ocurrió un error al comunicarse con el servidor: " + error.message,
            icon: "error",
            confirmButtonText: "Regresar"
        });
    }
}
 
/* --- GET: consultar la lista de egresados en el servidor --- */
async function obtenerEgresados() {
    try {
        const respuesta = await fetch(API_URL);
 
        if (!respuesta.ok) {
            throw new Error("El servidor respondió con un error (" + respuesta.status + ")");
        }
 
        const egresados = await respuesta.json();
        mostrarEgresados(egresados);
 
    } catch (error) {
        console.error("Error al consultar los egresados:", error);
        Swal.fire({
            title: "No se pudo cargar la lista",
            text: "Ocurrió un error al consultar el servidor: " + error.message,
            icon: "error",
            confirmButtonText: "Aceptar"
        });
    }
}
 
/* --- Mostrar la lista de egresados guardados en pantalla --- */
function mostrarEgresados(egresados) {
    const contenedorEgresados = document.getElementById("egresados-registrados");
 
    // Quitar los <article> anteriores (pero dejar el <h2>)
    const articulosExistentes = contenedorEgresados.querySelectorAll("article");
    articulosExistentes.forEach(articulo => articulo.remove());
 
    // Crear un <article> por cada egresado que devuelve el GET
    egresados.forEach(egresado => {
        const nuevoArticulo = document.createElement("article");
 
        // El servidor devuelve las fechas en formato ISO (con hora),
        // aquí solo se muestra la parte de la fecha
        const fecha = egresado.fechaRegistro ? egresado.fechaRegistro.split("T")[0] : "";
 
        // lugaresTrabajo es un arreglo de objetos { empresa, puesto, fechaInicio, ... }
        const lugares = (egresado.lugaresTrabajo && egresado.lugaresTrabajo.length > 0)
            ? egresado.lugaresTrabajo.map(l => {
                const inicio = l.fechaInicio ? l.fechaInicio.split("T")[0] : "?";
                return `${l.puesto} en ${l.empresa} (desde ${inicio})`;
            }).join("; ")
            : "No especificado";
 
        nuevoArticulo.innerHTML = `
            <h3>${egresado.nombreCompleto}</h3>
            <p><strong>Identificación:</strong> ${egresado.identificacion}</p>
            <p><strong>Correo:</strong> ${egresado.correoElectronico}</p>
            <p><strong>Teléfono:</strong> ${egresado.telefono}</p>
            <p><strong>Fecha de registro:</strong> ${fecha}</p>
            <p><strong>Lugar(es) de trabajo:</strong> ${lugares}</p>
        `;
        contenedorEgresados.appendChild(nuevoArticulo);
    });
}
 
/* --- Validar antes de enviar --- */
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
        guardarEgresado(); // ya es una función async, maneja su propio éxito/error
    }
}
 
/* --- Inicialización y eventos --- */
establecerFechaActual();
obtenerEgresados(); // GET al cargar la página, como pide la consigna
 
btnRegistrarEgresado.addEventListener("click", function (e) {
    e.preventDefault();
    validarCamposVacios();
});
 
