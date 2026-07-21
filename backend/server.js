const express = require("express");
const cors = require("cors");
const path = require("path");

const analyzeRoute = require("./routes/analyze.route");
const { errorHandler } = require("./middlewares/errorHandler.middleware");
const { PORT } = require("./config/env");
const logger = require("./utils/logger");

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "../frontend")));

app.use("/", analyzeRoute);

app.get("/health", (req, res) => res.json({ status: "ok" }));

app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`AEO/GEO backend listening on http://localhost:${PORT}`);
});
