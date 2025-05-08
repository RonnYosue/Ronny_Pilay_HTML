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

    if (!nombre || !apellido || !cedula || !telefono || !correo || !direccion ) {
        errorMensaje.textContent = 'Por favor completa todos los campos.';
        return;
    }

    errorMensaje.textContent = '';

    try {
        const respuesta = await fetch('http://localhost:3000/registrar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nombre, apellido, cedula, telefono, correo, direccion })
        });

        if (respuesta.ok) {
            alert('Formulario enviado y guardado en la base de datos!');
            form.reset();
        } else {
            alert('Error al guardar en la base de datos');
        }
    } catch (error) {
        console.error('Error al enviar datos:', error);
        alert('Error de conexión con el servidor');
    }
});
