import fs from "fs";

const data = await fs.promises.readFile("data.txt", "utf8");
const lines = data.split("\n");

type Node = {
  material: "air" | "rock" | "sand" | "marker";
  x: number;
  y: number;
};

const bounds = [1000, 500];

const map: Node[][] = Array.from({ length: bounds[1] }, (_, y) => {
  return Array.from({ length: bounds[0] }, (_, x) => {
    return {
      material: "air",
      x,
      y,
    };
  });
});

for (const line of lines) {
  if (line === "") {
    continue;
  }
  const positions = line.split(" -> ").map((sPos) => {
    const [x, y] = sPos.split(",").map((s) => parseInt(s));
    return [x, y];
  });

  let curPos = positions[0];
  for (let i = 1; i < positions.length; i++) {
    const endPos = positions[i];
    // Draw from curPos to endPos
    const [x1, y1] = curPos;
    const [x2, y2] = endPos;

    if (x1 === x2) {
      // Vertical line
      const yMin = Math.min(y1, y2);
      const yMax = Math.max(y1, y2);
      for (let y = yMin; y <= yMax; y++) {
        map[y][x1] = {
          material: "rock",
          x: x1,
          y,
        };
      }
    } else if (y1 === y2) {
      // Horizontal line
      const xMin = Math.min(x1, x2);
      const xMax = Math.max(x1, x2);
      for (let x = xMin; x <= xMax; x++) {
        map[y1][x] = {
          material: "rock",
          x,
          y: y1,
        };
      }
    } else {
      console.log(
        `For line ${line}
      Unexpected line: 
      `,
        curPos,
        endPos
      );
    }

    curPos = endPos;
  }
}

function printMap(start: [number, number] = [490, 0], end: [number, number] = [505, 15]) {
  for (let y = start[1]; y < end[1]; y++) {
    const line = map[y];

    console.log(
      line.slice(start[0], end[0]).reduce((acc, node) => {
        if (node.material === "rock") {
          return acc + "#";
        } else if (node.material === "sand") {
          return acc + "o";
        } else if (node.material === "marker") {
          return acc + "x";
        } else {
          return acc + ".";
        }
      }, "")
    );
  }
}

function isPosOutOfBounds(pos: [number, number]) {
  const [x, y] = pos;
  return x < 0 || x >= bounds[0] || y < 0 || y >= bounds[1];
}

function canLand(pos: [number, number]) {
  const [x, y] = pos;
  if (isPosOutOfBounds(pos)) {
    return false;
  }
  if (isPosOutOfBounds([x, y + 1])) {
    return false;
  }
  const material = map[y][x].material;
  const materialBelow = map[y + 1][x].material;
  return (material === "air" || material === "marker") && (materialBelow === "rock" || materialBelow === "sand");
}

function isBlocked(pos: [number, number]) {
  const [x, y] = pos;
  if (isPosOutOfBounds(pos)) {
    return true;
  }
  const material = map[y][x].material;
  return material === "rock" || material === "sand";
}

type Pos = [number, number];

let sandCount = 0;
main: while (true) {
  const sandPos: Pos = [500, 0];

  while (true) {
    const belowPos: Pos = [sandPos[0], sandPos[1] + 1];
    const leftPos: Pos = [sandPos[0] - 1, sandPos[1]];
    const rightPos: Pos = [sandPos[0] + 1, sandPos[1]];
    const belowLeftPos: Pos = [sandPos[0] - 1, sandPos[1] + 1];
    const belowRightPos: Pos = [sandPos[0] + 1, sandPos[1] + 1];

    const newPos: Pos = [belowPos[0], belowPos[1]];

    if (isBlocked(newPos)) {
      if (!isBlocked(belowLeftPos)) {
        newPos[0] = belowLeftPos[0];
        newPos[1] = belowLeftPos[1];
      } else if (!isBlocked(belowRightPos)) {
        newPos[0] = belowRightPos[0];
        newPos[1] = belowRightPos[1];
      }
      // All the points below are blocked
      else {
        if (canLand(sandPos)) {
          const mapRow = map[sandPos[1]];
          if (mapRow !== undefined) {
            mapRow[sandPos[0]].material = "sand";
          }
          break;
        }
      }
    }

    if (isPosOutOfBounds(newPos)) {
      console.log("Out of bounds " + newPos);
      break main;
    }

    // If we can move, we set the new position
    sandPos[0] = newPos[0];
    sandPos[1] = newPos[1];

    if (sandCount === 833) {
      const mapRow = map[sandPos[1]];
      if (mapRow !== undefined) {
        mapRow[sandPos[0]].material = "marker";
      }
    }
  }

  sandCount++;
  // if (sandCount <= 833) {
  //   console.log("Sand count", sandCount);
  //   printMap();
  // }
}

// printMap();
printMap([400, 0], [550, 200]);
console.log(sandCount);
