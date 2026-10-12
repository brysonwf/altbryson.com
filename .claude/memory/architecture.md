---
name: architecture
description: How the single-file altbryson.com desktop is built: dock, icons, windows, projects, desktop docs, Google Voice Tray demo
metadata:
  type: project
---
The whole site is one file, `public/index.html` (inline CSS + one inline script, no build, no framework). It's a desktop with no top menu bar (that's the point of the site; see the critique doc on the desktop).

- **Dock** (`DOCK` array): altbryson menu icon, Terminal, Calculator | phone projects | LinkedIn, X, GitHub | system tray: 3 Google Voice Tray icons, Weather, Bluetooth, Battery, Wi-Fi, Spotlight, Settings, Clock. Icon size `--size` scales with the viewport up to macOS's 128px max; magnification is capped so the dock never leaves the screen; ≤1000px wide the dock scrolls sideways.
- **Icons**: `ICONS` holds 100×100 SVG bodies; `IMG_ICONS` uses an app's real icon (budgetforecast, road, baseless) from `public/icons/`. System-tray icons are flat white glyphs with no tile (`.app-icon.icon-*` list near the top of the CSS). The clock is a 2:1 tile (`ICON_VIEWBOX`) showing only h:mm.
- **Windows** (`openWindow`): draggable by titlebar (or any `[data-drag]` area), resizable from every edge (`RESIZE_DIRS`), green = full screen above the dock, yellow = minimize into the dock icon (state kept; reopening restores). `resizable: false` for Calculator.
- **Projects** (`PROJECTS`): phone apps load live in an iframe inside a phone frame at a true 375px viewport (no scaling), screen height ≤667px; the screenshot `public/<id>.png` shows behind the iframe while it loads. `stage: 'alpha' | 'beta'` shows α/β in the same red badge style as unread counts.
- **Desktop**: documents on the right (`DESK_DOCS`: Built with Claude, resume placeholder "Bryson Faggart's Resume.pdf", The Menu Bar Problem critique, Legal Disclaimer) and the Trash bottom-right (not in the dock). Single click selects, double-click opens; touch opens on tap.
- **Google Voice Tray demo**: the 3 tray icons (circle = Messages, triangle = Voicemail, square = Chat) are grey at 0 unread, green when unread, exactly like the real app. Clicking opens a 375×667-ish drawer bottom-right with demo screens (fictional names, 555 numbers); right-click gives the app's real tray menu. Every screen has a "Get it on GitHub" bar → github.com/brysonwf/googlevoicetray (no releases published yet).
- **Fixed fake status**: battery is always 42% not charging, Wi-Fi 2 of 3 bars, Bluetooth lists "MX Master" connected, weather is always Carolina Beach, NC (Open-Meteo, no visitor location).
- LinkedIn/X/GitHub block framing, so they open a browser-style window: GitHub is rebuilt from the public API; LinkedIn/X explain and link out.
- `screenshot.js` (Puppeteer) re-captures the phone screenshots at 390×844: `node screenshot.js`.
