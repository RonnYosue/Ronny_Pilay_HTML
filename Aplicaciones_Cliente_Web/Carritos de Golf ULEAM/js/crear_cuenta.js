document.getElementById('registerForm').addEventListener('submit', function(e) {
  e.preventDefault();

  // Obtener valores
  const nombre = document.getElementById('nombre').value.trim();
  const apellido = document.getElementById('apellido').value.trim();
  const email = document.getElementById('correo').value.trim().toLowerCase();
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  // Validaciones
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
  if (password === "") {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'La contraseña no puede estar vacía.'
    });
    return;
  }
  if (password !== confirmPassword) {
    document.getElementById('passwordError').textContent = 'Las contraseñas no coinciden.';
    return;
  } else {
    document.getElementById('passwordError').textContent = '';
  }

  // Leer usuarios existentes
  let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

  // Validar que el correo no exista
  if (usuarios.some(u => u.email === email)) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Correo ya existe.'
    });
    return;
  }

  // Todos los usuarios creados aquí serán CLIENTE
  const tipo = "CLIENTE";

  // Crear usuario
  const nuevoUsuario = {
    nombre,
    apellido,
    email, // ⚠️ Corregido: antes decía "correo"
    password,
    tipo
  };

  // Guardar usuario
  usuarios.push(nuevoUsuario);
  localStorage.setItem('usuarios', JSON.stringify(usuarios));

  Swal.fire({
    icon: 'success',
    title: '¡Registro exitoso!',
    text: 'Ahora puedes iniciar sesión.',
    confirmButtonText: 'Ir al login'
  }).then(() => {
    window.location.href = "login.html";
  });
});
