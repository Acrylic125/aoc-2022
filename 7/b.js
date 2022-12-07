const fs = require("fs");

(async () => {
  const data = await fs.promises.readFile("data.txt", "utf8");
  const lines = data.split("\n");

  var curDirectory = [];
  // var directorySizes = [];
  // var alreadyAdded = [];
  const directories = new Map();
  const alreadyAddedDirectories = new Map();

  var sumLessThanOrEqual100K = 0;

  function cdOut() {
    const cd = curDirectory.join("/");

    // const currentFolderSize = directorySizes[directorySizes.length - 1];
    const currentFolderSize = directories.get(cd);
    const alreadyAdded = alreadyAddedDirectories.get(cd);
    if (!alreadyAdded && currentFolderSize <= 100000) {
      // console.log(cd + " adding " + currentFolderSize);
      sumLessThanOrEqual100K += currentFolderSize;
      alreadyAddedDirectories.set(cd, true);
    } else {
      // console.log(cd + " " + currentFolderSize);
    }
    curDirectory.pop();

    // const cur = directorySizes.pop();
    const newCd = curDirectory.join("/");
    directories.set(newCd, directories.get(newCd) + directories.get(cd));
    // directorySizes[directorySizes.length - 1] += cur;
  }

  lines.forEach((line) => {
    const [first, second, third] = line.split(" ");

    if (first === "") {
      cdOut();
      return;
    }

    if (first === "$") {
      if (second === "cd") {
        if (third === "..") {
          cdOut();
        } else {
          curDirectory.push(third);

          const cd = curDirectory.join("/");

          directories.set(cd, 0);
          alreadyAddedDirectories.set(cd, false);
        }
      }

      return;
    }

    const fileSize = parseInt(first);

    if (!isNaN(fileSize)) {
      const cd = curDirectory.join("/");
      directories.set(cd, directories.get(cd) + fileSize);
      // directorySizes[directorySizes.length - 1] += fileSize;
    }
  });

  // Loop through the rest of the directories and cd out.
  while (curDirectory.length > 0) {
    cdOut();
  }

  let min300kLowest = 1003039393939399;
  const rootSize = directories.get("/");
  console.log(rootSize);
  const min = 70000000 - rootSize;

  directories.forEach((value, key) => {
    // console.log(key + " " + value);
    if (value >= 30000000 - min) {
      console.log(key + " " + value);
      if (value < min300kLowest) {
        min300kLowest = value;
      }
    }
  });

  console.log(min300kLowest);
  // console.log(sumLessThanOrEqual100K);
})();
