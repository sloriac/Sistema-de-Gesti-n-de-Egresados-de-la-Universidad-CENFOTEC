console.log("HTML enlazado al JS");

document.addEventListener("DOMContentLoaded", () => {

    // ---------------------------------------------------------
    // Referencias a elementos del DOM
    // ---------------------------------------------------------
    const formulario = document.getElementById("form-carreras");
    const botonRegistrar = document.getElementById("crear-carrera");
    const botonCancelar = document.getElementById("cancelar-edicion");

    const campos = {
        codigo: document.getElementById("codigo-carrera"),
        nombre: document.getElementById("nombre-carrera"),
        escuela: document.getElementById("escuela-carrera"),
        duracion: document.getElementById("duracion-carrera"),
        creditos: document.getElementById("creditos-carrera"),
        modalidad: document.getElementById("modalidad-carrera"),
        estado: document.getElementById("estado-carrera")
    };

    const mensajesError = {
        codigo: document.getElementById("error-codigo-carrera"),
        nombre: document.getElementById("error-nombre-carrera"),
        escuela: document.getElementById("error-escuela-carrera"),
        duracion: document.getElementById("error-duracion-carrera"),
        creditos: document.getElementById("error-creditos-carrera"),
        modalidad: document.getElementById("error-modalidad-carrera"),
        estado: document.getElementById("error-estado-carrera")
    };

    const contenedorLista = document.querySelector("#lista-carreras");
    const mensajeVacio = document.querySelector("#mensaje-vacio");
    const mensajeExito = document.querySelector("#mensaje-exito");

    const CLAVE_STORAGE = "carreras";

    // Guarda el código de la carrera que se está editando.
    // Si es null, el formulario está en modo "crear".
    let codigoEnEdicion = null;

    // ---------------------------------------------------------
    // Expresiones regulares para validar el formato de cada campo
    // ---------------------------------------------------------
    const patrones = {
        codigo: /^CAR-\d{3}$/i,
        nombre: /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]{5,80}$/,
        escuela: /^ESC-\d{3}$/i,
        duracion: /^\d{1,2}(\.[05])?$/,
        creditos: /^\d{1,4}$/,
        modalidad: /^(presencial|virtual|h[ií]brida)$/i,
        estado: /^(activa|inactiva)$/i
    };

    const mensajesFormato = {
        codigo: "Use el formato CAR- seguido de 3 dígitos, por ejemplo: CAR-014.",
        nombre: "Ingrese solo letras y espacios (mínimo 5 caracteres).",
        escuela: "Use el formato ESC- seguido de 3 dígitos, por ejemplo: ESC-001.",
        duracion: "Ingrese un número entre 1 y 8 (puede usar .5 para medios años).",
        creditos: "Ingrese solo números, por ejemplo: 160.",
        modalidad: "Escriba: Presencial, Virtual o Híbrida.",
        estado: "Escriba: Activa o Inactiva."
    };

    // ---------------------------------------------------------
    // Funciones de validación
    // ---------------------------------------------------------
    function mostrarError(campo, mensaje) {
        mensajesError[campo].textContent = mensaje;
        campos[campo].classList.add("invalido");
        campos[campo].setAttribute("aria-invalid", "true");
    }

    function limpiarError(campo) {
        mensajesError[campo].textContent = "";
        campos[campo].classList.remove("invalido");
        campos[campo].removeAttribute("aria-invalid");
    }

    function validarCampo(campo) {
        const valor = campos[campo].value.trim();

        if (valor === "") {
            mostrarError(campo, "Este campo es obligatorio.");
            return false;
        }

        if (!patrones[campo].test(valor)) {
            mostrarError(campo, mensajesFormato[campo]);
            return false;
        }

        if (campo === "duracion") {
            const numero = parseFloat(valor);
            if (numero < 1 || numero > 8) {
                mostrarError(campo, "La duración debe estar entre 1 y 8 años.");
                return false;
            }
        }

        if (campo === "creditos") {
            const numero = parseInt(valor, 10);
            if (numero <= 0) {
                mostrarError(campo, "Los créditos deben ser un número mayor a 0.");
                return false;
            }
        }

        limpiarError(campo);
        return true;
    }

    Object.keys(campos).forEach((campo) => {
        campos[campo].addEventListener("input", () => limpiarError(campo));
    });

    // ---------------------------------------------------------
    // Local Storage: leer y guardar la lista de carreras
    // ---------------------------------------------------------
    function obtenerCarreras() {
        const datosGuardados = localStorage.getItem(CLAVE_STORAGE);
        return datosGuardados ? JSON.parse(datosGuardados) : [];
    }

    function guardarCarreras(lista) {
        localStorage.setItem(CLAVE_STORAGE, JSON.stringify(lista));
    }

    // El código de carrera es el campo único que identifica cada registro.
    // Al editar, se excluye el propio registro de la comparación.
    function esCodigoDuplicado(codigo, codigoOriginal) {
        const lista = obtenerCarreras();
        return lista.some((carrera) => {
            const esElMismoRegistroQueEdito = codigoOriginal && carrera.codigo.toLowerCase() === codigoOriginal.toLowerCase();
            return !esElMismoRegistroQueEdito && carrera.codigo.toLowerCase() === codigo.toLowerCase();
        });
    }

    function mostrarMensajeGeneral(mensaje, tipo) {
        mensajeExito.textContent = mensaje;
        mensajeExito.classList.remove("exito", "duplicado");
        mensajeExito.classList.add(tipo);

        window.clearTimeout(mostrarMensajeGeneral.temporizador);
        mostrarMensajeGeneral.temporizador = window.setTimeout(() => {
            mensajeExito.textContent = "";
            mensajeExito.classList.remove("exito", "duplicado");
        }, 4000);
    }

    // ---------------------------------------------------------
    // Dibuja la lista de carreras guardadas como <article>,
    // cada una con botones de Editar y Eliminar
    // ---------------------------------------------------------
    function renderizarCarreras() {
        const lista = obtenerCarreras();

        contenedorLista.innerHTML = "";

        if (lista.length === 0) {
            mensajeVacio.style.display = "block";
            return;
        }

        mensajeVacio.style.display = "none";

        lista.forEach((carrera) => {
            const articulo = document.createElement("article");
            articulo.className = "tarjeta-carrera";
            articulo.innerHTML = `
                <h3>${carrera.nombre}</h3>
                <p><strong>Código:</strong> ${carrera.codigo}</p>
                <p><strong>Escuela:</strong> ${carrera.escuela}</p>
                <p><strong>Duración:</strong> ${carrera.duracion} años</p>
                <p><strong>Créditos:</strong> ${carrera.creditos}</p>
                <p><strong>Modalidad:</strong> ${carrera.modalidad}</p>
                <p><strong>Estado:</strong> ${carrera.estado}</p>
                <div class="acciones-tarjeta">
                    <button type="button" class="btn-editar" data-codigo="${carrera.codigo}">Editar</button>
                    <button type="button" class="btn-eliminar" data-codigo="${carrera.codigo}">Eliminar</button>
                </div>
            `;
            contenedorLista.appendChild(articulo);
        });
    }

    // ---------------------------------------------------------
    // Modo edición: llena el formulario con los datos existentes
    // ---------------------------------------------------------
    function entrarModoEdicion(codigo) {
        const lista = obtenerCarreras();
        const carrera = lista.find((item) => item.codigo === codigo);

        if (!carrera) {
            return;
        }

        campos.codigo.value = carrera.codigo;
        campos.nombre.value = carrera.nombre;
        campos.escuela.value = carrera.escuela;
        campos.duracion.value = carrera.duracion;
        campos.creditos.value = carrera.creditos;
        campos.modalidad.value = carrera.modalidad;
        campos.estado.value = carrera.estado;

        codigoEnEdicion = codigo;
        botonRegistrar.textContent = "Actualizar carrera";
        botonCancelar.classList.remove("oculto");

        // Lleva la vista al inicio del formulario para que la persona vea que va a editar
        formulario.scrollIntoView({ behavior: "smooth", block: "start" });
        campos.codigo.focus();
    }

    function salirModoEdicion() {
        codigoEnEdicion = null;
        botonRegistrar.textContent = "Registrar carrera";
        botonCancelar.classList.add("oculto");
        formulario.reset();
        Object.keys(campos).forEach((campo) => limpiarError(campo));
    }

    botonCancelar.addEventListener("click", () => {
        salirModoEdicion();
        mostrarMensajeGeneral("Edición cancelada.", "duplicado");
    });

    // ---------------------------------------------------------
    // Eliminar una carrera
    // ---------------------------------------------------------
    function eliminarCarrera(codigo) {
        const confirmar = window.confirm("¿Está segura de que desea eliminar esta carrera? Esta acción no se puede deshacer.");

        if (!confirmar) {
            return;
        }

        const listaActual = obtenerCarreras();
        const listaActualizada = listaActual.filter((carrera) => carrera.codigo !== codigo);
        guardarCarreras(listaActualizada);

        // Si se estaba editando justo la carrera que se eliminó, se sale del modo edición
        if (codigoEnEdicion === codigo) {
            salirModoEdicion();
        }

        console.log("Lista completa de carreras registradas:", listaActualizada);
        renderizarCarreras();
        mostrarMensajeGeneral("Carrera eliminada correctamente.", "exito");
    }

    // Delegación de eventos: un solo listener para todos los botones Editar/Eliminar,
    // incluso los que se crean después de manera dinámica
    contenedorLista.addEventListener("click", (evento) => {
        const botonEditar = evento.target.closest(".btn-editar");
        const botonEliminar = evento.target.closest(".btn-eliminar");

        if (botonEditar) {
            entrarModoEdicion(botonEditar.dataset.codigo);
        }

        if (botonEliminar) {
            eliminarCarrera(botonEliminar.dataset.codigo);
        }
    });

    // ---------------------------------------------------------
    // Envío del formulario (crear o actualizar, según el modo)
    // ---------------------------------------------------------
    formulario.addEventListener("submit", (evento) => {
        evento.preventDefault();

        const resultados = Object.keys(campos).map((campo) => validarCampo(campo));
        const formularioValido = resultados.every((valido) => valido === true);

        if (!formularioValido) {
            return;
        }

        const codigoIngresado = campos.codigo.value.trim();

        if (esCodigoDuplicado(codigoIngresado, codigoEnEdicion)) {
            mostrarError("codigo", "Ya existe una carrera registrada con este código.");
            mostrarMensajeGeneral("No se guardó: el código ya está registrado.", "duplicado");
            return;
        }

        const datosCarrera = {
            codigo: codigoIngresado,
            nombre: campos.nombre.value.trim(),
            escuela: campos.escuela.value.trim(),
            duracion: campos.duracion.value.trim(),
            creditos: campos.creditos.value.trim(),
            modalidad: campos.modalidad.value.trim(),
            estado: campos.estado.value.trim()
        };

        const listaActual = obtenerCarreras();

        if (codigoEnEdicion) {
            // Modo actualizar: reemplaza el registro existente
            const listaActualizada = listaActual.map((carrera) =>
                carrera.codigo === codigoEnEdicion ? datosCarrera : carrera
            );
            guardarCarreras(listaActualizada);
            console.log("Lista completa de carreras registradas:", listaActualizada);
            mostrarMensajeGeneral("Carrera actualizada correctamente.", "exito");
        } else {
            // Modo crear: agrega un nuevo registro sin sobrescribir los existentes
            listaActual.push(datosCarrera);
            guardarCarreras(listaActual);
            console.log("Lista completa de carreras registradas:", listaActual);
            mostrarMensajeGeneral("Carrera registrada correctamente.", "exito");
        }

        salirModoEdicion();
        renderizarCarreras();
    });

    // Al cargar la página, mostrar lo que ya estaba guardado
    renderizarCarreras();
});
