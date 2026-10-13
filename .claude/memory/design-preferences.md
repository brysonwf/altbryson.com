---
name: design-preferences
description: Bryson's visual and behaviour preferences for the altbryson desktop (crisp flat icons, real-size phones, real macOS behaviour)
metadata:
  type: feedback
---
Bryson's feedback on this site (2026-10-12):
- Icons must be crisp: no glows, no soft shadows on solid shapes, thin strokes. Status/system icons are flat glyphs with no background tile, all the same visual height and with equal gaps between them (measured, not eyeballed; see `TRAY_FIT`).
- Match current macOS closely, including icon shapes: e.g. Terminal is a single dark tile with a >_ prompt, not a screen drawn inside a separate tile. When unsure how something looks on macOS today, say so and match the current design.
- Use the app's own icon in the dock when it has one; only draw new ones for apps without icons. The Baseless icon is its parachute over a yellow sunset sky.
- Phones render at real size (375px wide), never scaled down.
- Mimic real macOS behaviour (minimize into the dock, dock max size 128px, Trash on the desktop, windows never under the dock) and real app UIs (the Google Chat demo should look like Google Chat on the web at phone width; browser tabs fill the titlebar to its top edge like Chrome on Windows).
- Menus list the standard items even when a website can't do them; those are greyed out rather than dropped.
- Release stage uses Greek α/β in the count-badge style, not rubber stamps.
- Joke features are welcome: the Calculator is confidently wrong on purpose; Terminal always replies "Have you tried turning it off and on again?"; Trash holds "IMPORTANT - DO NOT DELETE.txt" which restores itself.
- Requests often arrive mid-task and get refined quickly ("actually add the icons back"); keep removals easy to undo (separate commits, so a git revert restores them cleanly).
**How to apply:** check new icons/visuals in a headless render on light and dark wallpapers before calling them done.
