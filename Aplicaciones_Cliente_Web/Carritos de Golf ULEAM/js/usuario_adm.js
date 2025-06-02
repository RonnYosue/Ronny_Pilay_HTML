let map;
let nodos = [];
let conexiones = [];
let carritos = [];
let carritoMarkers = [];

const UBICACION_PREDETERMINADA_ID = 1; // Cambia este valor por el id real de tu nodo predeterminado

document.addEventListener("DOMContentLoaded", function () {
  // Mostrar saludo
  const user = JSON.parse(sessionStorage.getItem("usuarioActivo"));
  const saludo = document.getElementById("saludo");
  if (user && user.nombre && user.tipo) {
    saludo.innerText = `HOLA ${user.nombre.toUpperCase()}, ${user.tipo.toUpperCase()}`;
  } else {
    saludo.innerText = "";
  }

  // Evento para el formulario de agregar carrito
  const form = document.getElementById('formAgregarCarrito');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = form.carritoId.value;
    const asientos = form.asientos.value;

    // Buscar la ubicación predeterminada
    const nodo = nodos.find(n => n.id == UBICACION_PREDETERMINADA_ID);
    if (!nodo) {
      alert("Ubicación predeterminada no encontrada.");
      return;
    }

    const nuevoCarrito = {
      id,
      lat: nodo.lat,
      lng: nodo.lng,
      asientos
    };
    carritos.push(nuevoCarrito);
    localStorage.setItem('carritos', JSON.stringify(carritos));

    agregarMarkerCarrito(nuevoCarrito);

    cerrarModal('modalAgregarCarrito');
    form.reset();
  });

  // Sidebar toggle
  const toggleBtn = document.getElementById('toggleSidebar');
  const sidebar = document.getElementById('sidebar');
  const mainContent = document.querySelector('.main-content');
  toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
    mainContent.classList.toggle('collapsed');
  });
});

// Inicializa el mapa y carga datos
async function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: -0.9527943857230249, lng: -80.74554766436874 },
    zoom: 17,
    minZoom: 17,
    maxZoom: 25
  });

  await cargarDatos();
  mostrarNodos();
  dibujarConexiones();
}

// Carga nodos, conexiones y carritos
async function cargarDatos() {
  // Cargar nodos
  const response = await fetch("json/nodos.json");
  const data = await response.json();
  nodos = data.nodos;

  // Llenar select de ubicación solo con la predeterminada
  const ubicacionSelect = document.getElementById('ubicacion');
  ubicacionSelect.innerHTML = "";
  const nodoPredeterminado = nodos.find(n => n.id == UBICACION_PREDETERMINADA_ID);
  if (nodoPredeterminado) {
    const option = document.createElement('option');
    option.value = nodoPredeterminado.id;
    option.textContent = nodoPredeterminado.nombre;
    ubicacionSelect.appendChild(option);
  }
  ubicacionSelect.disabled = true;

  // Cargar conexiones
  const conexionesResponse = await fetch('json/conexiones.json');
  const conexionesData = await conexionesResponse.json();
  conexiones = conexionesData.conexiones;

  // Cargar carritos guardados
  carritos = JSON.parse(localStorage.getItem('carritos')) || [];
  carritos.forEach(carrito => {
    agregarMarkerCarrito(carrito);
  });
}

// Agrega un marcador de carrito al mapa
function agregarMarkerCarrito(carrito) {
  const marker = new google.maps.Marker({
    position: { lat: carrito.lat, lng: carrito.lng },
    map: map,
    title: `Carrito ${carrito.id}`,
    icon: {
      url: "image/car.png",
      scaledSize: new google.maps.Size(50, 50)
    }
  });
  carritoMarkers.push(marker);
}

// Opcional: mostrar nodos (puedes dejarlo vacío si no quieres mostrar nodos)
function mostrarNodos() {
  // Ejemplo para mostrar todos los nodos como marcadores:
  // nodos.forEach(nodo => {
  //   new google.maps.Marker({
  //     position: { lat: nodo.lat, lng: nodo.lng },
  //     map: map,
  //     title: nodo.nombre,
  //     label: `${nodo.id}`
  //   });
  // });
}

// Dibuja las conexiones en el mapa
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

// Mostrar y cerrar modales
function mostrarModal(id) {
  document.getElementById(id).classList.remove('hidden');
}
function cerrarModal(id) {
  document.getElementById(id).classList.add('hidden');
}

// Cerrar sesión
function cerrarSesion() {
  window.location.href = "login.html";
}

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
    lista.appendChild(div);
  });
}