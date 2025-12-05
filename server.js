// server.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const app = express();

// ==== CORS (para que tu front en 5501 pueda llamar al back) ====
const corsOptions = {
  origin: ["http://localhost:5501", "http://127.0.0.1:5501"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
app.use(cors(corsOptions));

// Para leer JSON en las peticiones
app.use(bodyParser.json());

// ==== CONEXIÓN A MONGODB ====
// Para Mongo local:
const MONGO_URI = "mongodb://127.0.0.1:27017/guarderia";
// Si usas Mongo Atlas, cambia la línea anterior por tu cadena de conexión.

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB conectado correctamente"))
  .catch((err) => console.error("❌ Error al conectar con MongoDB:", err));

// ==== MODELO DE USUARIO ====
const usuarioSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  nombre: { type: String, required: true },
  contrasena: { type: String, required: true },
});

const Usuario = mongoose.model("Usuario", usuarioSchema);

const saltRounds = 10;

// ==== REGISTER ====
app.post("/api/register", async (req, res) => {
  const { email, nombre, contrasena } = req.body;

  try {
    // Verificar si ya existe el email
    const existente = await Usuario.findOne({ email });
    if (existente) {
      return res.status(409).json({ message: "El email ya está registrado" });
    }

    const hashedPassword = bcrypt.hashSync(contrasena, saltRounds);

    const nuevoUsuario = new Usuario({
      email,
      nombre,
      contrasena: hashedPassword,
    });

    await nuevoUsuario.save();

    res.status(201).json({ message: "Usuario creado con éxito" });
  } catch (error) {
    console.error("Error en /api/register:", error);
    res.status(500).json({ message: "Error al registrar usuario" });
  }
});

// ==== LOGIN ====
app.post("/api/login", async (req, res) => {
  const { email, contrasena } = req.body;

  try {
    const user = await Usuario.findOne({ email });

    if (!user) {
      return res
        .status(401)
        .json({ message: "Email o contraseña incorrectos" });
    }

    const isMatch = bcrypt.compareSync(contrasena, user.contrasena);

    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Email o contraseña incorrectos" });
    }

    res.json({
      message: "Login exitoso",
      userId: user._id,
      nombre: user.nombre,
    });
  } catch (error) {
    console.error("Error en /api/login:", error);
    res.status(500).json({ message: "Error al iniciar sesión" });
  }
});

// ==== PUERTO ====
const PORT = 3000;
app.listen(PORT, () =>
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`)
);
