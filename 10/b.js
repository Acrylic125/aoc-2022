const fs = require("fs");

const cycleAdd = [41, 81, 121, 161, 201, 241].map((t) => t - 1);
const instructionCycles = {
  addx: 2,
  noop: 1,
};

(async () => {
  const data = await fs.promises.readFile("data.txt", "utf8");
  const lines = data.split("\n");

  var cycleCount = 0;
  const grid = [];
  grid.push(new Array(40).fill("."));
  var registerX = 1;
  var row = 0;
  var crtPointer = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    const [instruction, _x] = line.split(" ");
    var x = parseInt(_x);

    const requiredCycles = instructionCycles[instruction];

    // loop through cycles
    for (let i = 0; i < requiredCycles; i++) {
      cycleCount++;

      if ((cycleCount - 1) % 40 === 0) {
        console.log("New row");
        row++;
        grid.push(new Array(40).fill("."));
        crtPointer = 0;
      }

      const currentGridRow = grid[row];
      const rowCrtPointer = crtPointer % 40;

      // Draw
      const newRowRegisterX = registerX % 40;
      const shouldPaint = crtPointer === newRowRegisterX || crtPointer === newRowRegisterX - 1 || crtPointer === newRowRegisterX + 1;
      if (shouldPaint) {
        currentGridRow[rowCrtPointer] = "#";
      }

      // Add
      if (i === instructionCycles.addx - 1) {
        registerX += x;
      }
      crtPointer++;
    }
  }

  grid.forEach((row) => {
    console.log(row.join(""));
  });

  // const result = [];
  // var cur = new Array(40).fill(".");

  // /** @type {string[][]} */
  // const tapes = new Array(6).fill(new Array(40).fill("."));

  // var row = 0;
  // var c = 0;
  // var drawingX = 0;
  // const printThreshold = 40;

  // lines.forEach((l) => {
  //   if (l === "") return;
  //   const [instruction, _x] = l.split(" ");

  //   const x = parseInt(_x);
  //   const cycles = instructionCycles[instruction];
  //   // console.log(instruction, x);

  //   if (curCycles <= printThreshold) console.log("Start cycle " + (curCycles + 1) + " Begin executing " + instruction + " " + x);
  //   for (let i = 0; i < cycles; i++) {
  //     curCycles++;

  //     if (curCycles <= printThreshold) console.log("During cycle  " + curCycles + ": CRT draws pixel in position " + drawingX);

  //     for (let dx = -1; dx < 2; dx++) {
  //       const drawAtX = registerX + dx;
  //       if (drawAtX === drawingX && drawAtX >= 0 && drawAtX < 6 * 40) {
  //         console.log(curCycles, row, " drawAtX", drawAtX, drawingX);
  //         tapes[row][drawAtX] = "#";
  //         cur[drawAtX] = "#";
  //         break;
  //       }
  //     }
  //     if (curCycles <= printThreshold) console.log("Current CRT row: " + tapes[row].join("").slice(0, 40));

  //     if (instruction === "addx") {
  //       if (i === instructionCycles.addx - 1) {
  //         if (curCycles <= printThreshold) console.log("finish executing addx " + x);
  //         // drawOffset = -1;
  //         registerX += x;
  //         c += x;
  //       }
  //     }

  //     if (cycleAdd.includes(curCycles)) {
  //       // totalX.push(registerX * curCycles);
  //       // console.log(curCycles, c, registerX, totalX);
  //       // c = 0;
  //       registerX = 1;
  //       drawingX = 0;
  //       // console.log("" + cur.join("").slice(0, 40));
  //       result.push(cur.join(""));
  //       console.log("GGGGG " + row);

  //       row++;
  //       cur = new Array(40).fill(".");
  //       // cycleSetTotalX = 0;
  //     }
  //     // drawOffset++;

  //     if (curCycles <= printThreshold) console.log("");

  //     drawingX++;
  //   }
  // });

  // curCycles++;

  // // if (cycleAdd.includes(curCycles)) {
  // //   // totalX.push(registerX * curCycles);
  // //   // console.log(curCycles, c, registerX, totalX);
  // //   // c = 0;
  // //   // registerX = 1;
  // //   // drawingX = 0;
  // //   // console.log("" + cur.join("").slice(0, 40));
  // //   result.push(cur.join(""));
  // //   console.log("GGGGG " + row);

  // //   row++;
  // //   cur = new Array(40).fill(".");
  // //   // cycleSetTotalX = 0;
  // // }
  // console.log(curCycles);

  // result.forEach((t) => {
  //   console.log(t);
  // });

  // console.log(totalX);
  // const t = totalX.reduce((a, b) => a + b, 0);
  // console.log(t);
})();
