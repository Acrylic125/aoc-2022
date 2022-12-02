const fs = require("fs");

(async () => {
  const data = await fs.promises.readFile("data.txt", "utf8");
  const rows = data.split("\n");

  const elves = [];

  let accumulator = 0;
  for (const row of rows) {
    console.log(row);
    if (row === "") {
      elves.push(accumulator);
      accumulator = 0;
      continue;
    }
    accumulator += parseInt(row);
  }

  console.log(
    elves
      .sort((a, b) => b - a)
      .filter((v, index) => {
        return index < 3;
      })
      .reduce((a, b) => a + b)
  );
})();
