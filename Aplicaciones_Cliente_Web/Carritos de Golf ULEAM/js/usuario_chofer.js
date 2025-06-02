let map;
let marker;

// Mostrar saludo
document.addEventListener("DOMContentLoaded", function () {
  const user = JSON.parse(sessionStorage.getItem("usuarioActivo"));
  const saludo = document.getElementById("saludo");
  if (user && user.nombre && user.tipo) {
    saludo.innerText = `HOLA ${user.nombre.toUpperCase()}, ${user.tipo.toUpperCase()}`;
  } else {
    saludo.innerText = ""; // No mostrar nada si no hay nombre
  }
});

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: -0.9527943857230249, lng: -80.74554766436874 },
    zoom: 17,
    minZoom: 17,
    maxZoom: 25
  });

  // Mostrar los carritos agregados por el admin
  cargarCarritos();
}

// Mostrar todos los carritos guardados como marcadores
function cargarCarritos() {
  const carritos = JSON.parse(localStorage.getItem('carritos')) || [];
  carritos.forEach(carrito => {
    const nuevoMarker = new google.maps.Marker({
      position: { lat: carrito.lat, lng: carrito.lng },
      map: map,
      title: `Carrito ${carrito.id}`,
      icon: {
        url: "image/car.png",
        scaledSize: new google.maps.Size(50, 50)
      }
    });
  });
}

// Estado de servicio
let enServicio = false;
let carritoEnServicio = null;

function iniciarServicio() {
  mostrarModal("modalIniciarServicio");
}

function confirmarinicioServicio() {
  const inputId = document.getElementById("carritoId").value.trim();
  const carritos = JSON.parse(localStorage.getItem('carritos')) || [];
  const carrito = carritos.find(c => c.id === inputId);

  if (!inputId) {
    alert("Por favor, ingresa un ID de carrito.");
    return;
  }

  if (!carrito) {
    alert("El ID del carrito no existe. Verifica que el administrador lo haya agregado.");
    return;
  }

  // Cambiar estado visual
  const punto = document.getElementById("punto-estado");
  const texto = document.getElementById("texto-estado");
  punto.classList.remove("gris");
  punto.classList.add("verde");
  texto.textContent = `En servicio (Carrito ${carrito.id})`;

  enServicio = true;
  carritoEnServicio = carrito.id;

  cerrarModal('modalIniciarServicio');
  alert(`¡Ahora estás en servicio con el carrito ${carrito.id}!`);
}

function finalizarServicio() {
  const punto = document.getElementById("punto-estado");
  const texto = document.getElementById("texto-estado");

  punto.classList.remove("verde");
  punto.classList.add("gris");
  texto.textContent = "Fuera de servicio";

  enServicio = false;
  carritoEnServicio = null;
}

function realizarMantenimiento() {
  mostrarModal("modalRealizarMantenimiento");
}

function confirmarRealizarMantenimiento() {
  alert('correctamente confirmado'); // esto es opcional
  cerrarModal('modalRealizarMantenimiento');
}

function mostrarModal(id) {
  document.getElementById(id).classList.remove('hidden');
}

function cerrarModal(id) {
  document.getElementById(id).classList.add('hidden');
}

function cerrarSesion() {
  window.location.href = "login.html";
}

// Sidebar toggle
document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('toggleSidebar');
  const sidebar = document.getElementById('sidebar');
  const mainContent = document.querySelector('.main-content');

  toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
    mainContent.classList.toggle('collapsed');
  });
});

// ---------------------- RESERVAS ----------------------

function realizarReserva() {
  mostrarModal('modalReservas');
  mostrarReservas();
}

function mostrarReservas() {
  const reservas = JSON.parse(localStorage.getItem('reservas')) || [];
  const lista = document.getElementById('listaReservas');
  lista.innerHTML = "";

  if (reservas.length === 0) {
    lista.innerHTML = "<p>No hay reservas.</p>";
    return;
  }

  reservas.forEach(reserva => {
    const div = document.createElement('div');
    div.className = "reserva-item";
    div.innerHTML = `
      <strong>Carrito:</strong> ${reserva.carritoId} <br>
      <strong>Cliente:</strong> ${reserva.clienteEmail} <br>
      <strong>Fecha:</strong> ${reserva.fecha} <br>
      <strong>Hora:</strong> ${reserva.hora} <br>
      <strong>Inicio:</strong> ${reserva.inicioId} <br>
      <strong>Destino:</strong> ${reserva.destinoId} <br>
      <strong>Estado:</strong> <span id="estado-${reserva.id}">${reserva.estado}</span>
    `;

    // Si la reserva está pendiente, muestra botón Confirmar
    if (reserva.estado === "pendiente") {
      const btn = document.createElement('button');
      btn.textContent = "Confirmar";
      btn.onclick = () => confirmarReservaChofer(reserva.id);
      div.appendChild(btn);
    }

    lista.appendChild(div);
  });
}

function confirmarReservaChofer(reservaId) {
  let reservas = JSON.parse(localStorage.getItem('reservas')) || [];
  const idx = reservas.findIndex(r => r.id === reservaId);
  if (idx !== -1) {
    reservas[idx].estado = "confirmada";
    localStorage.setItem('reservas', JSON.stringify(reservas));
    mostrarReservas();
    alert("Reserva confirmada. El cliente verá el movimiento del carrito.");
    // Aquí podrías notificar al cliente, por ejemplo, usando localStorage o un flag
  }
}