"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Copy, Database, Download, ExternalLink, Eye, FileCode2, GitFork, Link2, Loader2, LockKeyhole, Plus, RotateCcw, Send, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Toaster } from "@/components/ui/sonner";

type ChallengeProvider = "" | "HackerRank" | "DataLemur" | "LeetCode";
type ChallengeLanguage = "SQL" | "Python";
type SolutionState = { id: number; language: ChallengeLanguage; runtime: string; code: string };
type FormState = { provider: ChallengeProvider; challengeNumber: string; challengeTitle: string; challengeUrl: string; question: string; solutions: SolutionState[]; repository: string; branch: string; directory: string; token: string; overwrite: boolean };
const DEFAULT_FOLDERS = ["HackerRank_SQL_Challenges", "DataLemur_SQL_Challenges", "LeetCode_SQL_Challenges", "HackerRank_Python_Challenges", "DataLemur_Python_Challenges", "LeetCode_Python_Challenges"];
const initialForm: FormState = { provider: "", challengeNumber: "", challengeTitle: "", challengeUrl: "", question: "", solutions: [{ id: 1, language: "SQL", runtime: "MySQL", code: "" }], repository: "", branch: "main", directory: "HackerRank_SQL_Challenges", token: "", overwrite: false };

function filenamePart(value: string) { return value.trim().replace(/[’']/g, "").replace(/[^a-zA-Z0-9]+/g, "_").replace(/^_+|_+$/g, ""); }
function filenameFor(challengeNumber: string, challengeTitle: string) { const number = filenamePart(challengeNumber); const title = filenamePart(challengeTitle); return number && title ? `${number}_${title}.md` : ""; }
function defaultFolder(provider: ChallengeProvider, language: ChallengeLanguage) { const platform = provider || "HackerRank"; return language === "Python" ? `${platform}_Python_Challenges` : `${platform}_SQL_Challenges`; }
function markdownFor(form: FormState) {
  const primaryLanguage = form.solutions[0]?.language || "SQL";
  const providerPrefix = form.provider === "DataLemur" || form.provider === "LeetCode" ? `${form.provider} ` : "";
  const heading = [form.challengeNumber && `${providerPrefix}Challenge ${form.challengeNumber}`, form.challengeTitle].filter(Boolean).join(": ") || `${primaryLanguage} Challenge`;
  const source = form.challengeUrl ? `\n**Source:** [View challenge](${form.challengeUrl})\n` : "";
  const solutionSections = form.solutions.map((solution, index) => {
    const number = ` #${index + 1}`;
    const fence = solution.language === "Python" ? "python" : "sql";
    const placeholder = solution.language === "Python" ? "# Your Python solution will appear here." : "-- Your SQL solution will appear here.";
    const metadata = solution.language === "Python" ? `Runtime: ${solution.runtime || "Python 3"}` : `Dialect: ${solution.runtime || "SQL"}`;
    return `## ${solution.language} Solution${number}\n\n~~~${fence}\n${solution.code.trim() || placeholder}\n~~~\n\n_${metadata}_`;
  }).join("\n\n");
  return `# ${heading}\n${source}\n## Challenge\n\n${form.question.trim() || "Your challenge question will appear here."}\n\n${solutionSections}\n`;
}
function FieldLabel({ id, children, optional = false }: { id: string; children: React.ReactNode; optional?: boolean }) { return <label htmlFor={id} className="field-label">{children}{optional && <span>Optional</span>}</label>; }

export default function Home() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isLoadingExisting, setIsLoadingExisting] = useState(false);
  const [imported, setImported] = useState(false);
  const [existingPath, setExistingPath] = useState("");
  const [existingFilename, setExistingFilename] = useState("");
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null);
  const primarySolution = form.solutions[0];
  const hasChallengeDraft = Boolean(form.challengeNumber.trim() || form.challengeTitle.trim() || form.challengeUrl.trim() || form.question.trim() || form.solutions.some((solution) => solution.code.trim()));
  const markdown = useMemo(() => hasChallengeDraft ? markdownFor(form) : "", [form, hasChallengeDraft]);
  const filename = existingFilename || filenameFor(form.challengeNumber, form.challengeTitle);
  const platformUrls = primarySolution.language === "Python"
    ? { HackerRank: "https://www.hackerrank.com/domains/python", DataLemur: "https://datalemur.com/questions?category=Python", LeetCode: "https://leetcode.com/problemset/" }
    : { HackerRank: "https://www.hackerrank.com/domains/sql", DataLemur: "https://datalemur.com/questions?category=SQL", LeetCode: "https://leetcode.com/problemset/database/" };

  useEffect(() => {
    const modelContext = (document as Document & { modelContext?: { registerTool?: (tool: unknown, options?: { signal?: AbortSignal }) => void | Promise<void> } }).modelContext;
    if (!modelContext?.registerTool) return;
    const lifecycle = new AbortController();
    const tool = {
      name: "stage_coding_challenge", title: "Stage coding challenge", description: "Fill the visible SQL or Python challenge editor so the user can review the generated Markdown before publishing.",
      inputSchema: { type: "object", properties: { challengeNumber: { type: "string" }, challengeTitle: { type: "string" }, challengeUrl: { type: "string" }, provider: { type: "string", enum: ["HackerRank", "DataLemur", "LeetCode"] }, language: { type: "string", enum: ["SQL", "Python"] }, question: { type: "string" }, solution: { type: "string" }, runtime: { type: "string" } }, required: ["challengeNumber", "challengeTitle", "language", "question", "solution"], additionalProperties: false },
      annotations: { readOnlyHint: false, untrustedContentHint: true },
      execute(input: unknown) {
        if (!input || typeof input !== "object") throw new Error("Challenge details are required.");
        const values = input as Record<string, unknown>;
        for (const key of ["challengeNumber", "challengeTitle", "language", "question", "solution"]) if (typeof values[key] !== "string" || !values[key]) throw new Error(`${key} is required.`);
        const provider = values.provider === "DataLemur" || values.provider === "HackerRank" || values.provider === "LeetCode" ? values.provider : "";
        const language: ChallengeLanguage = values.language === "Python" ? "Python" : "SQL";
        setForm((current) => ({ ...current, provider, challengeNumber: values.challengeNumber as string, challengeTitle: values.challengeTitle as string, challengeUrl: typeof values.challengeUrl === "string" ? values.challengeUrl : "", question: values.question as string, solutions: [{ id: 1, language, code: values.solution as string, runtime: typeof values.runtime === "string" && values.runtime ? values.runtime : language === "Python" ? "Python 3" : "MySQL" }], directory: defaultFolder(provider, language) }));
        setPublishedUrl(null);
        return { staged: true, filename: filenameFor(values.challengeNumber as string, values.challengeTitle as string) };
      },
    };
    try { void Promise.resolve(modelContext.registerTool(tool, { signal: lifecycle.signal })).catch(() => undefined); } catch { /* The visible form remains available without WebMCP. */ }
    return () => lifecycle.abort();
  }, []);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) { setForm((current) => ({ ...current, [key]: value })); setPublishedUrl(null); if (key === "challengeUrl") setImported(false); }
  function updateSolution(id: number, patch: Partial<SolutionState>) { setForm((current) => ({ ...current, solutions: current.solutions.map((solution) => solution.id === id ? { ...solution, ...patch } : solution) })); setPublishedUrl(null); }
  function changeSolutionLanguage(id: number, language: ChallengeLanguage) {
    setForm((current) => ({ ...current, solutions: current.solutions.map((solution) => solution.id === id ? { ...solution, language, runtime: language === "Python" ? "Python 3" : "MySQL" } : solution), directory: id === current.solutions[0]?.id && DEFAULT_FOLDERS.includes(current.directory) ? defaultFolder(current.provider, language) : current.directory }));
    setPublishedUrl(null);
  }
  function selectLanguage(language: ChallengeLanguage) { changeSolutionLanguage(primarySolution.id, language); setImported(false); }
  function addSolution() {
    setForm((current) => {
      const language: ChallengeLanguage = current.solutions.some((solution) => solution.language === "Python") ? "SQL" : "Python";
      const nextId = Math.max(...current.solutions.map((solution) => solution.id), 0) + 1;
      return { ...current, solutions: [...current.solutions, { id: nextId, language, runtime: language === "Python" ? "Python 3" : "MySQL", code: "" }] };
    });
    setPublishedUrl(null);
  }
  function removeSolution(id: number) { setForm((current) => ({ ...current, solutions: current.solutions.filter((solution) => solution.id !== id) })); setPublishedUrl(null); }
  async function loadExistingMarkdown() {
    if (!existingPath.trim()) return;
    setIsLoadingExisting(true);
    try {
      const response = await fetch("/api/load-markdown", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ repository: form.repository, branch: form.branch, path: existingPath, token: form.token }) });
      const result = (await response.json()) as { message?: string; filename?: string; directory?: string; provider?: ChallengeProvider; challengeNumber?: string; title?: string; challengeUrl?: string; question?: string; solutions?: SolutionState[] };
      if (!response.ok || !result.filename || !result.solutions?.length) throw new Error(result.message || "The Markdown file could not be loaded.");
      setForm((current) => ({ ...current, provider: result.provider || "", challengeNumber: result.challengeNumber || "", challengeTitle: result.title || "", challengeUrl: result.challengeUrl || "", question: result.question || "", solutions: result.solutions!, directory: result.directory || "", overwrite: true }));
      setExistingFilename(result.filename);
      setImported(true);
      setPublishedUrl(null);
      toast.success("Existing Markdown loaded and ready to update");
    } catch (error) { toast.error(error instanceof Error ? error.message : "Loading failed."); } finally { setIsLoadingExisting(false); }
  }
  async function importChallenge() {
    if (!form.challengeUrl.trim()) return;
    setIsImporting(true); setImported(false);
    try {
      const response = await fetch("/api/import-challenge", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ url: form.challengeUrl, language: primarySolution.language }) });
      const result = (await response.json()) as { message?: string; provider?: ChallengeProvider; challengeNumber?: string; title?: string; question?: string; runtime?: string };
      if (!response.ok || !result.title || !result.question) throw new Error(result.message || "The challenge could not be imported.");
      setForm((current) => { const provider = result.provider || current.provider; const language = current.solutions[0].language; return { ...current, provider, challengeNumber: result.challengeNumber || current.challengeNumber, challengeTitle: result.title!, question: result.question!, solutions: current.solutions.map((solution, index) => index === 0 ? { ...solution, runtime: result.runtime || solution.runtime } : solution), directory: DEFAULT_FOLDERS.includes(current.directory) ? defaultFolder(provider, language) : current.directory }; });
      setImported(true); setPublishedUrl(null); toast.success("Challenge question imported");
    } catch (error) { toast.error(error instanceof Error ? error.message : "Import failed."); } finally { setIsImporting(false); }
  }
  function clearChallenge() { setForm((current) => ({ ...current, provider: "", challengeNumber: "", challengeTitle: "", challengeUrl: "", question: "", solutions: [{ ...current.solutions[0], code: "" }], overwrite: false })); setExistingPath(""); setExistingFilename(""); setImported(false); setPublishedUrl(null); toast.success("Ready for the next challenge"); }
  async function copySolution(solution: SolutionState) { if (!solution.code) return; await navigator.clipboard.writeText(solution.code); toast.success(`${solution.language} solution copied`); }
  async function publish() {
    setIsPublishing(true); setPublishedUrl(null);
    try { const response = await fetch("/api/publish", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...form, language: primarySolution.language, filename, markdown }) }); const result = (await response.json()) as { message?: string; htmlUrl?: string }; if (!response.ok) throw new Error(result.message || "GitHub could not publish this file."); setPublishedUrl(result.htmlUrl || null); toast.success("Markdown published to GitHub"); }
    catch (error) { toast.error(error instanceof Error ? error.message : "Publishing failed."); } finally { setIsPublishing(false); }
  }
  const ready = form.challengeNumber.trim() && form.challengeTitle.trim() && form.question.trim() && form.solutions.every((solution) => solution.code.trim()) && form.repository.trim() && form.branch.trim() && form.token.trim();

  return (
    <main className="app-shell">
      <Toaster richColors position="top-right" />
      <header className="topbar">
        <div className="brand"><div className="brand-mark" aria-hidden="true" /><h1>Coding Challenge <span>Publisher</span></h1></div>
        <div className="header-journey" aria-label="Workflow"><span>Solve</span><b>›</b><span>Document</span><b>›</b><span>Share</span><b>›</b><span>Build your portfolio</span></div>
      </header>
      <section className="mode-strip" aria-label="Challenge type and platform">
        <div className="language-switch" role="group" aria-label="Challenge language">
          <button type="button" className={primarySolution.language === "SQL" ? "language-button active" : "language-button"} aria-pressed={primarySolution.language === "SQL"} onClick={() => selectLanguage("SQL")}><Database /> SQL</button>
          <button type="button" className={primarySolution.language === "Python" ? "language-button active" : "language-button"} aria-pressed={primarySolution.language === "Python"} onClick={() => selectLanguage("Python")}><span className="python-logo" aria-hidden="true" /> Python</button>
        </div>
        <div className="mode-divider" />
        <div className="platform-buttons">
          <a className="platform-button" href={platformUrls.HackerRank} target="_blank" rel="noreferrer"><span className="platform-logo hackerrank-logo" aria-hidden="true" /><span>HackerRank</span><ExternalLink /></a>
          <a className="platform-button" href={platformUrls.DataLemur} target="_blank" rel="noreferrer"><span className="platform-logo datalemur-logo" aria-hidden="true" /><span>DataLemur</span><ExternalLink /></a>
          <a className="platform-button" href={platformUrls.LeetCode} target="_blank" rel="noreferrer"><span className="platform-logo leetcode-logo" aria-hidden="true" /><span>LeetCode</span><ExternalLink /></a>
        </div>
        <p>Turn coding challenges into a clean notebook and push to GitHub.</p>
      </section>
      <section className="repo-strip" aria-labelledby="destination-title">
        <div className="repo-heading"><GitFork size={18} /><div><h2 id="destination-title">GitHub destination</h2><p>Choose where the generated Markdown file should be committed.</p></div><div className="privacy-note"><LockKeyhole size={14} />Token used once, never saved</div></div>
        <div className="repo-grid">
          <div><FieldLabel id="repository">Repository</FieldLabel><Input id="repository" placeholder="username/coding-challenge-publisher" value={form.repository} onChange={(event) => update("repository", event.target.value)} /></div>
          <div><FieldLabel id="branch">Branch</FieldLabel><Input id="branch" value={form.branch} onChange={(event) => update("branch", event.target.value)} /></div>
          <div><FieldLabel id="directory" optional>Folder</FieldLabel><Input id="directory" value={form.directory} onChange={(event) => update("directory", event.target.value)} /><p className="field-help">Change this if you use a custom folder.</p></div>
          <div><FieldLabel id="token">Fine-grained token</FieldLabel><Input id="token" type="password" autoComplete="off" placeholder="github_pat_…" value={form.token} onChange={(event) => update("token", event.target.value)} /><p className="field-help">Requires Contents: read and write.</p></div>
        </div>
        <div className="existing-file-row">
          <div><FieldLabel id="existing-path" optional>Existing Markdown path</FieldLabel><Input id="existing-path" placeholder="HackerRank_SQL_Challenges/12889_Occupations.md" value={existingPath} onChange={(event) => { setExistingPath(event.target.value); setExistingFilename(""); }} /></div>
          <Button type="button" variant="outline" disabled={!form.repository.trim() || !form.branch.trim() || !form.token.trim() || !existingPath.trim() || isLoadingExisting} onClick={loadExistingMarkdown}>{isLoadingExisting ? <><Loader2 className="animate-spin" /> Loading…</> : <><Download /> Load from GitHub</>}</Button>
        </div>
      </section>
      <div className="workspace">
        <section className="editor-column" aria-labelledby="editor-title">
          <div className="section-heading"><div><p className="step-label">01 / Compose</p><h2 id="editor-title">Challenge + solutions</h2></div></div>
          <div>
            <FieldLabel id="challenge-url">Challenge URL</FieldLabel>
            <div className="import-row"><div className="url-input-wrap"><Link2 aria-hidden="true" /><Input id="challenge-url" type="url" placeholder="Paste a HackerRank, DataLemur, or LeetCode question link" value={form.challengeUrl} onChange={(event) => update("challengeUrl", event.target.value)} /></div><Button variant="outline" className="import-button" disabled={!form.challengeUrl.trim() || isImporting} onClick={importChallenge}>{isImporting ? <><Loader2 className="animate-spin" /> Importing…</> : <><Download /> Import question</>}</Button></div>
            <p className={imported ? "import-note imported" : "import-note"}>{imported ? `${form.provider || "Challenge"} question imported. Add one or more accepted solutions below.` : `Imports publicly accessible challenge details from supported platforms.`}</p>
          </div>
          <div className="title-grid"><div><FieldLabel id="challenge-number">Challenge #</FieldLabel><Input id="challenge-number" placeholder="1" value={form.challengeNumber} onChange={(event) => update("challengeNumber", event.target.value)} /></div><div><FieldLabel id="challenge-title">Title</FieldLabel><Input id="challenge-title" placeholder={primarySolution.language === "Python" ? "Arrays: Left Rotation" : "Occupations"} value={form.challengeTitle} onChange={(event) => update("challengeTitle", event.target.value)} /></div></div>
          <div className="editor-block"><div className="editor-label-row"><FieldLabel id="question">Challenge question</FieldLabel><span>{form.question.length.toLocaleString()} chars</span></div><Textarea id="question" className="question-area" placeholder="Paste the challenge description here…" value={form.question} onChange={(event) => update("question", event.target.value)} /></div>
          <div className="solutions-list">
            {form.solutions.map((solution, index) => (
              <div className="editor-block solution-card" key={solution.id}>
                <div className="solution-toolbar">
                  <span className="solution-title">{solution.language} Solution #{index + 1}</span>
                  <div className="solution-selectors">
                    <Select value={solution.language} onValueChange={(value) => changeSolutionLanguage(solution.id, value as ChallengeLanguage)}><SelectTrigger aria-label={`Language for solution ${index + 1}`} className="language-select"><SelectValue /></SelectTrigger><SelectContent align="end"><SelectItem value="SQL">SQL</SelectItem><SelectItem value="Python">Python</SelectItem></SelectContent></Select>
                    <Select value={solution.runtime} onValueChange={(value) => updateSolution(solution.id, { runtime: value })}><SelectTrigger aria-label={solution.language === "Python" ? "Python runtime" : "SQL dialect"} className="runtime-select"><SelectValue /></SelectTrigger><SelectContent align="end">{solution.language === "Python" ? <SelectItem value="Python 3">Python 3</SelectItem> : <><SelectItem value="MySQL">MySQL</SelectItem><SelectItem value="PostgreSQL">PostgreSQL</SelectItem></>}</SelectContent></Select>
                    {form.solutions.length > 1 && <Button type="button" variant="ghost" size="icon-sm" aria-label={`Remove solution ${index + 1}`} onClick={() => removeSolution(solution.id)}><Trash2 /></Button>}
                  </div>
                </div>
                <div className="code-editor-wrap"><Textarea id={`solution-${solution.id}`} spellCheck={false} className="code-area" placeholder={solution.language === "Python" ? "def solve():\n    pass" : "SELECT …"} value={solution.code} onChange={(event) => updateSolution(solution.id, { code: event.target.value })} /><Button type="button" variant="outline" size="sm" className="copy-button" disabled={!solution.code} onClick={() => copySolution(solution)}><Copy /> Copy</Button></div>
              </div>
            ))}
            <Button type="button" variant="outline" className="add-solution-button" onClick={addSolution}><Plus /> Add another solution</Button>
          </div>
          <div className="editor-actions"><Button variant="outline" disabled={!hasChallengeDraft} onClick={clearChallenge}><RotateCcw /> Clear</Button><Button size="lg" className="publish-button" disabled={!ready || isPublishing} onClick={publish}>{isPublishing ? <><Loader2 className="animate-spin" /> Publishing…</> : <><span className="github-mark" aria-hidden="true" /> Create &amp; push Markdown <Send /></>}</Button></div>
          <label className="overwrite-row" htmlFor="overwrite"><Checkbox id="overwrite" checked={form.overwrite} onCheckedChange={(checked) => update("overwrite", checked === true)} />Replace the file if it already exists</label>
          {publishedUrl && <a className="success-link" href={publishedUrl} target="_blank" rel="noreferrer"><CheckCircle2 size={17} /> Open published file</a>}
        </section>
        <aside className="preview-column" aria-labelledby="preview-title">
          <div className="preview-heading"><div><Eye size={21} /><h2 id="preview-title">Markdown preview</h2></div><span className="preview-filename"><FileCode2 />{filename || "No challenge loaded"}</span></div>
          <article className="markdown-preview" aria-label="Generated Markdown preview">
            {hasChallengeDraft ? <><h3><span>#</span> {form.challengeTitle || "Coding Challenge"}</h3><div className="preview-badges">{form.solutions.map((solution, index) => <span key={solution.id}>{solution.language === "Python" ? <span className="python-mini-logo" aria-hidden="true" /> : <Database />}#{index + 1} {solution.language} · {solution.runtime}</span>)}{form.provider && <span>{form.provider}</span>}{form.challengeNumber && <span>Challenge #{form.challengeNumber}</span>}</div><hr /><section><h4>## Challenge</h4><p className="challenge-copy">{form.question || "Your challenge question will appear here."}</p></section>{form.challengeUrl && <p className="source-link"><strong>Source:</strong> {form.challengeUrl}</p>}{form.solutions.map((solution, index) => <section key={solution.id}><h4>## {solution.language} Solution #{index + 1}</h4><pre className="solution-preview"><code>{solution.code || (solution.language === "Python" ? "# Your Python solution will appear here." : "-- Your SQL solution will appear here.")}</code></pre><p className="runtime-note">{solution.language === "Python" ? "Runtime" : "Dialect"}: {solution.runtime}</p></section>)}</> : <div className="empty-preview"><FileCode2 /><h3>Your Markdown will appear here</h3><p>Import a challenge, then add one or more SQL or Python solutions.</p></div>}
          </article>
          <details className="raw-markdown"><summary>View raw Markdown</summary><pre><code>{markdown}</code></pre></details>
        </aside>
      </div>
    </main>
  );
}
