const { analyzeUrl } = require("../services/analyze.service");

async function handleAnalyze(req, res, next) {
  try {
    const { url } = req.query;
    const result = await analyzeUrl(url);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = { handleAnalyze };
