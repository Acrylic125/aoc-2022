import fs from "fs";

type MonkeyIndex = number;

type Monkey = {
  inspection: number;
  divisor: number;
  items: number[];
  operator: (old: number) => number;
  test: (old: number) => boolean;
  onTestPass: () => MonkeyIndex;
  onTestFail: () => MonkeyIndex;
};

function parseMonkey(lines: string[]): Monkey {
  const itemsLine = lines[1];
  const operationLine = lines[2];
  const testLine = lines[3];
  const onTestPassLine = lines[4];
  const onTestFailLine = lines[5];

  const items = itemsLine
    .split(": ")[1]
    .split(", ")
    .map((x) => parseInt(x, 10));
  const operation = operationLine.split(" = ")[1];

  var divisor = 1;
  var operationFn = (num: number) => num;
  if (operation.includes(" * ")) {
    operationFn = (num) => {
      var val = parseInt(operation.split(" * ")[1]);
      if (isNaN(val)) {
        val = num;
      }
      divisor = val;
      return num * val;
    };
  } else if (operation.includes(" + ")) {
    operationFn = (num) => {
      var val = parseInt(operation.split(" + ")[1]);
      if (isNaN(val)) {
        val = num;
      }
      divisor = val;
      return num + val;
    };
  }

  const divisorTest = parseInt(testLine.split(" ")[5]);
  const divisorPass = parseInt(onTestPassLine.split(" ")[9]);
  const divisorFail = parseInt(onTestFailLine.split(" ")[9]);

  return {
    inspection: 0,
    divisor: divisorTest,
    items,
    operator: operationFn,
    test: (num) => num % divisorTest === 0,
    onTestPass: () => divisorPass,
    onTestFail: () => divisorFail,
  };
}

const data = await fs.promises.readFile("data.txt", "utf8");
const lines = data.split("\n");

const monkeys: Monkey[] = [];

var currentMonkeyLines = [];
for (let i = 0; i < lines.length; i++) {
  if ((i + 1) % 7 === 0) {
    monkeys.push(parseMonkey(currentMonkeyLines));
    currentMonkeyLines = [];
  } else {
    currentMonkeyLines.push(lines[i]);
  }
}

// const turns = 20 * monkeys.length;
// console.log(turns);

var totalDivisor = monkeys.reduce((acc, monkey) => acc * monkey.divisor, 1);
const rounds = 10000;
for (let round = 0; round < rounds; round++) {
  for (let monkeyIndex = 0; monkeyIndex < monkeys.length; monkeyIndex++) {
    const currentMonkey = monkeys[monkeyIndex];

    while (currentMonkey.items.length > 0) {
      const currentItem = currentMonkey.items[0];
      currentMonkey.items = currentMonkey.items.slice(1);
      // if (currentItem === undefined || isNaN(currentItem)) {
      //   continue;
      // }

      const newItemWorry = currentMonkey.operator(currentItem) % totalDivisor;

      var throwToMonkeyIndex: number = 0;
      var passed = false;
      if (currentMonkey.test(newItemWorry)) {
        passed = true;
        throwToMonkeyIndex = currentMonkey.onTestPass();
      } else {
        throwToMonkeyIndex = currentMonkey.onTestFail();
      }

      currentMonkey.inspection += 1;

      monkeys[throwToMonkeyIndex].items.push(newItemWorry);
      // if ((currentMonkeyIndex + 1) % monkeys.length === 0) {
      // if (monkeyIndex < monkeys.length) {
      //   console.log(
      //     `Turn #${monkeyIndex} Round ${
      //       Math.floor(monkeyIndex / monkeys.length) + 1
      //     } Monkey ${currentMonkeyIndex} threw ${newItemWorry} (${currentItem}) Monkey ${throwToMonkeyIndex} got ${newItemWorry} Test ${
      //       passed ? "passed" : "failed"
      //     }`
      //   );
      //   showMonkeyItems();
      // }
    }
  }

  if ((round + 1) % 1000 === 0 || round === 0 || round === 19) {
    console.log(monkeys.map((x) => x.inspection).join(", "));
  }
}

// for (let turn = 0; turn < turns; turn++) {
//   var currentMonkeyIndex = turn % monkeys.length;
//   const currentMonkey = monkeys[currentMonkeyIndex];
//   const currentItem = currentMonkey.items[0];
//   currentMonkey.items = currentMonkey.items.slice(1);

//   if (currentItem === undefined || isNaN(currentItem)) {
//     continue;
//   }

//   const newItemWorry = Math.floor(currentMonkey.operator(currentItem) / 3);

//   var throwToMonkeyIndex: number = 0;
//   var passed = false;
//   if (currentMonkey.test(newItemWorry)) {
//     passed = true;
//     throwToMonkeyIndex = currentMonkey.onTestPass();
//   } else {
//     throwToMonkeyIndex = currentMonkey.onTestFail();
//   }

//   monkeys[throwToMonkeyIndex].items.push(newItemWorry);
//   // if ((currentMonkeyIndex + 1) % monkeys.length === 0) {
//   if (turn < turns) {
//     console.log(
//       `Turn #${turn} Round ${
//         Math.floor(turn / monkeys.length) + 1
//       } Monkey ${currentMonkeyIndex} threw ${newItemWorry} (${currentItem}) Monkey ${throwToMonkeyIndex} got ${newItemWorry} Test ${
//         passed ? "passed" : "failed"
//       }`
//     );
//     showMonkeyItems();
//   }
// }

// const top2 = monkeys
//   .map((x) => x.items)
//   .flat()
//   .sort((a, b) => b - a)
//   .slice(0, 2);

function showMonkeyItems() {
  console.log(monkeys.map((m) => m.items));
}
showMonkeyItems();
const monkeyInspections = monkeys.map((m) => m.inspection).sort((a, b) => b - a);
console.log(monkeyInspections[0] * monkeyInspections[1]);

// console.log(monkeys.map((x) => x.items.reduce((a, b) => a + b, 0)));
