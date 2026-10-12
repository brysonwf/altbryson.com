---
name: design-preferences
description: Bryson's visual and behaviour preferences for the altbryson desktop (crisp flat icons, real-size phones, real macOS behaviour)
metadata:
  type: feedback
---
Bryson's feedback on this site (2026-10-12):
- Icons must be crisp: no glows, no soft shadows on solid shapes, thin strokes. Status/system icons are flat glyphs with no background tile, all the same visual size (~60% of the tile).
- Use the app's own icon in the dock when it has one; only draw new ones for apps without icons.
- Phones should render at real size (375px wide), not scaled down.
- Mimic real macOS behaviour (minimize into the dock, dock max size 128px, Trash on the desktop) and real app UIs (the Google Chat demo should look like Google Chat on the web at phone width).
- Release stage uses Greek α/β in the count-badge style, not rubber stamps.
- Joke features are welcome: the Calculator is confidently wrong on purpose; Terminal always replies "Have you tried turning it off and on again?"; Trash holds "IMPORTANT - DO NOT DELETE.txt" which restores itself.
**How to apply:** check new icons/visuals in a headless render on light and dark wallpapers before calling them done.
