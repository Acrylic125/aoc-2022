const fs = require("fs");

function splitRucksack(itemStr) {
  // Return 2 halves of the item string
  return [itemStr.slice(0, itemStr.length / 2), itemStr.slice(itemStr.length / 2)];
}

function isCapital(char) {
  // Return if char is capital
  return char === char.toUpperCase();
}

function isLower(char) {
  // Return if char is lower
  return char === char.toLowerCase();
}

function getPriority(itemStr) {
  // Return char as ascii int
  return isCapital(itemStr[0]) ? itemStr.charCodeAt(0) - 38 : itemStr.charCodeAt(0) - 96;
}

function containsChar(itemStr, char) {
  // Return if itemStr contains char
  return itemStr.includes(char);
}

function findIntersectingChars(itemStr1, itemStr2) {
  // Return intersecting chars
  const intersectingChars = new Set();
  for (let i = 0; i < itemStr1.length; i++) {
    if (containsChar(itemStr2, itemStr1[i])) intersectingChars.add(itemStr1[i]);
  }
  return intersectingChars;
}

function findIntersectingCharsOfAll(itemStrs = []) {
  const intersectingChars = new Set();

  console.log(itemStrs);
  const target = itemStrs[0].split("");
  target.forEach((char) => {
    if (itemStrs[1].split("").includes(char) && itemStrs[2].split("").includes(char)) intersectingChars.add(char);
  });

  console.log(intersectingChars);
  return intersectingChars;
}

function getAllChars(itemStr) {
  // Return all chars in itemStr
  return itemStr.split("");
}

(async () => {
  const data = await fs.promises.readFile("data.txt", "utf8");
  const lines = data.split("\n");

  let collect = [];
  let badges = [];
  let index = 1;
  lines.forEach((line) => {
    if (line === "") return;
    // const [itemStr1, itemStr2] = splitRucksack(line);
    // const intersectingChars = findIntersectingChars(itemStr1, itemStr2);

    collect.push(line);
    if (index === 3) {
      // console.log(findIntersectingCharsOfAll(collect));
      console.log("Reset");
      console.log(collect);
      index = 1;
      findIntersectingCharsOfAll(collect).forEach((char) => badges.push(char));
      collect = [];
    } else {
      index++;
    }
  });

  let total = 0;
  badges.forEach((char) => {
    const priority = getPriority(char);
    total += priority;
  });

  console.log(total);
})();
