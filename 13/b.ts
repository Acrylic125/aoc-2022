import fs from "fs";

const data = await fs.promises.readFile("data.txt", "utf8");
const lines = data.split("\n");

const packetLines: string[] = [];
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line === "") {
    continue;
  }
  packetLines.push(line);
}

function parseListFromString(str: string): any[] {
  let collectStack: any[] = [[]];
  let numCollectStr = "";
  for (let i = 0; i < str.length; i++) {
    const char = str.charAt(i);
    const currentCollect = collectStack[collectStack.length - 1];

    if (char === "[") {
      const newCurrentCollect: number[] = [];
      collectStack.push(newCurrentCollect);
      currentCollect.push(newCurrentCollect);
      continue;
    }

    if ((char === "," || char === "]") && numCollectStr !== "") {
      const num = parseInt(numCollectStr);
      currentCollect.push(num);
      numCollectStr = "";
    }

    if (char === "]") {
      collectStack.pop();
      continue;
    }

    const asNum = parseInt(char);
    if (!isNaN(asNum)) {
      numCollectStr += char;
      continue;
    }
  }

  return collectStack;
}

function asArray(n: number | any[]): number[] {
  if (Array.isArray(n)) return n;
  return [n];
}

function comparePair(left: number | any[], right: number | any, debug: boolean): boolean | undefined {
  const isLeftArray = Array.isArray(left);
  const isRightArray = Array.isArray(right);

  let newLeft = left;
  let newRight = right;

  //   if (isLeftArray && !isRightArray) {
  //     newRight = [right];
  //   } else if (!isLeftArray && isRightArray) {
  //     newLeft = [left];
  //   }
  if (debug) console.log("Comparing", JSON.stringify(newLeft), JSON.stringify(newRight));

  if (Array.isArray(newLeft) && Array.isArray(newRight)) {
    // if (newLeft.length > newRight.length) return false;
    // if (newRight.length > newLeft.length) return true;

    let cursor = 0;
    while (true) {
      const leftItem = newLeft[cursor];
      const rightItem = newRight[cursor];
      if (leftItem === undefined && rightItem === undefined) return undefined;
      if (leftItem === undefined) return true;
      if (rightItem === undefined) return false;

      const comparison = comparePair(leftItem, rightItem, debug);
      if (comparison !== undefined) {
        return comparison;
      }
      cursor++;
    }
  } else if (typeof newLeft === "number" && typeof newRight === "number") {
    if (newLeft > newRight) return false;
    if (newRight > newLeft) return true;
    return undefined;
  } else {
    return comparePair(asArray(newLeft), asArray(newRight), debug);
  }
}

packetLines.push("[[2]]");
packetLines.push("[[6]]");

// let validPairs = 0;
const sorted = packetLines

  .map((p) => {
    return parseListFromString(p)[0];
  })
  .sort((a, b) => {
    const left = a;
    const right = b;
    const comparison = comparePair(left, right, false);
    if (comparison === undefined) {
      return 0;
    }
    if (comparison) {
      return -1;
    }
    return 1;
  });

// const first = sorted.findIndex((s) => {
//   console.log("Sorted", JSON.stringify(s));
//   return JSON.stringify(s) === "[[2]]";
// });
// console.log("First", first);

sorted.forEach((s, i) => {
  if (JSON.stringify(s) === "[[[2]]]") console.log("Found", i + 1);
  if (JSON.stringify(s) === "[[[6]]]") console.log("Found", i + 1);
  //   console.log("Sorted", i + 1, JSON.stringify(s));
});

// console.log(packetLines);
// for (let i = 0; i < packetLines.length; i++) {
//   const pair = packetLines[i];
//   const left = parseListFromString(pair[0])[0];
//   const right = parseListFromString(pair[1])[0];
//   console.log("Valid pair", JSON.stringify(left), JSON.stringify(right), comparePair(left, right, i === 1));
//   if (comparePair(left, right, false)) {
//     validPairs += i + 1;
//   }
// }

// console.log(validPairs);
