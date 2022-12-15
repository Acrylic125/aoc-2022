import fs from "fs";

const data = await fs.promises.readFile("data.txt", "utf8");
const lines = data.split("\n");
// const yBound = 10;
const bounds = [0, 4_000_000];
// const bounds = [0, 20];

type Pos = [number, number];
type HashedPos = string;
type Sensor = {
  pos: Pos;
  nearestBeacon: Pos;
  radiusToNearestBeacon: number;
};

function hashPos(pos: Pos): HashedPos {
  return `${pos[0]},${pos[1]}`;
}

// function decodeHashedPos(hashedPos: HashedPos): Pos {
//   const [x, y] = hashedPos.split(",").map((n) => parseInt(n, 10));
//   return [x, y];
// }

const beacons: Set<HashedPos> = new Set();
const sensors: Set<HashedPos> = new Set();
const sensorMap: Map<HashedPos, Sensor> = new Map();

const beaconSensorPairs: [Pos, Pos][] = [];

for (const line of lines) {
  if (line === "") continue;
  // 193758, 2220950, 652350, 2000000
  let nLine = line.replace("Sensor at x=", "").replace(": closest beacon is at x=", ", ").replace("y=", "").replace("y=", "");

  const [sensorX, sensorY, beaconX, beaconY] = nLine.split(", ").map((n) => parseInt(n, 10));

  sensors.add(hashPos([sensorX, sensorY]));
  beacons.add(hashPos([beaconX, beaconY]));
  sensorMap.set(hashPos([sensorX, sensorY]), {
    pos: [sensorX, sensorY],
    nearestBeacon: [beaconX, beaconY],
    radiusToNearestBeacon: Math.abs(sensorX - beaconX) + Math.abs(sensorY - beaconY),
  });
  beaconSensorPairs.push([
    [sensorX, sensorY],
    [beaconX, beaconY],
  ]);
}

const sensorMapValues = [...sensorMap.values()];

function isPositionWithinSesnor(sensor: Sensor, pos: Pos) {
  const [sensorX, sensorY] = sensor.pos;
  const [x, y] = pos;

  return Math.abs(sensorX - x) + Math.abs(sensorY - y) <= sensor.radiusToNearestBeacon;
}

function isWithinBounds(pos: Pos) {
  const [x, y] = pos;
  return x >= bounds[0] && x <= bounds[1] && y >= bounds[0] && y <= bounds[1];
}

// const accountedForSensors: Set<HashedPos> = new Set();
// const possiblePositions: Set<HashedPos> = new Set();

// let count = 0;
// function shouldCount(pos: Pos) {
//   return pos[1] === yBound;
// }

const possibilities: Set<Pos> = new Set();
let found = false;

// Clever optimization : https://www.reddit.com/r/adventofcode/comments/zmcn64/comment/j0ags92/?utm_source=share&utm_medium=web2x&context=3
function diamondScan(sesnor: Pos, nearestBeacon: Pos) {
  console.log("Scanning", sesnor, "nearest beacon is", nearestBeacon);
  if (found) return;
  const [sensorX, sensorY] = sesnor;
  const [beaconX, beaconY] = nearestBeacon;

  const r = Math.abs(sensorX - beaconX) + Math.abs(sensorY - beaconY) + 1;
  const debug = hashPos([sensorX, sensorY]) === hashPos([8, 7]);
  // if (debug) {
  //   console.log(r);
  // }

  // Scan in a diamond
  for (let x = -r; x <= r; x++) {
    const posX = Math.abs(x);

    const nX = sensorX + x;
    let [minY, maxY] = [sensorY - (r - posX), sensorY + r - posX];
    minY = Math.max(minY, bounds[0]);
    maxY = Math.min(maxY, bounds[1]);

    b: for (let nY = minY; nY <= maxY; nY += maxY - minY + 1) {
      const pos: Pos = [nX, nY];
      if (!isWithinBounds(pos) || isPosOccupiedOrScanned(pos)) continue;

      for (const s of sensorMapValues) {
        if (isPositionWithinSesnor(s, pos)) {
          continue b;
        }
      }
      console.log("Found one", pos, "frequency is:", pos[0] * 4000000 + pos[1]);
      found = true;
      return;
    }
  }
}

// const unocuppiedByBeaconsAndSensors: Set<HashedPos> = new Set();

function isPosOccupiedOrScanned(pos: Pos): boolean {
  if (beacons.has(hashPos(pos)) || sensors.has(hashPos(pos))) {
    return true;
  }
  return false;
  // for (const sHashed of accountedForSensors) {
  //   const sensor = sensorMap.get(sHashed)!;
  //   if (isPositionWithinSesnor(sensor, pos)) {
  //     return true;
  //   }
  // }
}

function calcRadius(pos: Pos, pos2: Pos) {
  const [x, y] = pos;
  const [bX, bY] = pos2;
  return Math.abs(x - bX) + Math.abs(y - bY);
}

for (const [sensor, beacon] of beaconSensorPairs) {
  diamondScan(sensor, beacon);
}

// main: for (let x = bounds[0]; x <= bounds[1]; x++) {
//   c: for (let y = bounds[0]; y <= bounds[1]; y++) {
//     const pos: Pos = [x, y];
//     for (const sensor of sensorMap.values()) {
//       if (isPositionWithinSesnor(sensor, pos)) {
//         continue c;
//       }
//     }
//     console.log(pos[0] * 4000000 + pos[1]);
//     break main;
//   }
// }

// for (const [sensor, beacon] of beaconSensorPairs) {
//   diamondScan(sensor, beacon);
//   accountedForSensors.add(hashPos(sensor));
// }

// console.log(count);

// main: for (const possibility of possibilities) {
//   if (!isWithinBounds(possibility)) continue;
//   for (const s of sensorMapValues) {
//     if (isPositionWithinSesnor(s, possibility)) {
//       continue main;
//     }
//   }
//   console.log("Found one", possibility, "frequency is:", possibility[0] * 4000000 + possibility[1]);
//   break;
// }
