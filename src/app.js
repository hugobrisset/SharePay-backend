const express = require("express");
const cors = require("cors");

const healthRoutes = require("./routes/health.routes");
const userRoutes = require("./routes/users.routes");
const authRoutes = require("./routes/auth.routes");
const groupRoutes = require("./routes/group.routes");

// On crée une instance d'application Express
const app = express();

app.use(cors());
app.use(express.json());

/** Route  */
app.use("/health", healthRoutes);
app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/groups", groupRoutes);

// On exporte l'app pour pouvoir l'utiliser dans server.js
module.exports = app;