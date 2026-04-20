const express = require("express");
const cors = require("cors"); // add para front
const db = require("../repository/payasosRepository"); // Tu archivo del repositorio
const payasosService = require("../service/payasosService"); // Tu archivo del servicio

const app = express();
app.use(cors()); //add para front
const PORT = 3000;

// Middleware para entender JSON (por si más adelante añades un POST)
app.use(express.json());

// -----------------------------------------------
// --- AQUÍ EMPIEZA LO QUE SERIA EL CONTROLLER ---
// -----------------------------------------------

// GET para obtener todos los payasos
app.get("/payasos", async (req, res) => {
  try {
    // Usamos el servicio que ya tienes creado
    const payasos = await payasosService.getAllPayasos();
    res.status(200).json(payasos);
  } catch (error) {
    res.status(500).json({ error: "Error interno", details: error.message });
  }
}); //FIN GET ALL

// El POST para insertar un payaso
app.post("/payasos", async (req, res) => {
  try {
    // Extraemos los datos que nos envían
    const { name, email, arma } = req.body;

    // Llamamos a la función del service que ya tienes creada
    const newPayaso = await payasosService.registerPayaso(name, email, arma);

    // Si todo va bien, devolvemos un 201 (Creado) y los datos del payaso
    res.status(201).json(newPayaso);
  } catch (error) {
    // Si el service lanza un error (faltan datos o están repetidos), devolvemos 400
    res.status(400).json({ error: error.message });
  }
}); //FIN POST

// -----------------------------------------------
// --- AQUÍ TERMINA LO QUE SERIA EL CONTROLLER ---
// -----------------------------------------------

// Función para inicializar la base de datos y levantar el servidor
async function startServer() {
  try {
    // 1. Inicializamos la base de datos
    await db.init();
    //console.log(" Base de datos de payasos inicializada correctamente.");

    // 2. Levantamos el servidor
    app.listen(PORT, () => {
      console.log(` Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(" Error al iniciar la aplicación:", error);
  }
}

// Ejecutamos la función
startServer();
