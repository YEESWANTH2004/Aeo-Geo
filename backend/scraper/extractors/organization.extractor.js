const { findByType } = require("../../utils/schemaUtils");

function extractOrganization($, structuredData) {
  const orgEntities = findByType(structuredData, "Organization");
  if (orgEntities.length === 0) return { name: null, logo: null, sameAs: [] };

  const org = orgEntities[0];
  const logo =
    typeof org.logo === "string" ? org.logo : org.logo && org.logo.url;

  return {
    name: org.name || null,
    logo: logo || null,
    sameAs: Array.isArray(org.sameAs) ? org.sameAs : [],
  };
}

module.exports = { extractOrganization };
