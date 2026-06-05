// tests/payasosService.integration.test.js
const {
  registerPayaso,
  getAllPayasos,
} = require("../src/service/payasosService");
const db = require("../src/repository/payasosRepository");

describe("Pruebas de Integración: PayasosService + SQLite", () => {
  // ANTES DE TODAS LAS PRUEBAS: Abrimos la BD y creamos la tabla
  beforeAll(async () => {
    await db.init();
  });

  /*
  // ANTES DE CADA PRUEBA:
  //        Limpiamos los datos para que sean independientes
  //        O podemos eliminar test.sqlite que es más facil
  beforeEach(async () => {
    await db.clear();
  });
  */

  // DESPUÉS DE TODAS LAS PRUEBAS: Cerramos la conexión
  afterAll(async () => {
    await db.close();
  });

  // --- LAS PRUEBAS SON EXACTAMENTE IGUALES QUE ANTES ---

  test("Debe registrar un payaso nuevo y guardarlo en la base de datos", async () => {
    const result = await registerPayaso(
      "Pennywise",
      "Pennywise@ejemplo.com",
      "magia",
    );

    expect(result).toHaveProperty("id");
    expect(result.name).toBe("Pennywise");

    const userInDb = await db.findPayasoByEmail("Pennywise@ejemplo.com");
    expect(userInDb).not.toBeNull();
    expect(userInDb.name).toBe("Pennywise");
  });

  test("Debe lanzar un error si intentamos registrar un email duplicado", async () => {
    await registerPayaso(
      "Juan Carlos Monedero",
      "venenzuela@ejemplo.com",
      "Mentiroso",
    );

    await expect(
      registerPayaso(
        "Juan Carlos Monedero",
        "venenzuela@ejemplo.com",
        "Mentiroso",
      ),
    ).rejects.toThrow("El payaso ya está registrado con ese email");
  });

  test("Debe lanzar un error si faltan datos y no tocar la base de datos", async () => {
    await expect(registerPayaso("Solo Nombre", null, null)).rejects.toThrow(
      "El nombre y el email son obligatorios",
    );

    const userInDb = await db.findPayasoByEmail(null);
    expect(userInDb).toBeNull();
  });

  //  TESTS NUEVOS

  // TEST 4: Comprueba la conexión Service → Repository → BBDD usando getAllPayasos()

  test("Debe obtener todos los payasos registrados en la base de datos", async () => {
    // 1. Limpiamos y preparamos unos payasos para tener información en la BBDD
    await db.clear();
    await registerPayaso("Pedro", "pedropicapiedra@gmail.com", "piedra");
    await registerPayaso("Jesus", "diosomnipresente@gmail.com", "bastón");

    // 2. Llamamos a la función del service que conecta con findAllPayasos() del repository
    const payasos = await getAllPayasos();

    // 3. Comprobamos que nos devuelve los dos payasos que hemos insertado
    expect(payasos).toHaveLength(2);
    expect(payasos[0].name).toBe("Pedro");
    expect(payasos[1].name).toBe("Jesus");
  }); // fin test 4

  // TEST 5: Comprueba la conexión Repository → BBDD usando findPayasoByName()

  test("Debe encontrar un payaso por nombre directamente en el repositorio", async () => {
    // 1. Registramos un payaso a través del service
    await registerPayaso("Ronald", "ronald@mcdonalds.com", "hamburguesa");

    // 2. Llamamos directamente al repository para buscar por nombre
    const payasoEncontrado = await db.findPayasoByName("Ronald");

    // 3. Comprobamos que el repository ha leído bien los datos de la BBDD
    expect(payasoEncontrado).not.toBeNull();
    expect(payasoEncontrado.name).toBe("Ronald");
    expect(payasoEncontrado.email).toBe("ronald@mcdonalds.com");
    expect(payasoEncontrado.arma).toBe("hamburguesa");
  }); // fin test 5

  // TEST 6: Comprueba que el Service bloquea un nombre duplicado (Service → Repository → BBDD)

  test("Debe lanzar un error si intentamos registrar un nombre duplicado", async () => {
    // 1. Registramos un payaso primero para que el nombre ya exista en la BBDD
    await registerPayaso("Bibi Netanyahu", "sionista@autoritario.com", "poder");

    // 2. Intentamos registrar otro payaso con el mismo nombre pero distinto email
    // Usamos rejects.toThrow para capturar errores asíncronos en Jest
    await expect(
      registerPayaso("Bibi Netanyahu", "otroEmail@autoritario.com", "poder"),
    ).rejects.toThrow("El payaso ya está registrado con ese nombre");
  }); // fin test 6
});

/*
  test("Debe lanzar un error si intentamos registrar un nombre duplicado", async () => {
    // 1. Preparamos el entorno insertando un payaso primero
    await registerPayaso("Bibi Netanyahu", "sionista@autoritario.com");

    // 2. Intentamos registrar a otra persona con el mismo nombre
    // Usamos rejects.toThrow para capturar errores asíncronos en Jest
    await expect(
      registerPayaso("Bibi Netanyahu", "EpsteinMossad@autoritario.com"),
    ).rejects.toThrow("El payaso ya está registrado con ese nombre");
  }); 
    */
