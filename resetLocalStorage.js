const fs = require("fs");
const path = require("path");

// Ruta al archivo de almacenamiento local (simulado para este ejemplo)
const localStorageFilePath = path.join(__dirname, "localStorage.json");

// Datos iniciales para el localStorage
const initialData = {
  users: [],
};

// Escribir los datos iniciales en el archivo de almacenamiento local
fs.writeFileSync(localStorageFilePath, JSON.stringify(initialData, null, 2));

console.log("localStorage reiniciado.");
