# Coding Challenge Publisher

Coding Challenge Publisher is a public web application for turning HackerRank and DataLemur challenges into consistent Markdown portfolio entries. Import a public challenge, add one or more SQL or Python solutions, preview the result, and publish it directly to a GitHub repository.

**Live application:** [Coding Challenge Publisher](https://challenge-publisher.das-reemika.chatgpt.site/)

## Features

- Import public HackerRank and DataLemur challenge descriptions from an individual challenge URL.
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
4. Select **SQL** or **Python**, then open HackerRank or DataLemur from the platform buttons.
5. Solve a challenge on the provider's website and copy its individual challenge URL.
6. Return to the publisher, paste the URL into **Challenge URL**, and select **Import question**.
7. Review the imported challenge number, title, and question.
8. Choose the solution language and runtime or dialect, then paste the accepted solution.
9. Select **Add another solution** when the same challenge should contain another SQL or Python approach.
10. Review the generated filename and Markdown preview.
11. Select **Create & push Markdown** to publish the file to GitHub.

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

The application uses server-side API routes to import public challenge text and communicate with GitHub.

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
- Sign in to HackerRank and DataLemur only on their official websites. The publisher never requests or stores those login details.
- DataLemur premium content and private provider submissions are not accessed.
