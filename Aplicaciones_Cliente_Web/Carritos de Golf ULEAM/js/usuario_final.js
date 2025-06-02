let map;
let marker;
let nodos = [];
let conexiones = [];
let rutaActual = null;
let carritos = [];
let carritoMarkers = [];

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

async function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: -0.9545528165209427, lng: -80.74615240570795 },
    zoom: 17,
    minZoom: 17,
    maxZoom: 25
  });

  await cargarDatos();

  mostrarNodos();
  dibujarConexiones();

  // Mostrar todos los carritos guardados como marcadores
  cargarCarritos();

  // Ejemplo de marcador de carrito (puedes quitarlo si solo quieres los carritos agregados por el admin)
  marker = new google.maps.Marker({
    position: { lat: -0.9545528165209427, lng: -80.74615240570795 },
    map: map,
    title: "Haz clic para reservar este carrito",
    icon: {
      url: "image/car.png",
      scaledSize: new google.maps.Size(50, 50)
    }
  });
  marker.addListener("click", () => {
    mostrarModal('modalReserva');
  });

  // Al cargar, revisa si hay reservas confirmadas para este usuario
  revisarReservasConfirmadas();
}

async function cargarDatos() {
  // Cargar nodos
  const response = await fetch("json/nodos.json");
  const data = await response.json();
  nodos = data.nodos;

  // Cargar conexiones con peso
  const conexionesResponse = await fetch('json/conexiones.json');
  const conexionesData = await conexionesResponse.json();
  conexiones = conexionesData.conexiones;
}

// Cargar y mostrar carritos guardados en localStorage
function cargarCarritos() {
  carritos = JSON.parse(localStorage.getItem('carritos')) || [];
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
    carritoMarkers.push(nuevoMarker);
    nuevoMarker.addListener("click", () => {
      mostrarModal('modalReserva');
    });
  });
}

function mostrarNodos() {
  // Si quieres mostrar todos los nodos como marcadores, descomenta esto:
  // nodos.forEach(nodo => {
  //   new google.maps.Marker({
  //     position: { lat: nodo.lat, lng: nodo.lng },
  //     map: map,
  //     title: nodo.nombre,
  //     label: `${nodo.id}`
  //   });
  // });
}

function dibujarConexiones() {
  conexiones.forEach(conexion => {
    const origen = nodos.find(n => n.id === conexion.origen);
    const destino = nodos.find(n => n.id === conexion.destino);

    const ruta = new google.maps.Polyline({
      path: [
        { lat: origen.lat, lng: origen.lng },
        { lat: destino.lat, lng: destino.lng }
      ],
      geodesic: true,
      strokeColor: "#00bcd4",
      strokeOpacity: 1.0,
      strokeWeight: 3
    });

    ruta.setMap(map);
  });
}

// Algoritmo de Dijkstra
function dijkstra(nodos, conexiones, inicioId, destinoId) {
  const grafo = {};
  nodos.forEach(n => grafo[n.id] = []);
  conexiones.forEach(c => {
    grafo[c.origen].push({ id: c.destino, peso: c.peso });
    grafo[c.destino].push({ id: c.origen, peso: c.peso });
  });

  const dist = {};
  const prev = {};
  const visitados = new Set();
  nodos.forEach(n => dist[n.id] = Infinity);
  dist[inicioId] = 0;

  while (visitados.size < nodos.length) {
    let u = null;
    let minDist = Infinity;
    for (let id in dist) {
      if (!visitados.has(Number(id)) && dist[id] < minDist) {
        minDist = dist[id];
        u = Number(id);
      }
    }
    if (u === null) break;
    visitados.add(u);
    grafo[u].forEach(vecino => {
      if (!visitados.has(vecino.id)) {
        let alt = dist[u] + vecino.peso;
        if (alt < dist[vecino.id]) {
          dist[vecino.id] = alt;
          prev[vecino.id] = u;
        }
      }
    });
  }

  let camino = [];
  let actual = destinoId;
  while (actual !== undefined) {
    camino.unshift(actual);
    actual = prev[actual];
  }
  if (camino[0] !== inicioId) return [];
  return camino;
}

