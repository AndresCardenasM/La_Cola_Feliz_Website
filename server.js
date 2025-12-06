const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const { Pool } = require("pg");

const app = express();


const corsOptions = {
  origin: ["http://localhost:5501", "http://127.0.0.1:5501"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
app.use(cors(corsOptions));

app.use(bodyParser.json());

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "guarderia",
  password: "DaPet2025#",
  port: 5432,
});

const saltRounds = 10;

// ==== REGISTER ====
app.post("/api/register", async (req, res) => {
  const { email, nombre, contrasena } = req.body;
  try {
    const hashedPassword = bcrypt.hashSync(contrasena, saltRounds);
    await pool.query(
      "INSERT INTO usuarios (email, nombre, contrasena) VALUES ($1, $2, $3)",
      [email, nombre, hashedPassword]
    );
    res.status(201).json({ message: "Usuario creado con éxito" });
  } catch (error) {
    console.error("Error en /api/register:", error);
    if (error.code === "23505") {
      return res.status(409).json({ message: "El email ya está registrado" });
    }
    res.status(500).json({ message: "Error al registrar usuario" });
  }
});

// ==== LOGIN ====
app.post("/api/login", async (req, res) => {
  const { email, contrasena } = req.body;
  try {
    const result = await pool.query("SELECT * FROM usuarios WHERE email=$1", [
      email,
    ]);
    if (result.rows.length === 0) {
      return res
        .status(401)
        .json({ message: "Email o contraseña incorrectos" });
    }
    const user = result.rows[0];
    const isMatch = bcrypt.compareSync(contrasena, user.contrasena);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Email o contraseña incorrectos" });
    }
    res.json({
      message: "Login exitoso",
      userId: user.id,
      nombre: user.nombre,
    });
  } catch (error) {
    console.error("Error en /api/login:", error);
    res.status(500).json({ message: "Error al iniciar sesión" });
  }
});

const PORT = 3000;
app.listen(PORT, () =>
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
);
