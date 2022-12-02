const fs = require("fs");

const selfScoreMap = {
  X: 1,
  Y: 2,
  Z: 3,
};

const selfOutcomeMap = {
  X: "lose",
  Y: "draw",
  Z: "win",
};

function getRPSOutcome(self, opp) {
  if ((self === "X" && opp === "C") || (self === "Y" && opp === "A") || (self === "Z" && opp === "B")) return "win";
  if ((self === "X" && opp === "A") || (self === "Y" && opp === "B") || (self === "Z" && opp === "C")) return "draw";
  return "lose";
}

function getRPS(opp, outcome) {
  if (opp === "A") {
    if (outcome === "win") return "Y";
    if (outcome === "draw") return "X";
    return "Z";
  }
  if (opp === "B") {
    if (outcome === "win") return "Z";
    if (outcome === "draw") return "Y";
    return "X";
  }
  if (opp === "C") {
    if (outcome === "win") return "X";
    if (outcome === "draw") return "Z";
    return "Y";
  }
}

(async () => {
  const data = await fs.promises.readFile("data.txt", "utf8");
  const lines = data.split("\n");

  let score = 0;
  lines.forEach((line) => {
    if (line === "") return;
    const [opp, outcome] = line.split(" ");

    const selfOutcome = selfOutcomeMap[outcome];
    const self = getRPS(opp, selfOutcome);
    const selfScore = selfScoreMap[self];

    console.log(selfScore, selfOutcome, self);
    switch (selfOutcome) {
      case "win":
        score += 6 + selfScore;
        break;
      case "draw":
        score += 3 + selfScore;
        break;
      case "lose":
        score += 0 + selfScore;
        break;
      default:
        console.log("TTT");
    }
  });
  console.log(score);
})();
