const fs = require("fs");

(async () => {
  const data = await fs.promises.readFile("data.txt", "utf8");
})();
