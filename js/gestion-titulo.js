//Variables para los inputs principales
const inputCodigo = document.getElementById("codigo-titulo");
const inputNombre = document.getElementById("nombre-titulo");
const inputCarrera = document.getElementById("carrera-titulo");
const inputGrado = document.getElementById("grado-titulo");
const inputCreditos = document.getElementById("creditos-titulo");
const inputFecha = document.getElementById("fecha-titulo");
const inputEstado = document.getElementById("estado-titulo");

const botonRegistrar = document.getElementById("registrar-titulo");

const errorCodigo = document.getElementById("error-codigo");
const errorNombre = document.getElementById("error-nombre");
const errorCarrera = document.getElementById("error-carrera");
const errorGrado = document.getElementById("error-grado");
const errorCreditos = document.getElementById("error-creditos");
const errorFecha = document.getElementById("error-fecha");
const errorEstado = document.getElementById("error-estado");

const mensajeExito = document.getElementById("mensaje-exito");


//FUNCIONES DE VALIDACIÓN//

function validarCodigo(codigo) {
    return /^[A-Za-z]{3,}-\d{3,}$/.test(codigo)
}

function validarNombre(nombre) {
    return /^.{10,}$/.test(nombre)
}

function validarCarrera(carrera) {
    return /^[A-Za-z]{3,}-\d{3,}$/.test(carrera)
}

function validarGrado(grado) {
    return /^.{8,}$/.test(grado)
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

    //Comprobación para el grado
    const grado = inputGrado.value.trim();
    //Si el campo de grado está vacío
    if ( ! validarGrado ( grado ) ) {
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
        mensajeExito.classList.remove("texto-oculto");
        guardarRegistro();
        limpiarFormulario();
    }
}

//JSON

function guardarRegistro() {

    //Objeto con info del formulario
    const nuevoRegistro = {
        codigo: inputCodigo.value.trim(),
        nombre: inputNombre.value.trim(),
        carrera: inputCarrera.value.trim(),
        grado: inputGrado.value.trim(),
        creditos: inputCreditos.value.trim(),
        fecha: inputFecha.value.trim(),
        estado: inputEstado.value.trim()
    };

    //Leer la info existente en LS o el vector vacío si aún no hay datos
    const registros = JSON.parse(localStorage.getItem("registrosTitulos")) || [];
    registros.push(nuevoRegistro);
    localStorage.setItem("registrosTitulos", JSON.stringify(registros));

    console.log(registros); 
}

function limpiarFormulario() {
    document.querySelector("form").reset();
}

//botonRegistrar.addEventListener("click", validarCamposVacios);
//Para que tambien funcione con enter
document.querySelector("form").addEventListener("submit", validarCamposVacios);