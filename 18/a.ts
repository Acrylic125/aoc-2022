import fs from "fs";

const data = await fs.promises.readFile("data.txt", "utf8");
const lines = data.split("\n");

type Pos = [number, number, number];
type Cube = {
  pos: Pos;
  exposedFaces: number;
};
type HashedPos = string;

const adjacentDirections: Pos[] = [
  [-1, 0, 0],
  [1, 0, 0],
  [0, 0, 1],
  [0, 0, -1],
  [0, 1, 0],
  [0, -1, 0],
];

function hashPos(pos: [number, number, number]): HashedPos {
  return pos.join(",");
}

const cubeMap = new Map<HashedPos, Cube>();

lines.forEach((line) => {
  if (line === "") return;
  const [x, y, z] = line.split(",").map((n) => parseInt(n, 10));

  const cube: Cube = {
    pos: [x, y, z],
    exposedFaces: 6,
  };

  // Scan adjacent cubes
  adjacentDirections.forEach((direction) => {
    const [dx, dy, dz] = direction;
    const adjacentPos: Pos = [x + dx, y + dy, z + dz];
    // console.log("Checking adjacent cube", adjacentPos, direction);
    const adjacentHash = hashPos(adjacentPos);
    const adjacentCube = cubeMap.get(adjacentHash);

    if (adjacentCube) {
      //   console.log("Found adjacent cube", adjacentCube);
      cube.exposedFaces = cube.exposedFaces - 1;
      adjacentCube.exposedFaces = adjacentCube.exposedFaces - 1;
    }
  });
  cubeMap.set(hashPos(cube.pos), cube);
  console.log(cube);
});

let exposedFaces = 0;
cubeMap.forEach((cube) => {
  exposedFaces += cube.exposedFaces;
});

console.log(exposedFaces);
