1. npm init -y //Crear el servidor node
2. npm install --save-dev jest //Instalamos framework JEST para testeo
3. Creamos la carpeta test y src al mismo nivel que la "node_modules"
4. Publicamos en Github
5. Vamos a simular una base de datos: Para ello creaamos dentro de src:
   Al mismo nivel un archivo db.js y una carpeta service con payasoService.js dentro
6. Coopiamos las cosas de "https://github.com/zoniak/IntegracionJest/tree/main"
7. Modificamos todo para que esté adaptado a los payasos asesinos
8. Creamos payasoServiceJestIntegracion.test.js y lo añadimos
9. Modificamos package.json en test poner: -> "test": "jest"
10. ponemos en el terminal npm test
11. Y se realiza correctamente los test

---

Conexión a la BBDD lite:

1. npm install sqlite3 sqlite | Consejo: Usar la extension extensión "SQLite Viewer" de Florian Klampfer
