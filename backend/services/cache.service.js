const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { CACHE_TTL_MS } = require("../config/env");
const logger = require("../utils/logger");

const CACHE_DIR = path.join(__dirname, "../data/cache");
fs.mkdirSync(CACHE_DIR, { recursive: true });

const memoryStore = new Map();

function keyToFilePath(key) {
  const hash = crypto.createHash("sha256").update(key).digest("hex");
  return path.join(CACHE_DIR, `${hash}.json`);
}

function get(key) {
  const memEntry = memoryStore.get(key);
  if (memEntry) {
    if (Date.now() <= memEntry.expiresAt) return memEntry.value;
    memoryStore.delete(key);
  }

  const filePath = keyToFilePath(key);
  if (!fs.existsSync(filePath)) return null;

  try {
    const { value, expiresAt } = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    if (Date.now() > expiresAt) {
      fs.unlinkSync(filePath);
      return null;
    }
    memoryStore.set(key, { value, expiresAt });
    return value;
  } catch (err) {
    logger.warn("Failed to read cache file, ignoring:", err.message);
    return null;
  }
}

function set(key, value) {
  const expiresAt = Date.now() + CACHE_TTL_MS;
  memoryStore.set(key, { value, expiresAt });

  try {
    fs.writeFileSync(keyToFilePath(key), JSON.stringify({ value, expiresAt }));
  } catch (err) {
    logger.warn("Failed to persist cache to disk:", err.message);
  }
}

module.exports = { get, set };
