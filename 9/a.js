const fs = require("fs");

const directions = {
  U: [0, 1],
  D: [0, -1],
  L: [-1, 0],
  R: [1, 0],
};

(async () => {
  const data = await fs.promises.readFile("data.txt", "utf8");
  const lines = data.split("\n");

  /** @type {number[][]} */
  const tracked = [];

  function addToTrackedIfUnique(position) {
    if (tracked.some((p) => p[0] === position[0] && p[1] === position[1])) {
      return;
    }
    tracked.push(position);
  }

  var tailPosition = [0, 0];
  var headPosition = [0, 0];

  for (const line of lines) {
    if (line === "") continue;
    const [instruction, _steps] = line.split(" ");
    const steps = parseInt(_steps, 10);

    const [dx, dy] = directions[instruction];
    for (let i = 0; i < steps; i++) {
      const oldHeadPosition = [headPosition[0], headPosition[1]];
      headPosition = [oldHeadPosition[0] + dx, oldHeadPosition[1] + dy];

      // If head position is 2 up, 2 right, 2 left, or 2 down, move tailPosition by 1 in that direction.

      const distanceX = headPosition[0] - tailPosition[0];
      const distanceY = headPosition[1] - tailPosition[1];

      const absX = Math.abs(distanceX);
      const absY = Math.abs(distanceY);

      const canMoveDiagonally = (absX > 1 && absY > 0) || (absX > 0 && absY > 1);

      if ((absX >= 2 && absY === 0) || (absX === 0 && absY >= 2) || canMoveDiagonally) {
        if (canMoveDiagonally) {
          // tailPosition = [tailPosition[0] - (absX === 0 ? 0 : distanceX / absX), tailPosition[1] - (absY === 0 ? 0 : distanceY / absY)];
          console.log(absX === 0 ? 0 : distanceX / absX, absY === 0 ? 0 : distanceY / absY);
          // tailPosition = [tailPosition[0] + dx, tailPosition[1] + dy];
        }
        tailPosition = [tailPosition[0] + (absX === 0 ? 0 : distanceX / absX), tailPosition[1] + (absY === 0 ? 0 : distanceY / absY)];
      }

      // if (absX >= 2 && absY === 0) {
      //   tailPosition = [tailPosition[0] + distanceX / absX, tailPosition[1]];
      //   // tailPosition = [oldHeadPosition[0], oldHeadPosition[1]];
      // } else if (absX === 0 && absY >= 2) {
      //   tailPosition = [tailPosition[0], tailPosition[1] + distanceY / absY];
      //   // tailPosition = [oldHeadPosition[0], oldHeadPosition[1]];
      // } else if (
      //   // head and tail arent in the same row or column
      //   absX > 0 &&
      //   absY > 0
      // ) {
      //   // tailPosition = [oldHeadPosition[0], oldHeadPosition[1]];
      //   tailPosition = [tailPosition[0] + distanceX / absX, tailPosition[1] + distanceY / absY];
      // }

      console.log(instruction, headPosition, tailPosition);
      // // Check i
      // if (

      // ) {
      //   tailPosition = [tailPosition[0] + dx, tailPosition[1] + dy];
      // }

      addToTrackedIfUnique(tailPosition);
    }
  }

  // tracked.forEach((t) => {
  //   console.log(t);
  // });

  console.log(
    tracked.map((pos) => {
      return [pos[0] + 1, pos[1] + 1];
    })
  );

  console.log(tracked.length);
})();
