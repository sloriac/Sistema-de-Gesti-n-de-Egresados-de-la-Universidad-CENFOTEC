const inputCorreo = document.getElementById("correo")
const inputContrasena = document.getElementById("contrasena")

const botonAcceder = document.getElementById("boton-acceder")

function validarCorreo(correo) {
    // Uno o más caracteres que no sean espacios ni arrobas, seguido de una arroba, otro bloque similar, un punto y otro bloque final sin espacios ni arrobas.
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
}

function resaltarCamposVacios() {
    let error = false; //Asumimos que no hay errores

    //Comprobación para el correo
    const correo = inputCorreo.value.trim()
    //Si el campo de correo está vacío
    if ( ! validarCorreo ( correo ) ) {
        inputCorreo.classList.add("input-error")
        error = true;
    } else {
        inputCorreo.classList.remove("input-error")
    }

    //Comprobación para la contraseña
    const contrasena = inputContrasena.value.trim()
    //Si la contraseña está vacía 
    if ( contrasena === "" ) {
        inputContrasena.classList.add("input-error")
        error = true;
    } else {
        inputContrasena.classList.remove("input-error")
    }

    return error;
}

function validarCamposVacios(event) {
    event.preventDefault();

    const error = resaltarCamposVacios();
    if ( error ) {
        Swal.fire({
            title: "No se puede iniciar sesión",
            text: "Complete los campos resaltados.",
            icon: "warning",
            confirmButtonText: "Aceptar"
        });
    } else {
        Swal.fire({
            title: "Sesión Iniciada",
            text: "Siga adelante.",
            icon: "success",
            confirmButtonText: "Aceptar"
        });
    }
}

botonAcceder.addEventListener("click", validarCamposVacios);
