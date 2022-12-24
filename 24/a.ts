import fs from "fs";

type Vec2D = [number, number];
type Direction = Vec2D;
type SerializedVec2D = string;
type Node = {
  directions: Direction[];
  blocked?: boolean;
};

function serializedVec2D(vec: Vec2D): SerializedVec2D {
  return vec.join(",");
}
function vec2D(serialized: SerializedVec2D): Vec2D {
  return serialized.split(",").map((n) => parseInt(n, 10)) as Vec2D;
}

const data = await fs.promises.readFile("data.txt", "utf8");
const lines = data.split("\n");

let map: Node[][] = [];
lines.forEach((line, y) => {
  if (line === "") return;

  const row: Node[] = [];
  line.split("").forEach((char, x) => {
    if (char === "#") {
      row.push({ directions: [], blocked: true });
      return;
    }
    if (char === ".") {
      row.push({ directions: [] });
      return;
    }

    switch (char) {
      case "^":
        row.push({ directions: [[0, -1]] });
        break;
      case ">":
        row.push({ directions: [[1, 0]] });
        break;
      case "v":
        row.push({ directions: [[0, 1]] });
        break;
      case "<":
        row.push({ directions: [[-1, 0]] });
        break;
      default:
        throw new Error("Unknown char " + char);
    }
  });

  map.push(row);
});

function directionIcon(direction: Direction) {
  const [x, y] = direction;
  if (x === 0 && y === -1) return "^";
  if (x === 1 && y === 0) return ">";
  if (x === 0 && y === 1) return "v";
  if (x === -1 && y === 0) return "<";
  return "?";
}

function printMap(markers: Set<SerializedVec2D>) {
  //   const end: Vec2D = [lines[lines.length - 1].length - 2, lines.length - 1];
  map.forEach((row, y) => {
    let line = "";
    row.forEach((node, x) => {
      //   if (x === end[0] && y === end[1]) {
      //     line += "X";
      //     return;
      //   }
      if (markers.has(serializedVec2D([x, y]))) {
        line += "$";
        return;
      }
      if (node.blocked) {
        line += "#";
      } else if (node.directions.length === 0) {
        line += ".";
      } else if (node.directions.length === 1) {
        line += directionIcon(node.directions[0]);
      } else {
        line += node.directions.length;
      }
    });
    console.log(line);
  });
}

function isPositionOutsideMap(position: Vec2D) {
  const [x, y] = position;
  return x < 0 || y < 0 || x >= map[0].length || y >= map.length;
}

function isPositionBlocked(position: Vec2D) {
  const [x, y] = position;
  return isPositionOutsideMap([x, y]) || map[y][x].blocked || map[y][x].directions.length > 0;
}

function blizzard() {
  const newMap: Node[][] = map.map((row, y) => {
    return row.map((node, x) => {
      if (node.blocked) return { directions: [], blocked: true };
      return { directions: [] };
    });
  });
  map.forEach((row, y) => {
    row.forEach((node, x) => {
      node.directions.forEach((direction) => {
        const [dx, dy] = direction;
        const [nx, ny] = [x + dx, y + dy];
        if (isPositionOutsideMap([nx, ny])) return;

        if (map[ny][nx].blocked) {
          if (dx === 1) {
            newMap[y][1].directions.push([1, 0]);
          } else if (dx === -1) {
            newMap[y][newMap[0].length - 2].directions.push([-1, 0]);
          } else if (dy === 1) {
            newMap[1][x].directions.push([0, 1]);
          } else if (dy === -1) {
            newMap[newMap.length - 2][x].directions.push([0, -1]);
          }
          return;
        }
        newMap[ny][nx].directions.push(direction);
      });
    });
  });
  map = newMap;
}

const start: Vec2D = [1, 0];
const end: Vec2D = [lines[lines.length - 1].length - 2, lines.length - 1];

// printMap();
// for (let i = 0; i < 18; i++) {
//   console.log("Blizzard", i);
//   blizzard();
//   printMap();
// }

const directions = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
] satisfies Vec2D[];

let minute = 0;
// const possiblePaths: Vec2D[][] = [[start]];
const traversed: Set<SerializedVec2D> = new Set();
traversed.add(serializedVec2D(start));
while (true) {
  blizzard();

  const newlyTraversed: SerializedVec2D[] = [];
  traversed.forEach((serialized) => {
    const [x, y] = vec2D(serialized);
    if (isPositionBlocked([x, y])) {
      traversed.delete(serialized);
    }
    directions.forEach((direction) => {
      const [dx, dy] = direction;
      const [nx, ny] = [x + dx, y + dy];
      if (isPositionBlocked([nx, ny])) return;
      if (nx === end[0] && ny === end[1]) {
        console.log("Found end in", minute + 1);
        process.exit(0);
      }
      newlyTraversed.push(serializedVec2D([nx, ny]));
    });
  });
  newlyTraversed.forEach((serialized) => traversed.add(serialized));
  if (minute === 4) {
    printMap(new Set(newlyTraversed));
  }
  minute++;
}
