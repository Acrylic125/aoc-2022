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

function getAllChars(itemStr) {
  // Return all chars in itemStr
  return itemStr.split("");
}

(async () => {
  const data = await fs.promises.readFile("data.txt", "utf8");
  const lines = data.split("\n");

  let total = 0;
  lines.forEach((line) => {
    if (line === "") return;
    const [itemStr1, itemStr2] = splitRucksack(line);
    const intersectingChars = findIntersectingChars(itemStr1, itemStr2);
    var a = 0;
    intersectingChars.forEach((char) => {
      const priority = getPriority(char);
      a += priority;
    });

    total += a;
  });

  console.log(total);
})();
