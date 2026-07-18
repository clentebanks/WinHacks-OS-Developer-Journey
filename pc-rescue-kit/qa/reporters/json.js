const fs = require("fs");
module.exports = function jsonReporter(report, file) { fs.writeFileSync(file, JSON.stringify(report, null, 2)); };
