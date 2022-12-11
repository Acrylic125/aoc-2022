import fs from "fs";

const data = await fs.promises.readFile("data.txt", "utf8");
const lines = data.split("\n");
