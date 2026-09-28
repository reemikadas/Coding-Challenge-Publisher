import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const challengeFolders = ["HackerRank_Challenges", "DataLemur_Challenges"];
let changedFiles = 0;

for (const folder of challengeFolders) {
  const entries = await readdir(folder, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith(".md")) continue;
    const fileName = join(folder, entry.name);
    const current = await readFile(fileName, "utf8");
    const migrated = current
      .replace(/^## (SQL|Python) Solution[ \t]*$/gm, "## $1 Solution #1")
      .replace(/^(## (?:SQL|Python) Solution #\d+)\n(?=(?:~~~|```))/gm, "$1\n\n");
    if (migrated === current) continue;
    await writeFile(fileName, migrated, "utf8");
    changedFiles += 1;
  }
}

console.log(`Updated ${changedFiles} Markdown file${changedFiles === 1 ? "" : "s"}.`);
