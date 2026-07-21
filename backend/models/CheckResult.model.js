function createCheckResult({ id, label, passed, weight, message }) {
  return { id, label, passed: Boolean(passed), weight, message };
}

module.exports = { createCheckResult };
