---
name: deploy
description: How to deploy, commit and push altbryson.com, and when (only on the user's go-ahead)
metadata:
  type: project
---
- Hosting: Firebase project `altbryson-b17a8`, `firebase deploy --only hosting --project altbryson-b17a8` from the repo root. HTML and the manifest are served `Cache-Control: no-cache` (firebase.json) so visitors see new deploys on a normal refresh.
- Repo: gitlab.com/brysonwf/altbryson, branch `master`. Push with `env -u GIT_ASKPASS git -c credential.helper=manager push origin master` (the inherited VS Code askpass breaks GitLab auth).
- Workflow the user expects: make changes, verify in headless Chrome (Puppeteer from this repo's node_modules), summarize, then **deploy, commit and push only when the user says so** ("yes"/"deploy"). After deploying, curl altbryson.com to confirm the new markup is live.
- Installable as a web app: `public/manifest.webmanifest`, icons in `public/icons/`.
- Changes that span both sites (e.g. tab titles) also need baseless.chat shipped: its repo deploys automatically about 60–80 seconds after a push to `main` (GitHub, normal git auth). Poll the live file until the change appears before telling the user it is live.
