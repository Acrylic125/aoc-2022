import fs from "fs";

const data = await fs.promises.readFile("data.txt", "utf8");
const lines = data.split("\n");

type Pos = [number, number, number];
type Direction = "up" | "down" | "left" | "right" | "front" | "back";
type Cube = {
  pos: Pos;
  exposedFaces: number;
  exposedDirections: Set<Direction>;
};
type HashedPos = string;

function oppDirection(direction: Direction): Direction {
  switch (direction) {
    case "up":
      return "down";
    case "down":
      return "up";
    case "left":
      return "right";
    case "right":
      return "left";
    case "front":
      return "back";
    case "back":
      return "front";
  }
}

function getDirectionFromVector(vector: Pos): Direction {
  const [x, y, z] = vector;
  if (x === 0 && y === 0 && z === 1) return "front";
  if (x === 0 && y === 0 && z === -1) return "back";
  if (x === 0 && y === 1 && z === 0) return "up";
  if (x === 0 && y === -1 && z === 0) return "down";
  if (x === 1 && y === 0 && z === 0) return "right";
  if (x === -1 && y === 0 && z === 0) return "left";
  throw new Error("Invalid direction vector");
}

function getDirectionVector(direction: Direction): Pos {
  switch (direction) {
    case "up":
      return [0, 1, 0];
    case "down":
      return [0, -1, 0];
    case "left":
      return [-1, 0, 0];
    case "right":
      return [1, 0, 0];
    case "front":
      return [0, 0, 1];
    case "back":
      return [0, 0, -1];
  }
}

const adjacentDirections: {
  vector: Pos;
  direction: Direction;
}[] = [
  {
    vector: [-1, 0, 0],
    direction: "left",
  }, // left
  {
    vector: [1, 0, 0],
    direction: "right",
  }, // right
  {
    vector: [0, 0, 1],
    direction: "front",
  }, // front
  {
    vector: [0, 0, -1],
    direction: "back",
  }, // back
  {
    vector: [0, 1, 0],
    direction: "up",
  }, // up
  {
    vector: [0, -1, 0],
    direction: "down",
  }, // down
];

function hashPos(pos: [number, number, number]): HashedPos {
  return pos.join(",");
}

const cubeMap = new Map<HashedPos, Cube>();

let minX = 0;
let maxX = 0;
let minY = 0;
let maxY = 0;
let minZ = 0;
let maxZ = 0;

lines.forEach((line) => {
  if (line === "") return;
  const [x, y, z] = line.split(",").map((n) => parseInt(n, 10));

  const cube: Cube = {
    pos: [x, y, z],
    exposedFaces: 6,
    exposedDirections: new Set(["up", "down", "left", "right", "front", "back"]),
  };

  minX = Math.min(minX, x);
  maxX = Math.max(maxX, x);
  minY = Math.min(minY, y);
  maxY = Math.max(maxY, y);
  minZ = Math.min(minZ, z);
  maxZ = Math.max(maxZ, z);

  // Scan adjacent cubes
  adjacentDirections.forEach((direction) => {
    const _direction = direction.direction;
    const _oppDirection = oppDirection(_direction);

    const [dx, dy, dz] = direction.vector;
    const adjacentPos: Pos = [x + dx, y + dy, z + dz];
    // console.log("Checking adjacent cube", adjacentPos, direction);
    const adjacentHash = hashPos(adjacentPos);
    const adjacentCube = cubeMap.get(adjacentHash);

    if (adjacentCube) {
      //   console.log("Found adjacent cube", adjacentCube);
      cube.exposedFaces = cube.exposedFaces - 1;
      cube.exposedDirections.delete(_direction);

      adjacentCube.exposedFaces = adjacentCube.exposedFaces - 1;
      adjacentCube.exposedDirections.delete(_oppDirection);
    }
  });
  cubeMap.set(hashPos(cube.pos), cube);
  //   console.log(cube);
});

let exposedFaces = 0;
cubeMap.forEach((cube) => {
  exposedFaces += cube.exposedFaces;
});

console.log(minX, maxX);
console.log(minY, maxY);
console.log(minZ, maxZ);

minX = minX - 1;
maxX = maxX + 1;
minY = minY - 1;
maxY = maxY + 1;
minZ = minZ - 1;
maxZ = maxZ + 1;

const floodedMap = new Map<HashedPos, Pos>();

const floodPositions: Pos[] = [[minX, minY, minZ]];

while (floodPositions.length > 0) {
  const pos = floodPositions.pop();
  //   console.log("Flood", pos);
  const hash = hashPos(pos);
  if (floodedMap.has(hash)) continue;
  floodedMap.set(hash, pos);

  adjacentDirections.forEach((direction) => {
    const [dx, dy, dz] = direction.vector;
    const adjacentPos: Pos = [pos[0] + dx, pos[1] + dy, pos[2] + dz];
    if (
      adjacentPos[0] < minX ||
      adjacentPos[0] > maxX ||
      adjacentPos[1] < minY ||
      adjacentPos[1] > maxY ||
      adjacentPos[2] < minZ ||
      adjacentPos[2] > maxZ
    ) {
      return;
    }

    const adjacentHash = hashPos(adjacentPos);
    const adjacentCube = cubeMap.get(adjacentHash);
    if (!adjacentCube) {
      floodPositions.push(adjacentPos);
    }
  });
}

let tallyExposedFaces = 0;
floodedMap.forEach((pos) => {
  adjacentDirections.forEach((direction) => {
    const [dx, dy, dz] = direction.vector;
    const adjacentPos: Pos = [pos[0] + dx, pos[1] + dy, pos[2] + dz];
    const hash = hashPos(adjacentPos);

    const cube = cubeMap.get(hash);
    if (cube) {
      tallyExposedFaces += 1;
    }
  });
});

console.log(tallyExposedFaces);

// console.log(floodedMap.size);

// for (let x = minX; x <= maxX; x++) {
//   for (let y = minY; y <= maxY; y++) {
//     for (let z = minZ; z <= maxZ; z++) {
//       const cube = cubeMap.get(hashPos([x, y, z]));
//       if (!cube) {
//         process.stdout.write(" ");
//       } else {
//         process.stdout.write(cube.exposedFaces.toString());
//       }
//     }
//   }
// }
