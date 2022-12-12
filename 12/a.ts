import fs from "fs";
import { start } from "repl";

function getHeightFromChar(c: string): number {
  // Convert the character to a number
  let remappedChar = c;
  if (c === "S") remappedChar = "a";
  if (c === "E") remappedChar = "z";
  return remappedChar.charCodeAt(0) - 96;
}

const data = await fs.promises.readFile("data.txt", "utf8");
const lines = data.split("\n");

const grid: number[][] = [];

const startPos = [0, 0];
const endPos = [0, 0];

for (let row = 0; row < lines.length; row++) {
  const line = lines[row];
  if (line === "") continue;
  grid.push(
    line.split("").map((h, col) => {
      if (h === "S") {
        startPos[0] = row;
        startPos[1] = col;
      } else if (h === "E") {
        endPos[0] = row;
        endPos[1] = col;
      }

      return getHeightFromChar(h);
    })
  );
}

function canClimb(from: number, to: number): boolean {
  const delta = from - to;
  return delta <= 1;
}

const DIRECTIONS = {
  up: [0, 1],
  down: [0, -1],
  left: [-1, 0],
  right: [1, 0],
};

function canClimbInDirection(pos: number[], direction: string) {
  //   console.log(pos, direction);
  const [x, y] = pos;
  const [dx, dy] = DIRECTIONS[direction];
  const [nx, ny] = [x + dx, y + dy];

  if (nx < 0 || nx >= grid.length) return false;
  if (ny < 0 || ny >= grid[0].length) return false;

  return canClimb(grid[x][y], grid[nx][ny]);
}

let found = 0;

function scanNeighbours(pos: number[], checked: Set<string>, stepsMem: Map<string, number>, level = 0): number | null {
  const [x, y] = pos;

  if (x === startPos[0] && y === startPos[1]) {
    found++;
    return 0;
  }

  const canClimbNeighbours = Object.keys(DIRECTIONS).filter((d) => canClimbInDirection(pos, d));

  const neighbourStepsToEnd = canClimbNeighbours
    .map((n) => {
      const [dx, dy] = DIRECTIONS[n];
      const [nx, ny] = [x + dx, y + dy];

      return [nx, ny];
    })
    .filter((n) => !checked.has(n.join(",")))
    .map((n) => {
      const key = n.join(",");
      const memValueKey = stepsMem.get(key);

      if (!(startPos[0] === n[0] && startPos[1] === n[1])) {
        checked.add(key);
      }

      if (memValueKey === null) return null;
      if (memValueKey !== undefined) return memValueKey;

      if (level <= 10000) {
        // console.log("Checking ", level, n, " char ", lines[n[0]][n[1]]);
      }
      const steps = scanNeighbours(n, new Set([...checked]), stepsMem, level + 1);
      if (steps !== null) {
        const newSteps = steps + 1;
        stepsMem.set(key, newSteps);
        return newSteps;
      } else {
        stepsMem.set(key, null);
      }
      return null;
    })
    .filter((n) => n !== null);

  if (neighbourStepsToEnd.length === 0) return null;

  console.log("Neighbours", neighbourStepsToEnd);
  const lowest = Math.min(...neighbourStepsToEnd);
  return lowest;
}

console.log(scanNeighbours(endPos, new Set(), new Map()));
console.log(found);
