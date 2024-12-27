// Configuración de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js";
import { getStorage, ref as storageRef, listAll, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-storage.js";

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
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const storage = getStorage(app);

function buscarVehiculo() {
    const matricula = document.getElementById("matriculaInput").value.trim();
    if (!matricula) {
        alert("Introduce una matrícula");
        return;
    }

    const vehiculoRef = ref(database, 'ListaDeCOCHES');
    get(vehiculoRef).then((snapshot) => {
        if (snapshot.exists()) {
            console.log("Datos de ListaDeCOCHES:", snapshot.val()); // Verificar datos obtenidos
            let encontrado = false;
            snapshot.forEach(childSnapshot => {
                const coche = childSnapshot.val();
                console.log("Coche en revisión:", coche); // Verificar cada coche
                if (coche.matricula === matricula) {
                    mostrarInformacionVehiculo(coche);
                    cargarImagenesChequeos(coche.key); // Usamos la key para cargar imágenes
                    encontrado = true;
                }
            });
            if (!encontrado) {
                console.log("Vehículo no encontrado con matrícula:", matricula); // Depuración
                alert("Vehículo no encontrado");
            }
        } else {
            console.log("No hay datos en ListaDeCOCHES");
            alert("No hay vehículos registrados en ListaDeCOCHES");
        }
    }).catch((error) => {
        console.error("Error al buscar el vehículo:", error);
    });
}


// Función para mostrar la información del vehículo
function mostrarInformacionVehiculo(coche) {
    const infoDiv = document.getElementById("vehiculo-info");
    infoDiv.innerHTML = `
        <strong>Matrícula:</strong> ${coche.matricula} <br>
        <strong>Marca:</strong> ${coche.marca} <br>
        <strong>Modelo:</strong> ${coche.modelo} <br>
        <strong>Año:</strong> ${coche.año} <br>
        <strong>Color:</strong> ${coche.color} <br>
        <strong>Fecha de Registro:</strong> ${coche.fecha} <br>
        <strong>URI:</strong> ${coche.uri} <br>
    `;
}

// Función para cargar las imágenes de los chequeos
function cargarImagenesChequeos(key) {
    const imagesSection = document.getElementById("imagenes-chequeos");
    imagesSection.innerHTML = "<h3>Imágenes de Chequeos</h3>";

    const folderRef = storageRef(storage, 'vehiculos/' + key + '/chequeos/');
    listAll(folderRef)
        .then((result) => {
            result.items.forEach((itemRef) => {
                getDownloadURL(itemRef).then((url) => {
                    const imgElement = document.createElement("img");
                    imgElement.src = url;
                    imgElement.style.width = "200px";
                    imgElement.style.margin = "10px";
                    imagesSection.appendChild(imgElement);
                });
            });
        })
        .catch((error) => {
            console.error("Error al cargar las imágenes:", error);
        });
}
