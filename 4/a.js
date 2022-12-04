const fs = require("fs");

function parseRange(str) {
  return str.split("-").map((v) => parseInt(v));
}

(async () => {
  const data = await fs.promises.readFile("data.txt", "utf8");
  const lines = data.split("\n");
  let count = 0;

  lines.forEach((line) => {
    if (line === "") return;
    const [p1, p2] = line.split(",");

    const [min1, max1] = parseRange(p1);
    const [min2, max2] = parseRange(p2);

    // Check if line 1 is within line 2
    if (min1 >= min2 && max1 <= max2) {
      count++;
      return;
    }
    // Check if line 2 is within line 1
    if (min2 >= min1 && max2 <= max1) {
      count++;
      return;
    }
  });
  console.log(count);
})();
