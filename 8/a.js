const fs = require("fs");

(async () => {
  const data = await fs.promises.readFile("data.txt", "utf8");
  const lines = data.split("\n");

  /** @type {number[][]} */
  const map = [];
  lines.forEach((line) => {
    if (line === "") {
      return;
    }
    map.push(line.split("").map((c) => parseInt(c)));
  });
  console.log(map);

  var visibleTrees = 0;
  const maxRow = map.length,
    maxCol = map[0].length;
  // Use a for loop to loop through map.length
  for (var row = 0; row < map.length; row++) {
    for (var col = 0; col < maxCol; col++) {
      const treeHeight = map[row][col];
      if (row === 0 || col === 0 || row === map.length - 1 || col === maxCol - 1) {
        visibleTrees++;
        continue;
      }

      var canSeeLeft = true;


      for (var curRow = 0; curRow < row; curRow++) {
        if (curRow === row) {
          continue;
        }
        if (map[curRow][col] >= treeHeight) {
          canSeeLeft = false;
          break;
        }
      }

      var canSeeRight = true;
      for (var curRow = row + 1; curRow < maxRow; curRow++) {
        if (curRow === row) {
          continue;
        }
        if (map[curRow][col] >= treeHeight) {
          canSeeRight = false;
          break;
        }
      }

      var canSeeUp = true;
      for (var curCol = 0; curCol < col; curCol++) {
        if (curCol === col) {
          continue;
        }
        if (map[row][curCol] >= treeHeight) {
          canSeeUp = false;
          break;
        }
      }

      var canSeeDown = true;
      for (var curCol = col + 1; curCol < maxCol; curCol++) {
        if (curCol === col) {
          continue;
        }
        if (map[row][curCol] >= treeHeight) {
          canSeeDown = false;
          break;
        }
      }

      if (canSeeDown || canSeeLeft || canSeeRight || canSeeUp) {
        visibleTrees++;
      }
    }
  }
  console.log(visibleTrees);
})();
