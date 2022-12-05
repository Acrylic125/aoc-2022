const fs = require("fs");

/**
 *
 * @param {string[]} lines
 */
function parseMap(lines = []) {
  // const rowsCols = [];
  // for (const line of lines) {
  //   const rows = [];
  //   for (let i = 1; i < 40; i += 4) {
  //     rows.push(line.charAt(i));
  //   }
  //   rowsCols.push(rows);
  // }

  const colsRows = [];
  for (let i = 0; i < 9; i++) {
    const cols = [];
    for (const line of lines) {
      const d = line.charAt(i * 4 + 1);
      if (d === " ") continue;
      cols.push(d);
    }
    cols.reverse();
    colsRows.push(cols);
  }

  return colsRows;
}

function parseInstruction(instruction) {
  const splitInstructions = instruction.split(" ");
  return {
    number: parseInt(splitInstructions[1]),
    fromCol: parseInt(splitInstructions[3]),
    toCol: parseInt(splitInstructions[5]),
  };
}

(async () => {
  const data = await fs.promises.readFile("test.txt", "utf8");
  const lines = data.split("\n");

  // Loop through first 8 lines
  const unparsedMap = [];
  for (let i = 0; i < 8; i++) {
    const line = lines[i];
    unparsedMap.push(line);
  }

  const instructions = [];
  // Start from line 11, loop through to end of file
  for (let i = 10; i < lines.length - 1; i++) {
    const line = lines[i];
    instructions.push(parseInstruction(line));
  }

  console.log(instructions[0]);
  const colsRows = parseMap(unparsedMap);

  for (const instruction of instructions) {
    const { number, fromCol, toCol } = instruction;
    for (let i = 0; i < number; i++) {
      const col = colsRows[fromCol - 1];
      if (col === undefined) continue;
      const lastItemFromCol = col.pop();
      // Move last item from col to toCol
      colsRows[toCol - 1].push(lastItemFromCol);
    }
  }

  let s = "";
  // join up all the last elements of cols
  for (const col of colsRows) {
    s += col[col.length - 1];
  }

  console.log(s);
})();
