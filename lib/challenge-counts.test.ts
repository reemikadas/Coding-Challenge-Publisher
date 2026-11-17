import assert from "node:assert/strict";
import test from "node:test";
import {
  buildChallengeCountTable,
  hasChallengeCountTable,
  isTrackedChallengePath,
  updateChallengeCountTable,
} from "./challenge-counts.ts";

const paths = [
  "HackerRank_SQL_Challenges/1_First.md",
  "HackerRank_SQL_Challenges/2_Second.md",
  "DataLemur_SQL_Challenges/3_Third.md",
  "LeetCode_Python_Challenges/4_Fourth.md",
  "StrataScratch_SQL_Challenges/5_Fifth.md",
  "StrataScratch_SQL_Challenges/nested/ignored.md",
  "StrataScratch_SQL_Challenges/notes.txt",
];

test("builds totals from tracked top-level Markdown files", () => {
  const table = buildChallengeCountTable(paths);
  assert.match(table, /\| SQL \| 2 \| 1 \| 0 \| 1 \| 4 \|/);
  assert.match(table, /\| Python \| 0 \| 0 \| 1 \| 0 \| 1 \|/);
  assert.match(table, /\| \*\*Total\*\* \| \*\*2\*\* \| \*\*1\*\* \| \*\*1\*\* \| \*\*1\*\* \| \*\*5\*\* \|/);
});

test("replaces one stale README count block", () => {
  const stale = `Before\n<!-- challenge-counts:start -->\nstale\n<!-- challenge-counts:end -->\nAfter`;
  const updated = updateChallengeCountTable(stale, paths);
  assert.match(updated, /Before\n<!-- challenge-counts:start -->/);
  assert.match(updated, /\*\*5\*\*/);
  assert.match(updated, /<!-- challenge-counts:end -->\nAfter/);
});

test("rejects missing or duplicated marker blocks", () => {
  assert.throws(() => updateChallengeCountTable("No table", paths), /missing or duplicated/);
  const block = "<!-- challenge-counts:start -->x<!-- challenge-counts:end -->";
  assert.throws(() => updateChallengeCountTable(`${block}\n${block}`, paths), /missing or duplicated/);
});

test("recognizes only direct Markdown files in tracked folders", () => {
  assert.equal(isTrackedChallengePath("StrataScratch_SQL_Challenges/10285_Title.md"), true);
  assert.equal(isTrackedChallengePath("StrataScratch_SQL_Challenges/nested/10285_Title.md"), false);
  assert.equal(isTrackedChallengePath("Custom/10285_Title.md"), false);
  assert.equal(hasChallengeCountTable("<!-- challenge-counts:start --><!-- challenge-counts:end -->"), true);
});
