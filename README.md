# Coding Challenge Publisher

Coding Challenge Publisher is a public web application for turning HackerRank, DataLemur, LeetCode, and StrataScratch challenges into consistent Markdown portfolio entries. Import a challenge, add one or more SQL or Python solutions, preview the result, and publish it directly to a GitHub repository.

**Live application:** [Coding Challenge Publisher](https://challenge-publisher.das-reemika.chatgpt.site/)

## Features

- Import publicly accessible HackerRank, DataLemur, and LeetCode challenge descriptions from an individual challenge URL.
- Connect a StrataScratch account through its official OAuth/MCP service and import questions available to that account.
- Document SQL solutions using MySQL or PostgreSQL.
- Document Python solutions using Python 3.
- Add multiple SQL and Python solutions to the same challenge file.
- Generate filenames in `<Challenge #>_<Title>.md` format.
- Preview the filename and rendered Markdown before publishing.
- Publish to a selected GitHub repository, branch, and folder.
- Load an existing Markdown file from GitHub, edit it in the app, and publish the updated version.
- Protect existing files unless **Replace the file if it already exists** is enabled.
- Clear the current challenge while retaining the GitHub destination settings for the next entry.
- Use GitHub tokens only for the requested operation; the application does not save them.

## How to use the application

1. Open [Coding Challenge Publisher](https://challenge-publisher.das-reemika.chatgpt.site/).
2. Enter the destination repository as `owner/repository`, its branch, and an optional folder.
3. Enter a fine-grained GitHub token restricted to that repository with **Contents: read and write** permission.
4. Select **SQL** or **Python**, then open HackerRank, DataLemur, LeetCode, or StrataScratch from the platform buttons.
5. Solve a challenge on the provider's website and copy its individual challenge URL.
6. Return to the publisher, paste the URL into **Challenge URL**, and select **Import question**.
7. When importing from StrataScratch for the first time, complete the secure StrataScratch authorization and return to the publisher. The pending question imports automatically.
8. Review the imported challenge number, title, and question.
9. Choose the solution language and runtime or dialect, then paste the accepted solution.
10. Select **Add another solution** when the same challenge should contain another SQL or Python approach.
11. Review the generated filename and Markdown preview.
12. Select **Create & push Markdown** to publish the file to GitHub.

## Update an existing Markdown file

1. Enter the repository, branch, fine-grained token, and the complete file path—for example, `HackerRank_SQL_Challenges/12889_Occupations.md`.
2. Select **Load from GitHub**.
3. Edit the challenge or its solutions. You can also add another SQL or Python solution.
4. Review the preview and select **Create & push Markdown**. Replacement is enabled automatically for the loaded file.

## Run locally

Requirements: Node.js 22.13 or later.

```bash
npm install
npm run dev
```

Open the local URL shown in the terminal.

## Build

```bash
npm run build
```

The application uses server-side API routes to import public challenge text, communicate with GitHub, and call StrataScratch's official OAuth/MCP service.

## Repository branches

- `main` stores published challenge Markdown files and the portfolio README.
- `WebApp` stores the Coding Challenge Publisher source code.

## Deployment

The production application is hosted with ChatGPT Sites at [challenge-publisher.das-reemika.chatgpt.site](https://challenge-publisher.das-reemika.chatgpt.site/).

GitHub Pages cannot host this application unchanged because Pages does not run the server-side routes used for imports and GitHub publishing.

## Privacy and security

- Use a fine-grained GitHub token restricted to the intended repository.
- Grant only **Contents: read and write** permission.
- Never commit a token to the repository or include it in a Markdown file.
- The application does not save GitHub tokens.
- Sign in to HackerRank, DataLemur, and LeetCode only on their official websites. The publisher never requests or stores those login details.
- StrataScratch authorization happens on StrataScratch through OAuth. Access and refresh tokens are kept in an encrypted, HTTP-only browser cookie and are never exposed to the page or committed to GitHub.
- Only challenge details available to the publisher without a platform session are imported; account-protected content and private submissions remain on the provider's website.
