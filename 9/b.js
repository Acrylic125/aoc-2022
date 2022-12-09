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

  // var tailPosition = [0, 0];
  // var headPosition = [0, 0];

  var knots = [];
  for (let i = 0; i < 10; i++) {
    knots.push([0, 0]);
  }

  for (const line of lines) {
    if (line === "") continue;
    const [instruction, _steps] = line.split(" ");
    const steps = parseInt(_steps, 10);

    const [dx, dy] = directions[instruction];
    for (let i = 0; i < steps; i++) {
      var headPosition = knots[0];

      // console.log(knots);

      const oldHeadPosition = [headPosition[0], headPosition[1]];
      headPosition = [oldHeadPosition[0] + dx, oldHeadPosition[1] + dy];

      const unresolved = [];

      for (let i = 1; i < knots.length; i++) {
        const previous = knots[i];
        unresolved.push(previous);
      }

      knots = [headPosition, ...unresolved];
      // Insert new head position at front of knots.

      for (let i = 1; i < knots.length; i++) {
        const previous = knots[i - 1];
        const current = knots[i];

        const isTail = i === knots.length - 1;

        const distanceX = previous[0] - current[0];
        const distanceY = previous[1] - current[1];

        const absX = Math.abs(distanceX);
        const absY = Math.abs(distanceY);

        const canMoveDiagonally = (absX > 1 && absY > 0) || (absX > 0 && absY > 1);

        var newPosition = [current[0], current[1]];

        if ((absX >= 2 && absY === 0) || (absX === 0 && absY >= 2) || canMoveDiagonally) {
          newPosition = [current[0] + (absX === 0 ? 0 : distanceX / absX), current[1] + (absY === 0 ? 0 : distanceY / absY)];
        }

        knots[i] = newPosition;

        if (isTail) {
          console.log(instruction, newPosition);
          addToTrackedIfUnique(newPosition);
        }
      }

      // knots = [headPosition, ...knots];

      // const tailPosition = knots[knots.length - 1];
      // const beforeTailPosition = knots[knots.length - 2];

      // If head position is 2 up, 2 right, 2 left, or 2 down, move tailPosition by 1 in that direction.

      // console.log(instruction, beforeTailPosition, tailPosition);
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

      // console.log(instruction, headPosition, tailPosition);
      // // Check i
      // if (

      // ) {
      //   tailPosition = [tailPosition[0] + dx, tailPosition[1] + dy];
      // }
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
