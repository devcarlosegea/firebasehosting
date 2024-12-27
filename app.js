// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA7MqdXVJrpQiud_oAZowCwIwjjdN4yCRU",
  authDomain: "mantenimiento-de-vehicul-d415f.firebaseapp.com",
  databaseURL: "https://mantenimiento-de-vehicul-d415f-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "mantenimiento-de-vehicul-d415f",
  storageBucket: "mantenimiento-de-vehicul-d415f.appspot.com",
  messagingSenderId: "589467218933",
  appId: "1:589467218933:web:d10cca6e28342215e6e6bc",
  measurementId: "G-8PCR7EQN9Q"
};

// Inicializar Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-database.js";

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

function buscarVehiculo() {
  const matricula = document.getElementById("matriculaInput").value.trim();
  const resultados = document.getElementById("resultados");

  if (!matricula) {
    alert("Introduce una matrícula para buscar.");
    return;
  }

  resultados.innerHTML = "<p>Buscando...</p>";

  const vehiculoRef = ref(database, "ListaDeCOCHES");
  get(vehiculoRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        let encontrado = false;

        for (const key in data) {
          const coche = data[key];
          if (coche.matricula === matricula) {
            mostrarInformacionVehiculo(coche);
            encontrado = true;
            break;
          }
        }

        if (!encontrado) {
          resultados.innerHTML = "<p>No se encontró ningún vehículo con esa matrícula.</p>";
        }
      } else {
        resultados.innerHTML = "<p>No hay vehículos registrados.</p>";
      }
    })
    .catch((error) => {
      console.error("Error al buscar el vehículo:", error);
      resultados.innerHTML = "<p>Error al buscar el vehículo. Intenta nuevamente más tarde.</p>";
    });
}

function mostrarInformacionVehiculo(coche) {
  const resultados = document.getElementById("resultados");
  resultados.innerHTML = `
    <div>
      <h2>${coche.marca} ${coche.modelo} (${coche.año})</h2>
      <p><strong>Matrícula:</strong> ${coche.matricula}</p>
      <p><strong>Color:</strong> ${coche.color}</p>
      <p><strong>Fecha:</strong> ${coche.fecha}</p>
      <img src="${coche.uri}" alt="Imagen del vehículo" style="max-width:100%;height:auto;">
    </div>
  `;
}
