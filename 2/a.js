const fs = require("fs");

const selfScoreMap = {
  X: 1,
  Y: 2,
  Z: 3,
};

function getRPSOutcome(self, opp) {
  if ((self === "X" && opp === "C") || (self === "Y" && opp === "A") || (self === "Z" && opp === "B")) return "win";
  if ((self === "X" && opp === "A") || (self === "Y" && opp === "B") || (self === "Z" && opp === "C")) return "draw";
  return "lose";
}

(async () => {
  const data = await fs.promises.readFile("data.txt", "utf8");
  const lines = data.split("\n");

  let score = 0;
  lines.forEach((line) => {
    if (line === "") return;
    const [opp, self] = line.split(" ");
    const outcome = getRPSOutcome(self, opp);
    const selfScore = selfScoreMap[self];

    console.log(selfScore);
    switch (outcome) {
      case "win":
        score += 6 + selfScore;
        break;
      case "draw":
        score += 3 + selfScore;
        break;
      case "lose":
        score += 0 + selfScore;
        break;
    }
  });
  console.log(score);
})();
