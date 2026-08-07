//Variables para los inputs principales
const inputNombre = document.getElementById("nombre");
const inputCorreo = document.getElementById("correo");
const inputTelefono = document.getElementById("numero");

const errorNombre = document.getElementById("error-nombre");
const errorCorreo = document.getElementById("error-correo");
const errorNumero = document.getElementById("error-numero");

const mensajeExito = document.getElementById("mensaje-exito");


//Variables para poder agregar carreras
let contadorCarreras = 0;
const carrerasContainer = document.getElementById("carreras-container");
const botonAgregarCarrera = document.getElementById("agregar-carrera-boton");
const templateCarrera = document.getElementById("template-carrera");

//Botón para enviar el formulario
const botonEnviar = document.getElementById("enviar-informacion-boton");

//FUNCIONES DE VALIDACIÓN//

function validarNombre(nombre) {
    return /^.{2,}$/.test(nombre)
}

function validarCorreo(correo) {
    // Uno o más caracteres que no sean espacios ni arrobas, seguido de una arroba, otro bloque similar, un punto y otro bloque final sin espacios ni arrobas.
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
}

function validarTelefono(telefono) {
    return /^\d{4}-?\d{4}$/.test(telefono);
}

function validarBloqueCarrera(carrera, anno) {
    const carreraLlena = carrera.trim() !== "";
    const annoLleno = anno.trim() !== "";

    //Verifica que ambos estén llenos
    return carreraLlena === annoLleno;
}

function resaltarCamposVacios() {
    let error = false; //Asumimos que no hay errores

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

    //Comprobación para el correo
    const correo = inputCorreo.value.trim();
    //Si el campo de correo está vacío
    if ( ! validarCorreo ( correo ) ) {
        inputCorreo.classList.add("input-error");
        errorCorreo.classList.remove("texto-oculto");
        error = true;
    } else {
        inputCorreo.classList.remove("input-error");
        errorCorreo.classList.add("texto-oculto");
    }

    //Comprobación para el telefono
    const telefono = inputTelefono.value.trim();
    //Si el campo de telefono está vacío
    if ( ! validarTelefono ( telefono ) ) {
        inputTelefono.classList.add("input-error");
        errorNumero.classList.remove("texto-oculto");
        error = true;
    } else {
        inputTelefono.classList.remove("input-error");
        errorNumero.classList.add("texto-oculto");
    }

    //Comprobación de campos de carreras cursadas
    const bloquesCarrera = carrerasContainer.querySelectorAll(".bloque-carrera");
    bloquesCarrera.forEach((bloque) => {
        const inputCarrera = bloque.querySelector('input[type="text"]');
        const inputAnno = bloque.querySelector('input[type="date"]');
        const errorCarrera = bloque.querySelector(".mensaje-error-carrera");
        const errorAnno = bloque.querySelector(".mensaje-error-anno");

        if (!validarBloqueCarrera(inputCarrera.value, inputAnno.value)) {
            inputCarrera.classList.add("input-error");
            inputAnno.classList.add("input-error");
            errorCarrera.classList.remove("texto-oculto");
            errorAnno.classList.remove("texto-oculto");
            error = true;
        } else {
            inputCarrera.classList.remove("input-error");
            inputAnno.classList.remove("input-error");
            errorCarrera.classList.add("texto-oculto");
            errorAnno.classList.add("texto-oculto");
        }
    });
    return error;
}

function validarCamposVacios(event) {
    event.preventDefault();

    const error = resaltarCamposVacios();
    if ( !error ) {
        mensajeExito.classList.remove("texto-oculto");
        guardarRegistro();
        limpiarFormulario();
    }
}

function crearBloqueCarrera() {
    const clon = templateCarrera.content.cloneNode(true);
    const bloque = clon.firstElementChild; //div bloque lugar

    const nuevoIndice = contadorCarreras++;
    actualizarIndices(bloque, nuevoIndice);
    
    //Agregar evento al botón de eliminar carrera
    const botonEliminarCarrera = bloque.querySelector(".eliminar-carrera");
    botonEliminarCarrera.addEventListener("click", function (e) {
        e.preventDefault();
        bloque.remove();
    });

    return bloque;
}


function actualizarIndices(bloque, nuevoIndice) {
    bloque.dataset.index = nuevoIndice;

    //Actualizar ids de inputs y descrpciones
    const inputs = bloque.querySelectorAll("input");
    inputs.forEach((input) => {
        const baseID = input.id.replace(/\d+$/, "");
        input.id = baseID + nuevoIndice;

        const ayudaID = input.getAttribute("aria-describedby");
        if (ayudaID) {
            const nuevaAyudaID = ayudaID.replace(/\d+$/, nuevoIndice);
            input.setAttribute("aria-describedby", nuevaAyudaID);
        }
    });

    //Actualizar labels
    const labels = bloque.querySelectorAll("label");
    labels.forEach((label) => {
        const forLabels = label.getAttribute("for");
        if (forLabels) {
            const baseFor = forLabels.replace(/\d+$/, "");
            label.setAttribute("for", baseFor + nuevoIndice);
        }
    });

    //Actualizar ayudas
    const ayudas = bloque.querySelectorAll(".texto-oculto");
    ayudas.forEach((ayuda) => {
        const ayudaID = ayuda.id;
        if (ayudaID) {
            const baseAyudaID = ayudaID.replace(/\d+$/, "");
            ayuda.id = baseAyudaID + nuevoIndice;
        }
    });
}


//JSON

function guardarRegistro() {
    //Recolectar las carreras ingresadas
    const carreras = [];
    carrerasContainer.querySelectorAll(".bloque-carrera").forEach((bloque) => {
        const carrera = bloque.querySelector('input[type="text"]').value.trim();
        const anno = bloque.querySelector('input[type="date"]').value.trim();
        if (carrera !== "" && anno !== "") {
            carreras.push({carrera, anno});
        }
    });

    //Objeto con info del formulario
    const nuevoRegistro = {
        nombre: inputNombre.value.trim(),
        correo: inputCorreo.value.trim(),
        telefono: inputTelefono.value.trim(),
        carreras: carreras
    };

    //Leer la info existente en LS o el vector vacío si aún no hay datos
    const registros = JSON.parse(localStorage.getItem("solicitudesContacto")) || [];
    registros.push(nuevoRegistro);
    localStorage.setItem("solicitudesContacto", JSON.stringify(registros));

    console.log(registros); 
}

function limpiarFormulario() {
    document.querySelector("form").reset();
    carrerasContainer.innerHTML = "";
    contadorCarreras = 0;
}


botonEnviar.addEventListener("click", validarCamposVacios);

botonAgregarCarrera.addEventListener("click", function(e) {
    e.preventDefault();
    const bloque = crearBloqueCarrera();
    carrerasContainer.appendChild(bloque);

});