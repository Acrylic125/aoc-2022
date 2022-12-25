import fs from "fs";

const data = await fs.promises.readFile("data.txt", "utf8");
const lines = data.split("\n");

const Symbols = {
  "2": 2,
  "1": 1,
  "0": 0,
  "-": -1,
  "=": -2,
};

let totalScore = 0;
lines.forEach((line) => {
  if (line === "") return;

  let score = 0;
  line
    .split("")
    .reverse()
    .forEach((char, i) => {
      score += Symbols[char] * 5 ** i;
    });
  totalScore += score;
});

function snafu(num: number) {
  const remainder = num % 5;
  if (num === 0) return "";

  switch (remainder) {
    case 0:
      return snafu(Math.floor(num / 5)) + "0";
    case 1:
      return snafu(Math.floor(num / 5)) + "1";
    case 2:
      return snafu(Math.floor(num / 5)) + "2";
    case 3:
      return snafu(Math.floor((num + 2) / 5)) + "=";
    case 4:
      return snafu(Math.floor((num + 1) / 5)) + "-";
  }
  throw new Error("Unknown remainder " + remainder);
}

console.log(totalScore);
console.log(snafu(totalScore));
