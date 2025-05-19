const form = document.getElementById('registroForm');
const errorMensaje = document.getElementById('errorMensaje');

form.addEventListener('submit', async function(event) {
    event.preventDefault();

    const nombre = document.getElementById('nombre').value.trim();
    const apellido = document.getElementById('apellido').value.trim();
    const cedula = document.getElementById('cedula').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const correo = document.getElementById('correo').value.trim();
    const direccion = document.getElementById('direccion').value.trim();

    // Validaciones
    if (!nombre || !apellido || !cedula || !telefono || !correo || !direccion) {
        errorMensaje.textContent = 'Por favor completa todos los campos.';
        return;
    }

    if (!/^[a-zA-Z\s]+$/.test(nombre)) {
        errorMensaje.textContent = 'El nombre solo debe contener letras.';
        return;
    }

    if (!/^[a-zA-Z\s]+$/.test(apellido)) {
        errorMensaje.textContent = 'El apellido solo debe contener letras.';
        return;
    }

    if (!/^\d{10}$/.test(cedula)) {
        errorMensaje.textContent = 'La cédula debe contener exactamente 10 dígitos.';
        return;
    }

    if (!/^09\d{8}$/.test(telefono)) {
        errorMensaje.textContent = 'El teléfono debe comenzar con 09 y tener 10 dígitos.';
        return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
        errorMensaje.textContent = 'El correo electrónico no es válido.';
        return;
    }

    if (direccion.length < 5) {
        errorMensaje.textContent = 'La dirección debe tener al menos 5 caracteres.';
        return;
    }

    // Si todo está bien, enviar
    errorMensaje.textContent = '';

    try {
        const respuesta = await fetch('http://localhost:3000/registrar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nombre, apellido, cedula, telefono, correo, direccion })
        });

        if (!respuesta.ok) {
            throw new Error('Error al registrar');
        }

        alert('Registro exitoso');
        form.reset();

    } catch (error) {
        errorMensaje.textContent = 'Hubo un problema al registrar: ' + error.message;
    }
});
