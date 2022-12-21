import fs from "fs";

type Monkey = {
  id: string;
  operator: (a: number, b: number) => number;
  reliesOn: string[];
};

type ResolvedMonkey = {
  id: string;
  val: number;
};

const data = await fs.promises.readFile("data.txt", "utf8");
const lines = data.split("\n");

const unresolved: Map<string, Monkey> = new Map();
const resolved: Map<string, ResolvedMonkey> = new Map();

lines.forEach((line) => {
  if (line === "") return;
  const splitLine = line.split(" ");
  const id = splitLine[0].replace(":", "");
  if (splitLine.length === 2) {
    const val = parseInt(splitLine[1], 10);
    if (isNaN(val)) throw new Error("Not a number, " + val);
    resolved.set(id, {
      id,
      val,
    });
  } else if (splitLine.length === 4) {
    let operator = null;

    const operatorStr = splitLine[2];
    switch (operatorStr) {
      case "+":
        operator = (a: number, b: number) => a + b;
        break;
      case "*":
        operator = (a: number, b: number) => a * b;
        break;
      case "-":
        operator = (a: number, b: number) => a - b;
        break;
      case "/":
        operator = (a: number, b: number) => a / b;
        break;
      default:
        throw new Error("Unknown operator, " + operatorStr);
    }

    unresolved.set(id, {
      id,
      operator,
      reliesOn: [splitLine[1], splitLine[3]],
    });
  } else {
    console.log("Unknown line length", line);
  }
});

const root = unresolved.get("root");

function findResult(monkey: Monkey): number {
  if (resolved.has(monkey.id)) {
    return resolved.get(monkey.id).val;
  }

  const a = resolved.get(monkey.reliesOn[0])?.val ?? findResult(unresolved.get(monkey.reliesOn[0]));
  const b = resolved.get(monkey.reliesOn[1])?.val ?? findResult(unresolved.get(monkey.reliesOn[1]));
  const result = monkey.operator(a, b);
  resolved.set(monkey.id, {
    id: monkey.id,
    val: result,
  });
  return result;
}

console.log("root", findResult(root));
