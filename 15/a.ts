import fs from "fs";

const data = await fs.promises.readFile("data.txt", "utf8");
const lines = data.split("\n");
const yBound = 2000000;

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

function decodeHashedPos(hashedPos: HashedPos): Pos {
  const [x, y] = hashedPos.split(",").map((n) => parseInt(n, 10));
  return [x, y];
}

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

function isPositionWithinSesnor(sensor: Sensor, pos: Pos) {
  const [sensorX, sensorY] = sensor.pos;
  const [x, y] = pos;

  return Math.abs(sensorX - x) + Math.abs(sensorY - y) <= sensor.radiusToNearestBeacon;
}

const accountedForSensors: Set<HashedPos> = new Set();

let count = 0;
function shouldCount(pos: Pos) {
  return pos[1] === yBound;
}

// const unocuppiedByBeaconsAndSensors: Set<HashedPos> = new Set();

function isPosOccupiedOrScanned(pos: Pos): boolean {
  if (beacons.has(hashPos(pos)) || sensors.has(hashPos(pos))) {
    return true;
  }
  for (const sHashed of accountedForSensors) {
    const sensor = sensorMap.get(sHashed)!;
    if (isPositionWithinSesnor(sensor, pos)) {
      return true;
    }
  }
}

function diamondScan(sesnor: Pos, nearestBeacon: Pos) {
  const [sensorX, sensorY] = sesnor;
  const [beaconX, beaconY] = nearestBeacon;

  const r = Math.abs(sensorX - beaconX) + Math.abs(sensorY - beaconY);
  const debug = hashPos([sensorX, sensorY]) === hashPos([0, 11]);
  // if (debug) {
  //   console.log(r);
  // }

  // Scan in a diamond
  for (let x = -r; x <= r; x++) {
    const posX = Math.abs(x);

    // if (debug) {
    //   console.log(x, r - posX);
    // }
    const nX = sensorX + x;
    let [minY, maxY] = [sensorY - (r - posX), sensorY + r - posX];
    minY = Math.max(minY, yBound);
    maxY = Math.min(maxY, yBound);

    for (let nY = minY; nY <= maxY; nY++) {
      if (isPosOccupiedOrScanned([nX, nY])) continue;
      // console.log(nX, nY);

      // unocuppiedByBeaconsAndSensors.add(hashPos([nX, nY]));
      if (shouldCount([nX, nY])) {
        count++;
      }
    }
    // for (let y = -(r - posX); y <= r - posX; y++) {
    //   const [nX, nY] = [sensorX + x, sensorY + y];
    //   if (isPosOccupiedOrScanned([nX, nY])) continue;
    //   // console.log(nX, nY);

    //   // unocuppiedByBeaconsAndSensors.add(hashPos([nX, nY]));
    //   if (shouldCount([nX, nY])) {
    //     count++;
    //   }
    // }
  }
}

for (const [sensor, beacon] of beaconSensorPairs) {
  diamondScan(sensor, beacon);
  accountedForSensors.add(hashPos(sensor));
}

// let c = 0;
// for (const u of unocuppiedByBeaconsAndSensors) {
//   const [x, y] = decodeHashedPos(u);

//   // if (y === 2000000) {
//   //   c++;
//   // }
//   if (y === 10) {
//     c++;
//   }
// }

console.log(count);

// console.log(beacons);
// console.log(sensors);
