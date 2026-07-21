const { isValidHttpUrl } = require("../utils/urlUtils");

function validateUrl(req, res, next) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "Missing required query param: url" });
  }

  if (!isValidHttpUrl(url)) {
    return res.status(400).json({ error: "Invalid URL. Must be a valid http/https URL." });
  }

  next();
}

module.exports = { validateUrl };
