const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const apiRouter = require("./router/router");
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth/api/calculator", apiRouter);

// 404 handler
// app.use("*", (req, res) => {
//   res.status(404).json({ error: "Route not found" });
// });

const port = process.env.PORT || 5555;

app.listen(port, () => {
  console.log(`Server Run on PORT : ${port}`);
});
