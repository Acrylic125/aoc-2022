const fs = require("fs");

const cycleAdd = [20, 60, 100, 140, 180, 220];
const instructionCycles = {
  addx: 2,
  noop: 1,
};

(async () => {
  const data = await fs.promises.readFile("data.txt", "utf8");
  const lines = data.split("\n");

  var curCycles = 0;
  var totalX = [];
  var registerX = 1;

  var c = 0;

  lines.forEach((l) => {
    if (l === "") return;
    const [instruction, _x] = l.split(" ");

    const x = parseInt(_x);
    const cycles = instructionCycles[instruction];
    // console.log(instruction, x);

    for (let i = 0; i < cycles; i++) {
      curCycles++;

      if (cycleAdd.includes(curCycles)) {
        totalX.push(registerX * curCycles);
        console.log(curCycles, c, registerX, totalX);
        c = 0;
        // cycleSetTotalX = 0;
      }
      if (instruction === "addx") {
        if (i === instructionCycles.addx - 1) {
          console.log("add " + curCycles + " " + x);
          registerX += x;
          c += x;
        }
      }
    }
  });

  console.log(totalX);
  const t = totalX.reduce((a, b) => a + b, 0);
  console.log(t);
})();
