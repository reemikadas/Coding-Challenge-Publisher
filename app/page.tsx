"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Copy, Database, Download, ExternalLink, Eye, FileCode2, GitFork, Link2, Loader2, LockKeyhole, RotateCcw, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Toaster } from "@/components/ui/sonner";

type ChallengeProvider = "" | "HackerRank" | "DataLemur";
type ChallengeLanguage = "SQL" | "Python";
type FormState = { provider: ChallengeProvider; language: ChallengeLanguage; challengeNumber: string; challengeTitle: string; challengeUrl: string; question: string; solution: string; runtime: string; repository: string; branch: string; directory: string; token: string; overwrite: boolean };
const DEFAULT_FOLDERS = ["HackerRank_Challenges", "DataLemur_Challenges", "HackerRank_Python_Challenges", "DataLemur_Python_Challenges"];
const initialForm: FormState = { provider: "", language: "SQL", challengeNumber: "", challengeTitle: "", challengeUrl: "", question: "", solution: "", runtime: "MySQL", repository: "", branch: "main", directory: "HackerRank_Challenges", token: "", overwrite: false };

function filenamePart(value: string) { return value.trim().replace(/[’']/g, "").replace(/[^a-zA-Z0-9]+/g, "_").replace(/^_+|_+$/g, ""); }
function filenameFor(challengeNumber: string, challengeTitle: string) { const number = filenamePart(challengeNumber); const title = filenamePart(challengeTitle); return number && title ? `${number}_${title}.md` : ""; }
function defaultFolder(provider: ChallengeProvider, language: ChallengeLanguage) { const platform = provider === "DataLemur" ? "DataLemur" : "HackerRank"; return language === "Python" ? `${platform}_Python_Challenges` : `${platform}_Challenges`; }
function markdownFor(form: FormState) {
  const providerPrefix = form.provider === "DataLemur" ? "DataLemur " : "";
  const heading = [form.challengeNumber && `${providerPrefix}Challenge ${form.challengeNumber}`, form.challengeTitle].filter(Boolean).join(": ") || `${form.language} Challenge`;
  const source = form.challengeUrl ? `\n**Source:** [View challenge](${form.challengeUrl})\n` : "";
  const fence = form.language === "Python" ? "python" : "sql";
  const placeholder = form.language === "Python" ? "# Your Python solution will appear here." : "-- Your SQL solution will appear here.";
  const metadata = form.language === "Python" ? `Runtime: ${form.runtime || "Python 3"}` : `Dialect: ${form.runtime || "SQL"}`;
  return `# ${heading}\n${source}\n## Challenge\n\n${form.question.trim() || "Your challenge question will appear here."}\n\n## ${form.language} Solution\n\n~~~${fence}\n${form.solution.trim() || placeholder}\n~~~\n\n_${metadata}_\n`;
}
function FieldLabel({ id, children, optional = false }: { id: string; children: React.ReactNode; optional?: boolean }) { return <label htmlFor={id} className="field-label">{children}{optional && <span>Optional</span>}</label>; }

export default function Home() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [imported, setImported] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null);
  const hasChallengeDraft = Boolean(form.challengeNumber.trim() || form.challengeTitle.trim() || form.challengeUrl.trim() || form.question.trim() || form.solution.trim());
  const markdown = useMemo(() => hasChallengeDraft ? markdownFor(form) : "", [form, hasChallengeDraft]);
  const filename = filenameFor(form.challengeNumber, form.challengeTitle);
  const platformUrls = form.language === "Python" ? { HackerRank: "https://www.hackerrank.com/domains/python", DataLemur: "https://datalemur.com/questions?category=Python" } : { HackerRank: "https://www.hackerrank.com/domains/sql", DataLemur: "https://datalemur.com/questions?category=SQL" };

  useEffect(() => {
    const modelContext = (document as Document & { modelContext?: { registerTool?: (tool: unknown, options?: { signal?: AbortSignal }) => void | Promise<void> } }).modelContext;
    if (!modelContext?.registerTool) return;
    const lifecycle = new AbortController();
    const tool = {
      name: "stage_coding_challenge", title: "Stage coding challenge", description: "Fill the visible SQL or Python challenge editor so the user can review the generated Markdown before publishing.",
      inputSchema: { type: "object", properties: { challengeNumber: { type: "string" }, challengeTitle: { type: "string" }, challengeUrl: { type: "string" }, provider: { type: "string", enum: ["HackerRank", "DataLemur"] }, language: { type: "string", enum: ["SQL", "Python"] }, question: { type: "string" }, solution: { type: "string" }, runtime: { type: "string" } }, required: ["challengeNumber", "challengeTitle", "language", "question", "solution"], additionalProperties: false },
      annotations: { readOnlyHint: false, untrustedContentHint: true },
      execute(input: unknown) {
        if (!input || typeof input !== "object") throw new Error("Challenge details are required.");
        const values = input as Record<string, unknown>;
        for (const key of ["challengeNumber", "challengeTitle", "language", "question", "solution"]) if (typeof values[key] !== "string" || !values[key]) throw new Error(`${key} is required.`);
        const provider = values.provider === "DataLemur" || values.provider === "HackerRank" ? values.provider : "";
        const language: ChallengeLanguage = values.language === "Python" ? "Python" : "SQL";
        setForm((current) => ({ ...current, provider, language, challengeNumber: values.challengeNumber as string, challengeTitle: values.challengeTitle as string, challengeUrl: typeof values.challengeUrl === "string" ? values.challengeUrl : "", question: values.question as string, solution: values.solution as string, runtime: typeof values.runtime === "string" && values.runtime ? values.runtime : language === "Python" ? "Python 3" : "MySQL", directory: defaultFolder(provider, language) }));
        setPublishedUrl(null);
        return { staged: true, filename: filenameFor(values.challengeNumber as string, values.challengeTitle as string) };
      },
    };
    try { void Promise.resolve(modelContext.registerTool(tool, { signal: lifecycle.signal })).catch(() => undefined); } catch { /* The visible form remains available without WebMCP. */ }
    return () => lifecycle.abort();
  }, []);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) { setForm((current) => ({ ...current, [key]: value })); setPublishedUrl(null); if (key === "challengeUrl") setImported(false); }
  function selectLanguage(language: ChallengeLanguage) { setForm((current) => ({ ...current, language, runtime: language === "Python" ? "Python 3" : "MySQL", directory: DEFAULT_FOLDERS.includes(current.directory) ? defaultFolder(current.provider, language) : current.directory })); setImported(false); setPublishedUrl(null); }
  async function importChallenge() {
    if (!form.challengeUrl.trim()) return;
    setIsImporting(true); setImported(false);
    try {
      const response = await fetch("/api/import-challenge", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ url: form.challengeUrl, language: form.language }) });
      const result = (await response.json()) as { message?: string; provider?: ChallengeProvider; challengeNumber?: string; title?: string; question?: string; runtime?: string };
      if (!response.ok || !result.title || !result.question) throw new Error(result.message || "The challenge could not be imported.");
      setForm((current) => { const provider = result.provider || current.provider; return { ...current, provider, challengeNumber: result.challengeNumber || current.challengeNumber, challengeTitle: result.title!, question: result.question!, runtime: result.runtime || current.runtime, directory: DEFAULT_FOLDERS.includes(current.directory) ? defaultFolder(provider, current.language) : current.directory }; });
      setImported(true); setPublishedUrl(null); toast.success("Challenge question imported");
    } catch (error) { toast.error(error instanceof Error ? error.message : "Import failed."); } finally { setIsImporting(false); }
  }
  function clearChallenge() { setForm((current) => ({ ...current, provider: "", challengeNumber: "", challengeTitle: "", challengeUrl: "", question: "", solution: "", overwrite: false })); setImported(false); setPublishedUrl(null); toast.success("Ready for the next challenge"); }
  async function copySolution() { if (!form.solution) return; await navigator.clipboard.writeText(form.solution); toast.success(`${form.language} solution copied`); }
  async function publish() {
    setIsPublishing(true); setPublishedUrl(null);
    try { const response = await fetch("/api/publish", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...form, filename, markdown }) }); const result = (await response.json()) as { message?: string; htmlUrl?: string }; if (!response.ok) throw new Error(result.message || "GitHub could not publish this file."); setPublishedUrl(result.htmlUrl || null); toast.success("Markdown published to GitHub"); }
    catch (error) { toast.error(error instanceof Error ? error.message : "Publishing failed."); } finally { setIsPublishing(false); }
  }
  const ready = form.challengeNumber.trim() && form.challengeTitle.trim() && form.question.trim() && form.solution.trim() && form.repository.trim() && form.branch.trim() && form.token.trim();

  return (
    <main className="app-shell">
      <Toaster richColors position="top-right" />
      <header className="topbar">
        <div className="brand"><div className="brand-mark" aria-hidden="true"><FileCode2 size={25} /></div><h1>Challenge Notebook <span>Publisher</span></h1></div>
        <div className="header-journey" aria-label="Workflow"><span>Solve</span><b>›</b><span>Document</span><b>›</b><span>Share</span><b>›</b><span>Build your portfolio</span></div>
      </header>
      <section className="mode-strip" aria-label="Challenge type and platform">
        <div className="language-switch" role="group" aria-label="Challenge language">
          <button type="button" className={form.language === "SQL" ? "language-button active" : "language-button"} aria-pressed={form.language === "SQL"} onClick={() => selectLanguage("SQL")}><Database /> SQL</button>
          <button type="button" className={form.language === "Python" ? "language-button active" : "language-button"} aria-pressed={form.language === "Python"} onClick={() => selectLanguage("Python")}><span className="python-logo" aria-hidden="true" /> Python</button>
        </div>
        <div className="mode-divider" />
        <div className="platform-buttons">
          <a className="platform-button" href={platformUrls.HackerRank} target="_blank" rel="noreferrer"><span className="platform-logo hackerrank-logo" aria-hidden="true" /><span>HackerRank</span><ExternalLink /></a>
          <a className="platform-button" href={platformUrls.DataLemur} target="_blank" rel="noreferrer"><span className="platform-logo datalemur-logo" aria-hidden="true" /><span>DataLemur</span><ExternalLink /></a>
        </div>
        <p>Turn coding challenges into a clean notebook and push to GitHub.</p>
      </section>
      <section className="repo-strip" aria-labelledby="destination-title">
        <div className="repo-heading"><GitFork size={18} /><div><h2 id="destination-title">GitHub destination</h2><p>Choose where the generated Markdown file should be committed.</p></div><div className="privacy-note"><LockKeyhole size={14} />Token used once, never saved</div></div>
        <div className="repo-grid">
          <div><FieldLabel id="repository">Repository</FieldLabel><Input id="repository" placeholder="username/challenge-journal" value={form.repository} onChange={(event) => update("repository", event.target.value)} /></div>
          <div><FieldLabel id="branch">Branch</FieldLabel><Input id="branch" value={form.branch} onChange={(event) => update("branch", event.target.value)} /></div>
          <div><FieldLabel id="directory" optional>Folder</FieldLabel><Input id="directory" value={form.directory} onChange={(event) => update("directory", event.target.value)} /><p className="field-help">Change this if you use a custom folder.</p></div>
          <div><FieldLabel id="token">Fine-grained token</FieldLabel><Input id="token" type="password" autoComplete="off" placeholder="github_pat_…" value={form.token} onChange={(event) => update("token", event.target.value)} /><p className="field-help">Requires Contents: read and write.</p></div>
        </div>
      </section>
      <div className="workspace">
        <section className="editor-column" aria-labelledby="editor-title">
          <div className="section-heading"><div><p className="step-label">01 / Compose</p><h2 id="editor-title">Challenge + {form.language.toLowerCase()} solution</h2></div></div>
          <div>
            <FieldLabel id="challenge-url">Challenge URL</FieldLabel>
            <div className="import-row"><div className="url-input-wrap"><Link2 aria-hidden="true" /><Input id="challenge-url" type="url" placeholder="Paste a HackerRank or DataLemur question link" value={form.challengeUrl} onChange={(event) => update("challengeUrl", event.target.value)} /></div><Button variant="outline" className="import-button" disabled={!form.challengeUrl.trim() || isImporting} onClick={importChallenge}>{isImporting ? <><Loader2 className="animate-spin" /> Importing…</> : <><Download /> Import question</>}</Button></div>
            <p className={imported ? "import-note imported" : "import-note"}>{imported ? `${form.provider || "Challenge"} question imported. Add your accepted ${form.language} solution below.` : `Imports public HackerRank and DataLemur ${form.language} questions. Premium content is not accessed.`}</p>
          </div>
          <div className="title-grid"><div><FieldLabel id="challenge-number">Challenge #</FieldLabel><Input id="challenge-number" placeholder="1" value={form.challengeNumber} onChange={(event) => update("challengeNumber", event.target.value)} /></div><div><FieldLabel id="challenge-title">Title</FieldLabel><Input id="challenge-title" placeholder={form.language === "Python" ? "Arrays: Left Rotation" : "Occupations"} value={form.challengeTitle} onChange={(event) => update("challengeTitle", event.target.value)} /></div></div>
          <div className="editor-block"><div className="editor-label-row"><FieldLabel id="question">Challenge question</FieldLabel><span>{form.question.length.toLocaleString()} chars</span></div><Textarea id="question" className="question-area" placeholder="Paste the challenge description here…" value={form.question} onChange={(event) => update("question", event.target.value)} /></div>
          <div className="editor-block">
            <div className="solution-toolbar"><FieldLabel id="solution">{form.language} Solution #</FieldLabel><Select value={form.runtime} onValueChange={(value) => update("runtime", value)}><SelectTrigger aria-label={form.language === "Python" ? "Python runtime" : "SQL dialect"} className="runtime-select"><SelectValue /></SelectTrigger><SelectContent align="end">{form.language === "Python" ? <SelectItem value="Python 3">Python 3</SelectItem> : <><SelectItem value="MySQL">MySQL</SelectItem><SelectItem value="PostgreSQL">PostgreSQL</SelectItem></>}</SelectContent></Select></div>
            <div className="code-editor-wrap"><Textarea id="solution" spellCheck={false} className="code-area" placeholder={form.language === "Python" ? "def solve():\n    pass" : "SELECT …"} value={form.solution} onChange={(event) => update("solution", event.target.value)} /><Button type="button" variant="outline" size="sm" className="copy-button" disabled={!form.solution} onClick={copySolution}><Copy /> Copy</Button></div>
          </div>
          <div className="editor-actions"><Button variant="outline" disabled={!hasChallengeDraft} onClick={clearChallenge}><RotateCcw /> Clear</Button><Button size="lg" className="publish-button" disabled={!ready || isPublishing} onClick={publish}>{isPublishing ? <><Loader2 className="animate-spin" /> Publishing…</> : <><span className="github-mark" aria-hidden="true" /> Create &amp; push Markdown <Send /></>}</Button></div>
          <label className="overwrite-row" htmlFor="overwrite"><Checkbox id="overwrite" checked={form.overwrite} onCheckedChange={(checked) => update("overwrite", checked === true)} />Replace the file if it already exists</label>
          {publishedUrl && <a className="success-link" href={publishedUrl} target="_blank" rel="noreferrer"><CheckCircle2 size={17} /> Open published file</a>}
        </section>
        <aside className="preview-column" aria-labelledby="preview-title">
          <div className="preview-heading"><div><Eye size={21} /><h2 id="preview-title">Markdown preview</h2></div><span className="preview-filename"><FileCode2 />{filename || "No challenge loaded"}</span></div>
          <article className="markdown-preview" aria-label="Generated Markdown preview">
            {hasChallengeDraft ? <><h3><span>#</span> {form.challengeTitle || `${form.language} Challenge`}</h3><div className="preview-badges"><span>{form.language === "Python" ? <span className="python-mini-logo" aria-hidden="true" /> : <Database />}{form.runtime}</span>{form.provider && <span>{form.provider}</span>}{form.challengeNumber && <span>Challenge #{form.challengeNumber}</span>}</div><hr /><section><h4>## Challenge</h4><p className="challenge-copy">{form.question || "Your challenge question will appear here."}</p></section>{form.challengeUrl && <p className="source-link"><strong>Source:</strong> {form.challengeUrl}</p>}<section><h4>## {form.language} Solution</h4><pre className="solution-preview"><code>{form.solution || (form.language === "Python" ? "# Your Python solution will appear here." : "-- Your SQL solution will appear here.")}</code></pre></section><p className="runtime-note">{form.language === "Python" ? "Runtime" : "Dialect"}: {form.runtime}</p></> : <div className="empty-preview"><FileCode2 /><h3>Your Markdown will appear here</h3><p>Choose SQL or Python, import a challenge, and add your solution.</p></div>}
          </article>
          <details className="raw-markdown"><summary>View raw Markdown</summary><pre><code>{markdown}</code></pre></details>
        </aside>
      </div>
    </main>
  );
}
