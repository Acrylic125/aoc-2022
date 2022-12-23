import fs from "fs";

type Vec2D = [number, number];
const directions: Vec2D[] = [
  [0, -1], // North
  [1, -1], // North-East
  [1, 0], // East
  [1, 1], // South-East
  [0, 1], // South
  [-1, 1], // South-West
  [-1, 0], // West
  [-1, -1], // North-West
];
type HashedVec2D = string;
const checkDirectionIndices = [0, 4, 6, 2];
const checkDirections: Vec2D[][] = [];

checkDirectionIndices.forEach((checkIndex) => {
  const leftIndex = checkIndex - 1;
  const leftDirection = directions[leftIndex < 0 ? directions.length + leftIndex : leftIndex];
  const direction = directions[checkIndex];
  const rightDirection = directions[(checkIndex + 1) % directions.length];
  checkDirections.push([leftDirection, direction, rightDirection]);
});

function hashPosition(position: Vec2D): HashedVec2D {
  const [x, y] = position;
  return `${x},${y}`;
}
function parsePosition(position: HashedVec2D): Vec2D {
  const [x, y] = position.split(",").map((n) => parseInt(n, 10));
  return [x, y];
}
const elvePositions: Set<HashedVec2D> = new Set();

function printElvePositions(a: number = 0, b: number = 16) {
  for (let y = a; y < b; y++) {
    let line = "";
    for (let x = a; x < b; x++) {
      if (elvePositions.has(hashPosition([x, y]))) {
        line += "#";
      } else {
        line += ".";
      }
    }
    console.log(line);
  }
}

const data = await fs.promises.readFile("data.txt", "utf8");
const lines = data.split("\n");
lines.forEach((line, y) => {
  if (line === "") return;
  line.split("").forEach((char, x) => {
    if (char === "#") elvePositions.add(hashPosition([x, y]));
  });
});

// console.log("Initial");
// printElvePositions();

const rounds = 100000;
for (let round = 0; round < rounds; round++) {
  const proposedPositions = new Set<HashedVec2D>();
  // <Hashed New Position, Old Position>
  const newFromOldMap = new Map<HashedVec2D, Vec2D>();

  elvePositions.forEach((hashedPosition) => {
    const [x, y] = parsePosition(hashedPosition);

    let hasElfInNeighbour = false;
    for (const direction of directions) {
      if (elvePositions.has(hashPosition([x + direction[0], y + direction[1]]))) {
        hasElfInNeighbour = true;
        break;
      }
    }
    if (!hasElfInNeighbour) {
      return;
    }

    let proposedPosition = null;

    for (let i = round % checkDirections.length; i < (round % checkDirections.length) + checkDirections.length; i++) {
      const checkDirection = checkDirections[i % checkDirections.length];
      const d1 = checkDirection[0];
      const d2 = checkDirection[1];
      const d3 = checkDirection[2];
      //   console.log(`Index: ${checkIndex}, Left: ${leftDirection}, Direction: ${direction}, Right: ${rightDirection}`);

      if (elvePositions.has(hashPosition([x + d1[0], y + d1[1]]))) continue;
      if (elvePositions.has(hashPosition([x + d2[0], y + d2[1]]))) continue;
      if (elvePositions.has(hashPosition([x + d3[0], y + d3[1]]))) continue;

      proposedPosition = [x + d2[0], y + d2[1]];
      break;
    }

    if (proposedPosition === null) {
      return;
    }

    const proposedPositionHashed = hashPosition(proposedPosition);
    if (proposedPositions.has(proposedPositionHashed)) {
      newFromOldMap.delete(proposedPositionHashed);
      return;
    }
    proposedPositions.add(proposedPositionHashed);
    newFromOldMap.set(proposedPositionHashed, [x, y]);
  });

  newFromOldMap.forEach((oldPosition, hashedNewPosition) => {
    elvePositions.delete(hashPosition(oldPosition));
    elvePositions.add(hashedNewPosition);
  });

  if (newFromOldMap.size === 0) {
    console.log(`No changes after ${round + 1} rounds`);
    break;
  }

  //   console.log(`Round ${round + 1}`);
  //   printElvePositions();
}

let minX = 1000000,
  maxX = -1000000,
  minY = 1000000,
  maxY = -1000000;

elvePositions.forEach((hashedPosition) => {
  const [x, y] = parsePosition(hashedPosition);
  minX = Math.min(minX, x);
  maxX = Math.max(maxX, x);
  minY = Math.min(minY, y);
  maxY = Math.max(maxY, y);
});

// console.log(minX, maxX, minY, maxY);
const area = (maxX - minX + 1) * (maxY - minY + 1);
console.log(area - elvePositions.size);
