let usuarios = [];

// Cargar usuarios desde JSON y localStorage
fetch('json/usuarios.json')
  .then(response => response.json())
  .then(data => {
    const usuariosLocal = JSON.parse(localStorage.getItem('usuarios')) || [];
    usuarios = data.concat(usuariosLocal);
  })
  .catch(error => {
    console.error('Error cargando usuarios:', error);
    usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
  });

document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const email = document.getElementById('formEmail').value.trim().toLowerCase();
  const password = document.getElementById('formPassword').value.trim();

  // Busca el usuario por email (unificado)
  const usuario = usuarios.find(u =>
    u.email === email && u.password === password
  );

  if (!usuario) {
    Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Correo o contraseña incorrectos'
      });
    return;
  }

  sessionStorage.setItem('usuarioActivo', JSON.stringify(usuario));
  // Redirigir según el tipo de usuario
  switch (usuario.tipo.toUpperCase()) {
    case "CLIENTE":
      window.location.href = "usuario_final.html";
      break;
    case "CHOFER":
      window.location.href = "usuario_chofer.html";
      break;
    case "ADMINISTRADOR":
      window.location.href = "usuario_adm.html";
      break;
    default:
      alert("Tipo de usuario desconocido.");
  }
  
});
