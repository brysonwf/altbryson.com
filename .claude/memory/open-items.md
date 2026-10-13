---
name: open-items
description: Pending work and open questions for altbryson.com as of 2026-10-12
metadata:
  type: project
---
State at end of 2026-10-12 (last deploy/commit 1248f0a; everything is committed, pushed to GitLab and live):
- The Google Chat demo was built from knowledge of Chat's design, not a side-by-side comparison; the user may send a screenshot to match exactly.
- Google Voice Tray has no GitHub release, so download links go to the repo page. If a release with GoogleVoiceTray.exe is published, point the `GVT_REPO` links at it.
- Resume is a "Coming soon" placeholder, as is "SketchUp Samples.skp".
- The legal disclaimer was written in plain language, not reviewed by a lawyer.
- Phone-app install support (manifest + icons + iPhone tags) is shipped for baseless.chat only. It is still uncommitted and undeployed in road.dance, altbrysonpool, iamlocal.online, firerp.app and snowballfight (snowballfight's deploy setup is unknown).
- The apps and the LinkedIn / X / GitHub links appear both here (dock + desktop) and on the baseless.chat home page. The user removed them from altbryson.com once, then asked for them back (b981bcc reverted by 38f8713), so keep both.
- 2026-10-13: Baseless window ⋮ menu (7edf772) and removal of baseless.chat's own ⋮ menu (baseless 64c10f0) are live.
