---
name: open-items
description: Pending work and open questions for altbryson.com as of 2026-10-12
metadata:
  type: project
---
State at end of 2026-10-12 (last deploy/commit 1248f0a; everything is committed, pushed to GitLab and live):
- The Google Chat demo was built from knowledge of Chat's design, not a side-by-side comparison; the user may send a screenshot to match exactly.
- Google Voice Tray has no GitHub release, so download links go to the repo page. If a release with GoogleVoiceTray.exe is published, point the `GVT_REPO` links at it.
- The resume and "SketchUp Samples.skp" desktop placeholders were removed 2026-10-13. A merged resume now lives in a Claude Doc (claude.ai/code/artifact/6cc24c72-1554-4695-948b-01f2c813bd46, no personal contact details) and was exported to Downloads as a PDF; it is not on the site.
- The legal disclaimer was written in plain language, not reviewed by a lawyer.
- Phone-app install support (manifest + icons + iPhone tags) is shipped for baseless.chat only. It is still uncommitted and undeployed in road.dance, altbrysonpool, iamlocal.online, firerp.app and snowballfight (snowballfight's deploy setup is unknown).
- The apps and the LinkedIn / X / GitHub links appear both here (dock + desktop) and on the baseless.chat home page. The user removed them from altbryson.com once, then asked for them back (b981bcc reverted by 38f8713), so keep both.
- 2026-10-13: Baseless window ⋮ menu (7edf772) and removal of baseless.chat's own ⋮ menu (baseless 64c10f0) are live.
- 2026-10-14, in progress: Bryson wants every site deployed by GitHub Actions, in PRIVATE GitHub repos ("i want those new repos to be private"). Already on Actions: baseless.chat, firerp.app (pinned, least-privilege workflows). To do: create private GitHub repos for altbryson and altbryson-check-please (road.dance and altbrysonpool already have empty private GitHub copies), add them as a second remote and push (GitLab stays as a copy), then in each of altbryson, altbryson-check-please, road.dance, altbrysonpool, iamlocal.online and snowballfight Bryson runs `firebase init hosting:github` (creates the service-account secret + workflow) and Claude pins/hardens the workflow like baseless.chat's. budgetforecast (altbryson-check-please) needs `npm ci && npx gulp html app sass lib` in its workflow before deploying www/. Until then those six deploy by hand with the Firebase CLI.
