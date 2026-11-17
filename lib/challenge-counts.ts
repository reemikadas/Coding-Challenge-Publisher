const CHALLENGE_FOLDERS = [
  "HackerRank_SQL_Challenges",
  "DataLemur_SQL_Challenges",
  "LeetCode_SQL_Challenges",
  "StrataScratch_SQL_Challenges",
  "HackerRank_Python_Challenges",
  "DataLemur_Python_Challenges",
  "LeetCode_Python_Challenges",
  "StrataScratch_Python_Challenges",
] as const;

const COUNT_BLOCK = /<!-- challenge-counts:start -->.*?<!-- challenge-counts:end -->/gs;

function countMarkdownFiles(paths: string[], folder: string) {
  const prefix = `${folder}/`;
  return paths.filter((path) => {
    if (!path.startsWith(prefix) || !path.endsWith(".md")) return false;
    return !path.slice(prefix.length).includes("/");
  }).length;
}

export function isTrackedChallengePath(path: string) {
  return CHALLENGE_FOLDERS.some((folder) => {
    const prefix = `${folder}/`;
    return path.startsWith(prefix) && path.endsWith(".md") && !path.slice(prefix.length).includes("/");
  });
}

export function hasChallengeCountTable(readme: string) {
  return readme.includes("<!-- challenge-counts:start -->") && readme.includes("<!-- challenge-counts:end -->");
}

export function buildChallengeCountTable(paths: string[]) {
  const hackerRankSql = countMarkdownFiles(paths, "HackerRank_SQL_Challenges");
  const dataLemurSql = countMarkdownFiles(paths, "DataLemur_SQL_Challenges");
  const leetCodeSql = countMarkdownFiles(paths, "LeetCode_SQL_Challenges");
  const strataScratchSql = countMarkdownFiles(paths, "StrataScratch_SQL_Challenges");
  const hackerRankPython = countMarkdownFiles(paths, "HackerRank_Python_Challenges");
  const dataLemurPython = countMarkdownFiles(paths, "DataLemur_Python_Challenges");
  const leetCodePython = countMarkdownFiles(paths, "LeetCode_Python_Challenges");
  const strataScratchPython = countMarkdownFiles(paths, "StrataScratch_Python_Challenges");
  const sqlTotal = hackerRankSql + dataLemurSql + leetCodeSql + strataScratchSql;
  const pythonTotal = hackerRankPython + dataLemurPython + leetCodePython + strataScratchPython;

  return `<!-- challenge-counts:start -->
|  | HackerRank | DataLemur | LeetCode | StrataScratch | Total Challenges Solved |
| --- | ---: | ---: | ---: | ---: | ---: |
| SQL | ${hackerRankSql} | ${dataLemurSql} | ${leetCodeSql} | ${strataScratchSql} | ${sqlTotal} |
| Python | ${hackerRankPython} | ${dataLemurPython} | ${leetCodePython} | ${strataScratchPython} | ${pythonTotal} |
| **Total** | **${hackerRankSql + hackerRankPython}** | **${dataLemurSql + dataLemurPython}** | **${leetCodeSql + leetCodePython}** | **${strataScratchSql + strataScratchPython}** | **${sqlTotal + pythonTotal}** |
<!-- challenge-counts:end -->`;
}

export function updateChallengeCountTable(readme: string, paths: string[]) {
  const matches = readme.match(COUNT_BLOCK);
  if (matches?.length !== 1) {
    throw new Error("README challenge-count markers are missing or duplicated.");
  }
  return readme.replace(COUNT_BLOCK, buildChallengeCountTable(paths));
}
