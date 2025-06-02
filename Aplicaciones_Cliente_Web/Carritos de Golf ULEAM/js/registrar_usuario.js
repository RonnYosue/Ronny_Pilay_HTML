document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registerForm');
  const passwordError = document.getElementById('passwordError');

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    const nombre = document.getElementById('nombre').value.trim();
    const apellido = document.getElementById('apellido').value.trim();
    const tipo = document.getElementById('tipo').value.trim().toUpperCase();
    const email = document.getElementById('correo').value.trim().toLowerCase();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Validaciones básicas
    if (!nombre || !apellido || !email || !password || !confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Todos los campos son obligatorios.'
      }); 
      return;
    }

    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nombre)) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El nombre solo debe contener letras.'
      }); 
      return;
    }

    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(apellido)) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El apellido solo debe contener letras.'
      }); 
      
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Correo electrónico no válido.'
      });      
      return;
    }

    if (password !== confirmPassword) {
      passwordError.textContent = 'Las contraseñas no coinciden.';
      return;
    } else {
      passwordError.textContent = '';
    }

    // Verificar si el correo ya está registrado
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const existe = usuarios.some(user => user.email === email);

    if (existe) {

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Correo ya existe.'
      });
      
      return;
    }

    // Crear nuevo usuario
    const nuevoUsuario = {
      nombre,
      apellido,
      tipo,
      email,
      password // Recuerda: no guardar contraseñas planas en producción
    };

    usuarios.push(nuevoUsuario);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    Swal.fire({
      icon: 'success',
      title: '¡Registro exitoso!',
      text: 'Ahora puedes iniciar sesión.'
    })

    .reset();
  });
});
