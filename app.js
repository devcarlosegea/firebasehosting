// Configuración de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js";
import { getStorage, ref as storageRef, listAll, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-storage.js";

const firebaseConfig = {
    apiKey: "TU_API_KEY",
    authDomain: "TU_AUTH_DOMAIN",
    databaseURL: "TU_DATABASE_URL",
    projectId: "TU_PROJECT_ID",
    storageBucket: "TU_STORAGE_BUCKET",
    messagingSenderId: "TU_MESSAGING_SENDER_ID",
    appId: "TU_APP_ID"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const storage = getStorage(app);

// Función para buscar el vehículo
function buscarVehiculo() {
    const matricula = document.getElementById("matriculaInput").value.trim();
    if (!matricula) {
        alert("Introduce una matrícula");
        return;
    }

    const vehiculoRef = ref(database, 'ListaDeCOCHES');
    get(vehiculoRef).then((snapshot) => {
        if (snapshot.exists()) {
            console.log("Datos de ListaDeCOCHES:", snapshot.val()); // Depuración
            let encontrado = false;
            snapshot.forEach(childSnapshot => {
                const coche = childSnapshot.val();
                console.log("Coche encontrado:", coche); // Depuración
                if (coche.matricula === matricula) {
                    mostrarInformacionVehiculo(coche);
                    cargarImagenesChequeos(coche.key); // Usamos la key para cargar imágenes
                    encontrado = true;
                }
            });
            if (!encontrado) alert("Vehículo no encontrado");
        } else {
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
