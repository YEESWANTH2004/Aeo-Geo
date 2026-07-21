const logger = require("../utils/logger");

function errorHandler(err, req, res, next) {
  logger.error(err.message);

  if (err.code === "ENOTFOUND" || err.code === "ECONNREFUSED") {
    return res.status(502).json({ error: "Could not reach the target website." });
  }
  if (err.code === "ECONNABORTED") {
    return res.status(504).json({ error: "Target website timed out." });
  }

  res.status(500).json({ error: err.message || "Internal server error." });
}

module.exports = { errorHandler };
