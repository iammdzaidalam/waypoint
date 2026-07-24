# GitHub Waypoint

**Live at [github-waypoint.vercel.app](https://github-waypoint.vercel.app)**

Waypoint is a free GitHub activity tracer. Search any **username**, **organization**, or **owner/repo** and see where they actually spend their time: pull requests opened, merge rates, review speed, top repositories, and likely maintainers.

![GitHub Waypoint](https://github-waypoint.vercel.app/opengraph-image)

## What it shows

- **Users**: lifetime PRs, merge rate, repository contribution trail, activity mix, and a recent public-events timeline. Click any repo in the trail to inspect the exact PRs and issues behind it.
- **Organizations**: the most recently active repositories, inferred key contributors, and official public members worth reaching out to.
- **Repositories**: pull request analytics over a chosen window and branch, including merge rate, average days to merge, label distribution, top contributors, and recent PRs/issues, exportable as CSV or JSON.

## Why

Contribution graphs hide the story. A wall of green squares says nothing about whether PRs get merged, how fast a project reviews community work, or who actually maintains it. Waypoint answers the questions you have before contributing to a project, hiring a developer, or showcasing your own open source footprint.

## Usage notes

- No login required. Everything reads public data from the official GitHub API.
- Optional: add a [personal access token](https://github.com/settings/tokens/new?description=Waypoint) (no scopes needed) to raise the rate limit from 60 to 5,000 requests/hour. The token is stored only in your browser's localStorage.
- Trace pages are shareable URLs: `github-waypoint.vercel.app/torvalds` or `github-waypoint.vercel.app/vercel/next.js`.

## Tech stack

Next.js (App Router) on Vercel, React, Tailwind CSS, and the GitHub REST API. Monochrome "paper and ink" design with Geist Pixel, JetBrains Mono, and Space Grotesk.

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Author

Built by [@iammdzaidalam](https://github.com/iammdzaidalam). Issues and PRs welcome.
