import fs from "fs";

type Type = "open" | "wall";
type Node = {
  type: Type;
};

const data = await fs.promises.readFile("data.txt", "utf8");
const [mapLines, instructionLine] = data.split("\n\n");

const mapLinesSplit = mapLines.split("\n");
const mapXSize = mapLinesSplit[0].length;
const map: Node[][] = [];

let firstUnfilled: [number, number] = null;
mapLinesSplit.forEach((line, y) => {
  const row: Node[] = Array.from({ length: mapXSize });
  line.split("").forEach((char, x) => {
    if (char === " ") return;
    firstUnfilled = firstUnfilled ?? [x, y];
    row[x] = {
      type: char === "#" ? "wall" : "open",
    };
  });
  map.push(row);
});

const instructions = [];
let curNum = "";
instructionLine.split("").forEach((char) => {
  if (char === " ") return;

  const parseNum = parseInt(char, 10);
  if (isNaN(parseNum)) {
    // console.log("num", parseNum);
    if (curNum !== "") instructions.push(parseInt(curNum, 10));
    curNum = "";
    instructions.push(char);
  } else {
    curNum += char;
  }
});
if (curNum !== "") instructions.push(parseInt(curNum, 10));

function isPositionOutOfBounds(position: [number, number]) {
  const [x, y] = position;
  return map[y] === undefined || map[y][x] === undefined || x < 0 || y < 0 || x >= mapXSize || y >= map.length;
}

function isPositionBlocked(position: [number, number]) {
  const [x, y] = position;
  return map[y][x].type === "wall";
}

function getOutOfBoundsNewPosition(position: [number, number], direction: [number, number]) {
  let i = 1;
  const [x, y] = position;
  const [dx, dy] = direction;
  while (true) {
    const [nX, nY] = [x + -i * dx, y + -i * dy];
    const [previousX, previousY] = [x + -(i - 1) * dx, y + -(i - 1) * dy];
    if (isPositionOutOfBounds([nX, nY])) {
      return [previousX, previousY];
    }

    i++;
  }
}

const walked: Map<string, string> = new Map();

function hashPosition(position: [number, number]) {
  const [x, y] = position;
  return `${x},${y}`;
}

function getDirectionSymbol(direction: [number, number]) {
  const [dx, dy] = direction;
  if (dx === 1 && dy === 0) return ">";
  if (dx === -1 && dy === 0) return "<";
  if (dx === 0 && dy === 1) return "v";
  if (dx === 0 && dy === -1) return "^";
}

function getDirectionScore(direction: [number, number]) {
  const symbol = getDirectionSymbol(direction);
  if (symbol === ">") return 0;
  if (symbol === "v") return 1;
  if (symbol === "<") return 2;
  if (symbol === "^") return 3;
}

function printMap() {
  map.forEach((row, y) => {
    let rowStr = "";
    row.forEach((node, x) => {
      const hash = hashPosition([x, y]);
      if (walked.has(hash)) {
        rowStr += walked.get(hash);
        return;
      }
      if (node === undefined) {
        rowStr += " ";
        return;
      }
      rowStr += node.type === "open" ? "." : "#";
    });
    console.log(rowStr);
  });
}

let direction: [number, number] = [1, 0];
let currentPosition = firstUnfilled;
printMap();

for (let i = 0; i < instructions.length; i++) {
  const instruction = instructions[i];
  if (typeof instruction === "number") {
    const n = instruction;
    for (let j = 0; j < n; j++) {
      const [x, y] = currentPosition;
      const [dx, dy] = direction;
      const [nX, nY] = [x + dx, y + dy];
      //   if (i <= 1) {
      //     console.log(`Current position: ${x}, ${y} ${map[nY][nX]}`);
      //   }
      if (isPositionOutOfBounds([nX, nY])) {
        if (i <= 1) console.log(`Out of bounds at ${nX}, ${nY} ${j}`);
        const [newX, newY] = getOutOfBoundsNewPosition(currentPosition, direction);
        currentPosition = [newX, newY];
        walked.set(hashPosition(currentPosition), getDirectionSymbol(direction));
      } else if (!isPositionBlocked([nX, nY])) {
        currentPosition = [nX, nY];
        walked.set(hashPosition(currentPosition), getDirectionSymbol(direction));
      } else {
        break;
      }
    }
    // console.log(`Current position ${i}: ${currentPosition} ${direction}`);
  } else if (typeof instruction === "string") {
    if (instruction === "L") {
      direction = [direction[1], -direction[0]];
    } else if (instruction === "R") {
      direction = [-direction[1], direction[0]];
    } else {
      throw new Error("Unknown instruction, " + instruction);
    }
  } else {
    throw new Error("Unknown instruction, " + instruction);
  }
}

console.log(currentPosition);
console.log((currentPosition[1] + 1) * 1000 + (currentPosition[0] + 1) * 4 + getDirectionScore(direction));

// printMap();
// console.log(instructions[instructions.length - 2]);
