const fs = require("fs");

(async () => {
  const data = await fs.promises.readFile("data.txt", "utf8");
  const rows = data.split("\n");

  let highest = 0;
  let accumulator = 0;
  for (const row of rows) {
    if (row === "") {
      highest = Math.max(highest, accumulator);
      accumulator = 0;
      continue;
    }
    accumulator += parseInt(row);
  }

  console.log(highest);
})();
