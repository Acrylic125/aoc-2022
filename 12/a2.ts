import fs from "fs";
import { start } from "repl";

function getHeightFromChar(c: string): number {
  // Convert the character to a number
  let remappedChar = c;
  if (c === "S") remappedChar = "a";
  if (c === "E") remappedChar = "z";
  return remappedChar.charCodeAt(0) - 96;
}

const data = await fs.promises.readFile("test.txt", "utf8");
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
  const heightDifference = to - from;
  return heightDifference <= 1;
}

const DIRECTIONS = {
  up: [0, 1],
  down: [0, -1],
  left: [-1, 0],
  right: [1, 0],
};

type Direction = keyof typeof DIRECTIONS;

function canClimbInDirection(pos: number[], direction: Direction) {
  //   console.log(pos, direction);
  const [x, y] = pos;
  const [dx, dy] = DIRECTIONS[direction];
  const [nx, ny] = [x + dx, y + dy];

  if (nx < 0 || nx >= grid.length) return false;
  if (ny < 0 || ny >= grid[0].length) return false;

  return canClimb(grid[x][y], grid[nx][ny]);
}

function hashPos(pos: [number, number]): string {
  return pos.join(",");
}

let open = [
  {
    id: hashPos([startPos[0], startPos[0]]),
    pos: startPos,
    parent: null,
    stepsFromStart: 0,
  },
];
const closed = new Set<string>();
let i = 0;
c: while (true) {
  const currentObj = open
    .map(({ id, pos, stepsFromStart, parent }) => {
      const hCost = Math.sqrt(Math.pow(pos[0] - endPos[0], 2) + Math.pow(pos[1] - endPos[1], 2));
      const gCost = Math.sqrt(Math.pow(pos[0] - startPos[0], 2) + Math.pow(pos[1] - startPos[1], 2));
      return { id, pos, hCost, gCost, score: hCost + gCost, stepsFromStart, parent: parent };
    })
    .sort((a, b) => {
      // if (a.stepsFromStart < b.stepsFromStart) return -1;
      // if (a.stepsFromStart > b.stepsFromStart) return 1;
      if (a.score < b.score) return 1;
      if (a.score > b.score) return -1;
      return 0;
    })
    .map((n) => {
      return { id: n.id, pos: n.pos, stepsFromStart: n.stepsFromStart, parent: n.parent };
    })
    .pop();

  // console.log(open);
  // console.log(closed);
  // console.log(current);
  if (!currentObj) break;

  const current = currentObj.pos;
  if (i === 5) {
    console.log("Current: ", current, "Steps: ", currentObj.stepsFromStart);
    console.log("Open: ", open.length);
  }
  open = open.filter((n) => n.id !== currentObj.id);
  if (i === 5) {
    console.log(open);
    console.log("Open: ", open.length);
  }
  closed.add(hashPos([current[0], current[1]]));

  const traversibleDirections = Object.keys(DIRECTIONS).filter((d) => canClimbInDirection(current, d as Direction));

  for (const direction of traversibleDirections) {
    const [x, y] = current;
    const [dx, dy] = DIRECTIONS[direction];
    const [nx, ny] = [x + dx, y + dy];
    if (nx === endPos[0] && ny === endPos[1]) {
      let steps = 0;

      while (currentObj.parent) {
        steps++;
        console.log(lines[currentObj.parent.pos[0]][currentObj.parent.pos[1]]);
        currentObj.parent = currentObj.parent.parent;
      }

      console.log("Found with steps: ", steps);
      break c;
    }
    if (closed.has(hashPos([nx, ny]))) {
      continue;
    }
    open.push({
      id: hashPos([nx, ny]),
      pos: [nx, ny],
      stepsFromStart: currentObj.stepsFromStart + 1,
      parent: currentObj,
    });
  }
  i++;
}

let found = 0;

console.log(found);