// Función para mover el carrito suavemente por la ruta óptima
function moveSmoothly(marker, path, speed = 0.05) {
  let index = 0;

  function animate() {
    if (index >= path.length - 1) {
      Swal.fire({
        icon: 'success',
        title: '¡Llegaste al destino!',
        text: 'El carrito ha llegado a su destino correctamente.',
        confirmButtonColor: '#00bcd4'
      });
      return;
    }

    const start = path[index];
    const end = path[index + 1];
    const deltaLat = end.lat - start.lat;
    const deltaLng = end.lng - start.lng;

    let progress = 0;

    function step() {
      progress += speed;
      if (progress >= 1) {
        marker.setPosition(end);
        index++;
        animate();
        return;
      }

      const intermediate = {
        lat: start.lat + deltaLat * progress,
        lng: start.lng + deltaLng * progress,
      };

      marker.setPosition(intermediate);
      requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  animate();
}

// Lógica para la reserva y mostrar la ruta óptima y mover el carrito
function confirmarReserva() {
  // Validaciones
  const fecha = document.getElementById('fecha').value;
  const hora = document.getElementById('hora').value;
  const inicioId = Number(document.getElementById('inicio').value);
  const destinoId = Number(document.getElementById('destino').value);
  const asientos = document.getElementById('asientos').selectedIndex + 1;

  // Validar fecha
  if (!fecha) {
    Swal.fire({
      icon: 'warning',
      title: 'Fecha requerida',
      text: 'Por favor, selecciona una fecha para la reserva.',
      confirmButtonColor: '#00bcd4'
    });
    return;
  }
  // Validar que la fecha no sea en el pasado
  const hoy = new Date();
  const fechaSeleccionada = new Date(fecha + "T00:00:00");
  hoy.setHours(0,0,0,0);
  if (fechaSeleccionada < hoy) {
    Swal.fire({
      icon: 'warning',
      title: 'Fecha inválida',
      text: 'No puedes seleccionar una fecha en el pasado.',
      confirmButtonColor: '#00bcd4'
    });
    return;
  }

  // Validar hora
  if (!hora) {
    Swal.fire({
      icon: 'warning',
      title: 'Hora requerida',
      text: 'Por favor, selecciona una hora para la reserva.',
      confirmButtonColor: '#00bcd4'
    });
    return;
  }

  // Validar inicio y destino
  if (!inicioId || !destinoId) {
    Swal.fire({
      icon: 'warning',
      title: 'Ubicación requerida',
      text: 'Por favor, selecciona tanto el punto de inicio como el de destino.',
      confirmButtonColor: '#00bcd4'
    });
    return;
  }
  if (inicioId === destinoId) {
    Swal.fire({
      icon: 'warning',
      title: 'Ubicaciones iguales',
      text: 'El punto de inicio y destino no pueden ser el mismo.',
      confirmButtonColor: '#00bcd4'
    });
    return;
  }

  // Validar asientos
  if (!asientos || asientos < 1 || asientos > 3) {
    Swal.fire({
      icon: 'warning',
      title: 'Cantidad de asientos inválida',
      text: 'Por favor, selecciona una cantidad de asientos válida.',
      confirmButtonColor: '#00bcd4'
    });
    return;
  }

  // Validar existencia de ruta
  const camino = dijkstra(nodos, conexiones, inicioId, destinoId);
  if (camino.length === 0) {
    Swal.fire({
      icon: 'error',
      title: 'Sin ruta disponible',
      text: 'No hay ruta disponible entre los puntos seleccionados.',
      confirmButtonColor: '#00bcd4'
    });
    return;
  }

  // GUARDAR LA RESERVA EN LOCALSTORAGE
  const user = JSON.parse(sessionStorage.getItem("usuarioActivo"));
  const reservas = JSON.parse(localStorage.getItem('reservas')) || [];
  const nuevaReserva = {
    id: "reserva-" + Date.now(),
    carritoId: "Por asignar", // Puedes asignar el carrito real si tienes lógica para eso
    clienteEmail: user.email,
    fecha,
    hora,
    inicioId,
    destinoId,
    estado: "pendiente"
  };
  reservas.push(nuevaReserva);
  localStorage.setItem('reservas', JSON.stringify(reservas));

  cerrarModal('modalReserva');
  Swal.fire({
    icon: 'success',
    title: '¡Reserva confirmada!',
    text: 'Tu reserva ha sido registrada y está pendiente de confirmación por un chofer.',
    confirmButtonColor: '#00bcd4'
  });
}

// ---------------------- RESERVAS ----------------------

function realizarReserva() {
  mostrarModal('modalReservas');
  mostrarReservas();
}

function mostrarReservas() {
  const reservas = JSON.parse(localStorage.getItem('reservas')) || [];
  const user = JSON.parse(sessionStorage.getItem("usuarioActivo"));
  const lista = document.getElementById('listaReservas');
  lista.innerHTML = "";

  // Solo mostrar reservas del usuario actual
  const reservasFiltradas = reservas.filter(r => r.clienteEmail === user.email);

  if (reservasFiltradas.length === 0) {
    lista.innerHTML = "<p>No tienes reservas.</p>";
    return;
  }

  reservasFiltradas.forEach(reserva => {
    const div = document.createElement('div');
    div.className = "reserva-item";
    div.innerHTML = `
      <strong>Carrito:</strong> ${reserva.carritoId} <br>
      <strong>Fecha:</strong> ${reserva.fecha} <br>
      <strong>Hora:</strong> ${reserva.hora} <br>
      <strong>Inicio:</strong> ${reserva.inicioId} <br>
      <strong>Destino:</strong> ${reserva.destinoId} <br>
      <strong>Estado:</strong> <span id="estado-${reserva.id}">${reserva.estado}</span>
    `;

    // Si la reserva está confirmada, muestra botón para iniciar viaje
    if (reserva.estado === "confirmada") {
      const btn = document.createElement('button');
      btn.textContent = "Iniciar viaje";
      btn.onclick = () => iniciarViajeCliente(reserva);
      div.appendChild(btn);
    }

    lista.appendChild(div);
  });
}

// Iniciar el viaje del cliente (mueve el carrito en el mapa)
function iniciarViajeCliente(reserva) {
  // Calcula la ruta óptima y mueve el marcador
  const camino = dijkstra(nodos, conexiones, reserva.inicioId, reserva.destinoId);
  if (camino.length === 0) {
    Swal.fire({
      icon: 'error',
      title: 'Sin ruta disponible',
      text: 'No hay ruta disponible entre los puntos seleccionados.',
      confirmButtonColor: '#00bcd4'
    });
    return;
  }

  const path = camino.map(id => {
    const nodo = nodos.find(n => n.id === id);
    return { lat: nodo.lat, lng: nodo.lng };
  });

  if (rutaActual) rutaActual.setMap(null);

  rutaActual = new google.maps.Polyline({
    path: path,
    geodesic: true,
    strokeColor: "#ff0000",
    strokeOpacity: 1.0,
    strokeWeight: 4
  });
  rutaActual.setMap(map);

  moveSmoothly(marker, path, 0.01);

  Swal.fire({
    icon: 'success',
    title: '¡Viaje iniciado!',
    text: 'El carrito está en camino a tu destino.',
    confirmButtonColor: '#00bcd4'
  });
}

// Al cargar la página, revisa si hay reservas confirmadas y muestra el botón
function revisarReservasConfirmadas() {
  const reservas = JSON.parse(localStorage.getItem('reservas')) || [];
  const user = JSON.parse(sessionStorage.getItem("usuarioActivo"));
  const reservasConfirmadas = reservas.filter(r => r.clienteEmail === user.email && r.estado === "confirmada");
  // Si quieres, puedes mostrar una notificación o resaltar el botón de reservas
}

// Modal y otras funciones auxiliares
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