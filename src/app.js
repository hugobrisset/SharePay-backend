const express = require("express");
const cors = require("cors");

const userRoutes = require("./routes/users.routes");
const authRoutes = require("./routes/auth.routes");
const groupRoutes = require("./routes/group.routes");
const expenseRoutes = require("./routes/expense.routes");
const balanceRoutes = require("./routes/balance.routes");
const linkRoutes = require('./routes/link.routes')

const app = express();

app.use(cors());
app.use(express.json());

/** Route  */
app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/groups", groupRoutes);
app.use("/groups", expenseRoutes);
app.use("/groups", balanceRoutes);
app.use("/groups", linkRoutes);

module.exports = app;