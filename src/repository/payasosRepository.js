// src/payasoRepository.js
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

// Variable para guardar la conexión a la base de datos
let dbConnection;

const db = {
  // 1. Inicializamos la BD en memoria y creamos la tabla
  init: async () => {
    dbConnection = await open({
      // filename: ':memory:',  <-- Comentamos la memoria RAM
      filename: "./test.sqlite", // <-- Creamos un archivo físico
      driver: sqlite3.Database,
    });

    await dbConnection.exec(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL
      )
    `);
  },

  // 2. Buscar usuario
  findUserByEmail: async (email) => {
    // get() devuelve la primera fila que coincida
    const user = await dbConnection.get(
      "SELECT * FROM usuarios WHERE email = ?",
      [email],
    );
    return user || null;
  },

  // 3. Guardar usuario
  saveUser: async (user) => {
    // run() ejecuta la consulta (INSERT, UPDATE, DELETE)
    const result = await dbConnection.run(
      "INSERT INTO usuarios (name, email) VALUES (?, ?)",
      [user.name, user.email],
    );
    // SQLite devuelve el ID autogenerado en result.lastID
    return { id: result.lastID, name: user.name, email: user.email };
  },

  // 4. Limpiar la base de datos entre pruebas (Borramos los registros, no la tabla)
  clear: async () => {
    await dbConnection.run("DELETE FROM usuarios");
  },

  // 5. Cerrar la conexión al terminar todo
  close: async () => {
    if (dbConnection) {
      await dbConnection.close();
    }
  },
};

module.exports = db;
