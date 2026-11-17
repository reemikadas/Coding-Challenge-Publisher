import { NextResponse } from "next/server";
import { hasChallengeCountTable, isTrackedChallengePath, updateChallengeCountTable } from "@/lib/challenge-counts";

type PublishRequest = { challengeNumber?:string; challengeTitle?:string; language?:string; repository?:string; branch?:string; directory?:string; token?:string; filename?:string; markdown?:string; overwrite?:boolean };
function cleanPathPart(value:string) { return value.split("/").filter((part) => part && part !== "." && part !== "..").join("/"); }
function encodePath(path:string) { return path.split("/").map(encodeURIComponent).join("/"); }
function toBase64(value:string) { const bytes=new TextEncoder().encode(value); let binary=""; for(const byte of bytes) binary+=String.fromCharCode(byte); return btoa(binary); }
function fromBase64(value:string) { const binary=atob(value.replace(/\s/g,"")); const bytes=Uint8Array.from(binary,(character)=>character.charCodeAt(0)); return new TextDecoder().decode(bytes); }
async function githubRequest(url:string, token:string, init:RequestInit={}) { return fetch(url,{...init,headers:{accept:"application/vnd.github+json",authorization:`Bearer ${token}`,"x-github-api-version":"2022-11-28","user-agent":"sql-challenge-publisher",...init.headers}}); }

async function updateReadmeCounts(repository:string,branch:string,token:string) {
  const readmeEndpoint=`https://api.github.com/repos/${repository}/contents/README.md`;
  const readmeResponse=await githubRequest(`${readmeEndpoint}?ref=${encodeURIComponent(branch)}`,token);
  if(readmeResponse.status===404) return false;
  const readmeResult=(await readmeResponse.json().catch(()=>({}))) as {message?:string;sha?:string;content?:string};
  if(!readmeResponse.ok) throw new Error(readmeResult.message||"GitHub could not read README.md.");
  if(!readmeResult.sha||!readmeResult.content) throw new Error("GitHub returned an incomplete README.md response.");
  const readme=fromBase64(readmeResult.content);
  if(!hasChallengeCountTable(readme)) return false;

  const treeResponse=await githubRequest(`https://api.github.com/repos/${repository}/git/trees/${encodeURIComponent(branch)}?recursive=1`,token);
  const treeResult=(await treeResponse.json().catch(()=>({}))) as {message?:string;truncated?:boolean;tree?:Array<{path?:string;type?:string}>};
  if(!treeResponse.ok) throw new Error(treeResult.message||"GitHub could not list the challenge files.");
  if(treeResult.truncated) throw new Error("The repository tree is too large to count reliably.");
  const paths=(treeResult.tree||[]).filter((entry)=>entry.type==="blob"&&entry.path).map((entry)=>entry.path as string);
  const updatedReadme=updateChallengeCountTable(readme,paths);
  if(updatedReadme===readme) return false;

  const updateResponse=await githubRequest(readmeEndpoint,token,{method:"PUT",headers:{"content-type":"application/json"},body:JSON.stringify({message:"Update challenge solution counts",content:toBase64(updatedReadme),branch,sha:readmeResult.sha})});
  const updateResult=(await updateResponse.json().catch(()=>({}))) as {message?:string};
  if(!updateResponse.ok) throw new Error(updateResult.message||"GitHub could not update the README counts.");
  return true;
}

export async function POST(request:Request) {
  let body:PublishRequest;
  try { body=(await request.json()) as PublishRequest; } catch { return NextResponse.json({message:"The request was not valid JSON."},{status:400}); }
  const repository=body.repository?.trim()||""; const branch=body.branch?.trim()||"main"; const token=body.token?.trim()||""; const filename=cleanPathPart(body.filename?.trim()||""); const directory=cleanPathPart(body.directory?.trim()||""); const markdown=body.markdown||"";
  if(!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repository)) return NextResponse.json({message:"Use the repository format username/repository."},{status:400});
  if(!token||!filename.endsWith(".md")||!markdown.trim()) return NextResponse.json({message:"Token, filename, and Markdown content are required."},{status:400});
  if(markdown.length>750_000) return NextResponse.json({message:"This Markdown file is too large."},{status:413});
  const path=[directory,filename].filter(Boolean).join("/"); const endpoint=`https://api.github.com/repos/${repository}/contents/${encodePath(path)}`; let existingSha:string|undefined;
  const existing=await githubRequest(`${endpoint}?ref=${encodeURIComponent(branch)}`,token);
  if(existing.ok) { if(!body.overwrite) return NextResponse.json({message:`${path} already exists. Enable replace to update it.`},{status:409}); const existingFile=(await existing.json()) as {sha?:string}; existingSha=existingFile.sha; }
  else if(existing.status!==404) { const failure=(await existing.json().catch(()=>({}))) as {message?:string}; return NextResponse.json({message:failure.message||"GitHub could not access that repository."},{status:existing.status}); }
  const language=body.language==="Python"?"Python":"SQL";
  const commitMessage=existingSha?`Update ${language} challenge ${body.challengeNumber||body.challengeTitle||"solution"}`:`Add ${language} challenge ${body.challengeNumber||body.challengeTitle||"solution"}`;
  const response=await githubRequest(endpoint,token,{method:"PUT",headers:{"content-type":"application/json"},body:JSON.stringify({message:commitMessage,content:toBase64(markdown),branch,...(existingSha?{sha:existingSha}:{})})});
  const result=(await response.json().catch(()=>({}))) as {message?:string;content?:{html_url?:string}};
  if(!response.ok) return NextResponse.json({message:result.message||"GitHub rejected the commit."},{status:response.status});
  let countsUpdated=false; let countWarning:string|undefined;
  if(!existingSha&&isTrackedChallengePath(path)) {
    try { countsUpdated=await updateReadmeCounts(repository,branch,token); }
    catch(error) { countWarning=error instanceof Error?error.message:"README challenge counts could not be updated."; }
  }
  return NextResponse.json({message:"Published successfully.",path,htmlUrl:result.content?.html_url,countsUpdated,countWarning});
}
