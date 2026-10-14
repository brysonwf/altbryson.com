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
- Phone-app install support (manifest + icons + iPhone tags) is live on baseless.chat, iamlocal.online, road.dance, altbrysonpool, firerp.app and budgetforecast.app (2026-10-14). snowballfight still lacks it (the icons are in Projects/snowballfight-old-prototype).
- The apps and the LinkedIn / X / GitHub links appear both here (dock + desktop) and on the baseless.chat home page. The user removed them from altbryson.com once, then asked for them back (b981bcc reverted by 38f8713), so keep both.
- 2026-10-13: Baseless window ⋮ menu (7edf772) and removal of baseless.chat's own ⋮ menu (baseless 64c10f0) are live.
- 2026-10-14: moving repos to PRIVATE GitHub (Bryson: "i want those new repos to be private"). Done: budgetforecast.app (GitLab disconnected), road.dance and altbrysonpool (pushed to their github remotes; GitLab still origin). Pending: altbryson -> github.com/brysonwf/altbryson.com, an old public WordPress repo; its 6 old commits were moved into archive/wordpress and merged into local master (cbbdd07), remote `github`; push only after Bryson makes that repo private. Auto-deploy via GitHub Actions is only on baseless.chat and firerp.app: Bryson declined running `firebase init hosting:github` ("i don't want to do that"), so the other sites are deployed with the Firebase CLI on request. Old folder Projects/altbryson-check-please is a stale duplicate of Projects/budgetforecast.app (it was locked by the session that opened it); delete it once nothing has it open.
