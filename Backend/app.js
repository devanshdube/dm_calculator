const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
// const apiRoutes = require("./apiRoutes");
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// app.use("/api", apiRoutes);

// 404 handler
// app.use("*", (req, res) => {
//   res.status(404).json({ error: "Route not found" });
// });

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server Run on PORT : ${port}`);
});
