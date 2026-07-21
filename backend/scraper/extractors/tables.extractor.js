const { cleanText } = require("../../utils/textUtils");

function extractTables($) {
  const tables = [];

  $("table").each((_, tableEl) => {
    const headers = [];
    $(tableEl)
      .find("thead th, tr th")
      .each((_, th) => {
        headers.push(cleanText($(th).text()));
      });

    const rows = [];
    $(tableEl)
      .find("tbody tr, tr")
      .each((_, tr) => {
        const cells = [];
        $(tr)
          .find("td")
          .each((_, td) => {
            cells.push(cleanText($(td).text()));
          });
        if (cells.length > 0) rows.push(cells);
      });

    if (headers.length > 0 || rows.length > 0) {
      tables.push({ headers, rows });
    }
  });

  return tables;
}

module.exports = { extractTables };
