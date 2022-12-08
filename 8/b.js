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

  var highestScore = 0;
  const maxRow = map.length,
    maxCol = map[0].length;
  // Use a for loop to loop through map.length
  for (var row = 0; row < map.length; row++) {
    for (var col = 0; col < maxCol; col++) {
      const treeHeight = map[row][col];
      // if (row === 0 || col === 0 || row === map.length - 1 || col === maxCol - 1) {
      //   visibleTrees++;
      //   continue;
      // }

      var treesCanSeeLeft = 0;
      for (var curRow = row - 1; curRow >= 0; curRow--) {
        if (curRow === row) {
          continue;
        }
        treesCanSeeLeft++;
        if (map[curRow][col] >= treeHeight) {
          break;
        }
      }

      var treesCanSeeRight = 0;
      for (var curRow = row + 1; curRow < maxRow; curRow++) {
        if (curRow === row) {
          continue;
        }
        treesCanSeeRight++;
        if (map[curRow][col] >= treeHeight) {
          break;
        }
      }

      var treesCanSeeUp = 0;
      for (var curCol = col; curCol >= 0; curCol--) {
        if (curCol === col) {
          continue;
        }
        treesCanSeeUp++;
        if (map[row][curCol] >= treeHeight) {
          break;
        }
      }

      var treesCanSeeDown = 0;
      for (var curCol = col + 1; curCol < maxCol; curCol++) {
        if (curCol === col) {
          continue;
        }
        treesCanSeeDown++;
        if (map[row][curCol] >= treeHeight) {
          break;
        }
      }

      console.log(row, col);
      console.log(treesCanSeeUp, treesCanSeeLeft, treesCanSeeRight, treesCanSeeDown);
      highestScore = Math.max(highestScore, treesCanSeeLeft * treesCanSeeRight * treesCanSeeUp * treesCanSeeDown);

      // if (canSeeDown || canSeeLeft || canSeeRight || canSeeUp) {
      //   visibleTrees++;
      // }
    }
  }
  console.log(highestScore);
})();
