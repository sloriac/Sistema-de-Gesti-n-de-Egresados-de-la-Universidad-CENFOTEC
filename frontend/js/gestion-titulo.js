//Variables para los inputs principales
const inputCodigo = document.getElementById("codigo-titulo");
const inputNombre = document.getElementById("nombre-titulo");
const inputEgresado = document.getElementById("egresado-titulo");
const inputEscuela = document.getElementById("escuela-titulo");
const inputCarrera = document.getElementById("carrera-titulo");
const inputGrado = document.getElementById("tipoPrograma-titulo");
const inputCreditos = document.getElementById("creditos-titulo");
const inputFecha = document.getElementById("fecha-titulo");
const inputEstado = document.getElementById("estado-titulo");

const API = "http://localhost:3000/titulos";

const botonRegistrar = document.getElementById("registrar-titulo");

const errorCodigo = document.getElementById("error-codigo");
const errorNombre = document.getElementById("error-nombre");
const errorCarrera = document.getElementById("error-carrera");
const errorGrado = document.getElementById("error-tipoPrograma");
const errorCreditos = document.getElementById("error-creditos");
const errorFecha = document.getElementById("error-fecha");
const errorEstado = document.getElementById("error-estado");
const errorEscuela = document.getElementById("error-escuela");
const errorEgresado = document.getElementById("error-egresado");

const mensajeExito = document.getElementById("mensaje-exito");


//FUNCIONES DE VALIDACIÓN//

function validarCodigo(codigo) {
    return /^[A-Za-z]{3,}-\d{3,}$/.test(codigo)
}

function validarNombre(nombre) {
    return /^.{10,}$/.test(nombre)
}

function validarCarrera(carrera) {
    return carrera !== "";
}

function validarEscuela(escuela) {
    return escuela !== "";
}

function validarEgresado(egresado) {
    return egresado !== "";
}

function validarGrado(tipoPrograma) {
    return tipoPrograma !== "";
}

function validarCreditos(creditos) {
    return /^\d{2,}$/.test(creditos)
}

function validarFecha(fecha) {
    return fecha !== "";
}

function validarEstado(estado) {
    return /^.{7,}$/.test(estado)
}


//FUNCIÓN PARA RESALTAR ERRORES
function resaltarCamposVacios() {
    let error = false; //Asumimos que no hay errores

    //Comprobación para el codigo
    const codigo = inputCodigo.value.trim();
    //Si el campo de codigo está vacío
    if ( ! validarCodigo ( codigo ) ) {
        inputCodigo.classList.add("input-error");
        errorCodigo.classList.remove("texto-oculto");
        error = true;
    } else {
        inputCodigo.classList.remove("input-error");
        errorCodigo.classList.add("texto-oculto");
    }

    //Comprobación para el nombre
    const nombre = inputNombre.value.trim();
    //Si el campo de nombre está vacío
    if ( ! validarNombre ( nombre ) ) {
        inputNombre.classList.add("input-error");
        errorNombre.classList.remove("texto-oculto");
        error = true;
    } else {
        inputNombre.classList.remove("input-error");
        errorNombre.classList.add("texto-oculto");
    }

    //Comprobación para la carrera
    const carrera = inputCarrera.value.trim();
    //Si el campo de carrera está vacío
    if ( ! validarCarrera ( carrera ) ) {
        inputCarrera.classList.add("input-error");
        errorCarrera.classList.remove("texto-oculto");
        error = true;
    } else {
        inputCarrera.classList.remove("input-error");
        errorCarrera.classList.add("texto-oculto");
    }

    //Comprobación para la escuela
    const escuela = inputEscuela.value.trim();
    //Si el campo de escuela está vacío
    if ( ! validarEscuela ( escuela ) ) {
        inputEscuela.classList.add("input-error");
        errorEscuela.classList.remove("texto-oculto");
        error = true;
    } else {
        inputEscuela.classList.remove("input-error");
        errorEscuela.classList.add("texto-oculto");
    }

    //Comprobación para el egresado
    const egresado = inputEgresado.value.trim();
    //Si el campo de carrera está vacío
    if ( ! validarEgresado ( egresado ) ) {
        inputEgresado.classList.add("input-error");
        errorEgresado.classList.remove("texto-oculto");
        error = true;
    } else {
        inputEgresado.classList.remove("input-error");
        errorEgresado.classList.add("texto-oculto");
    }

    //Comprobación para el tipoPrograma
    const tipoPrograma = inputGrado.value.trim();
    //Si el campo de tipoPrograma está vacío
    if ( ! validarGrado ( tipoPrograma ) ) {
        inputGrado.classList.add("input-error");
        errorGrado.classList.remove("texto-oculto");
        error = true;
    } else {
        inputGrado.classList.remove("input-error");
        errorGrado.classList.add("texto-oculto");
    }

    //Comprobación para los creditos
    const creditos = inputCreditos.value.trim();
    //Si el campo de creditos está vacío
    if ( ! validarCreditos ( creditos ) ) {
        inputCreditos.classList.add("input-error");
        errorCreditos.classList.remove("texto-oculto");
        error = true;
    } else {
        inputCreditos.classList.remove("input-error");
        errorCreditos.classList.add("texto-oculto");
    }

    //Comprobación para la fecha de vigencia
    const fecha = inputFecha.value.trim();
    //Si el campo de fecha está vacío
    if ( ! validarFecha ( fecha ) ) {
        inputFecha.classList.add("input-error");
        errorFecha.classList.remove("texto-oculto");
        error = true;
    } else {
        inputFecha.classList.remove("input-error");
        errorFecha.classList.add("texto-oculto");
    }

    //Comprobación para el estado
    const estado = inputEstado.value.trim();
    //Si el campo de estado está vacío
    if ( ! validarEstado ( estado ) ) {
        inputEstado.classList.add("input-error");
        errorEstado.classList.remove("texto-oculto");
        error = true;
    } else {
        inputEstado.classList.remove("input-error");
        errorEstado.classList.add("texto-oculto");
    }
    
    return error;
}


//FUNCIÓN PARA VALIDAR LOS CAMPOS VACÍOS
function validarCamposVacios(event) {
    mensajeExito.classList.add("texto-oculto");

    event.preventDefault();

    const error = resaltarCamposVacios();
    if ( !error ) {
        guardarRegistro();
    }
}

function limpiarFormulario() {
    document.querySelector("form").reset();
}

//JSON

async function guardarRegistro() {

    //Objeto con info del formulario
    const nuevoRegistro = {
        codigo: inputCodigo.value.trim(),
        nombre: inputNombre.value.trim(),
        egresado: inputEgresado.value.trim(),
        carrera: inputCarrera.value.trim(),
        escuela: inputEscuela.value.trim(),
        tipoPrograma: inputGrado.value.trim(),
        creditos: inputCreditos.value.trim(),
        annoGraduacion: new Date(inputFecha.value).getFullYear(),
        estado: inputEstado.value.trim()
    };

    try {
        const respuesta = await fetch(API, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(nuevoRegistro)
        });

        if (!respuesta.ok) throw new Error(`Error del servidor (${respuesta.status})`);
        Swal.fire({
            title: "Registro Exitoso",
            text: "El título fue registrado exitosamente",
            icon: "success"
        });
        limpiarFormulario();

    } catch (error) {
        Swal.fire({
            title: "Error",
            text: "No se pudo registrar el título: " + error.message,
            icon: "error"
        });
    }
}
//botonRegistrar.addEventListener("click", validarCamposVacios);
//Para que tambien funcione con enter
document.querySelector("form").addEventListener("submit", validarCamposVacios);