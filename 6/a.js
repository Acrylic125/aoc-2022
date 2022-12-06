const fs = require("fs");

(async () => {
  const data = await fs.promises.readFile("data.txt", "utf8");
  const lines = data.split("\n");

  const dataStream = lines[0];

  // const uniqueChars = new Set();
  // const markers = new Set();
  const streamChars = dataStream.split("");

  console.log(dataStream);
  var s = 0;
  // Find the first unique character after the first 4 characters.
  for (let i = 4; i < streamChars.length; i++) {
    // const char = streamChars[i];
    const prevChars = streamChars.slice(i - 4, i);
    const uniqueChars = new Set(prevChars);
    if (uniqueChars.size === 4) {
      console.log(i);
      return;
    }

    // markers.add(char);
    // uniqueChars.add(char);

    // console.log(`${s} ${markers.size}: ${char}}`);
    // if (markers.size > 4) {
    //   console.log(s - 1);
    //   return;
    // }
  }
  // for (const char of streamChars) {
  //   s++;
  //   if (uniqueChars.size > 4) {
  //     console.log(s);
  //     return;
  //   }
  //   uniqueChars.add(char);
  //   console.log(uniqueChars);
  // }
})();
