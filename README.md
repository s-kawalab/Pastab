<div align="center">

<img src="icons/icon128.png" alt="Pastab" width="120" height="120">

# Pastab

### Bulk Copy & Paste Tab URLs in One Click

**Copy all your tabs. Open them anywhere.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)
[![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-4285F4?style=for-the-badge&logo=googlechrome&logoColor=white)](#installation)
[![Manifest V3](https://img.shields.io/badge/Manifest-V3-green?style=for-the-badge)](#)

[Features](#features) • [Installation](#installation) • [Usage](#usage) • [Privacy](#privacy)

</div>

---

## Why Pastab?

Ever needed to **save all your browser tabs** and reopen them later? Or **share multiple links** with a colleague? Pastab makes it effortless.

- **One-click copy** — Grab all tab URLs instantly
- **One-click paste** — Open multiple URLs at once
- **Multiple formats** — Text, Markdown, HTML, JSON, or custom templates
- **Keyboard shortcuts** — `Alt+C` to copy, `Alt+V` to paste
- **100% Private** — No data leaves your browser

---

## Features

<table>
<tr>
<td width="50%">

### Copy

- Copy all open tab URLs with one click
- Choose from multiple output formats:
  - **Text** — URLs only
  - **Text + Title** — Title and URL
  - **Markdown** — `[Title](URL)`
  - **HTML** — `<a href>` links
  - **JSON** — Developer-friendly
  - **Custom** — Your own template

</td>
<td width="50%">

### Paste

- Paste URLs from clipboard
- Opens multiple tabs instantly
- Auto-extracts URLs from any text
- Works with any text format

</td>
</tr>
</table>

### Options

| Setting | Description |
|---------|-------------|
| Selected tabs only | Copy only highlighted tabs |
| All windows | Copy tabs from all browser windows |
| Keyboard shortcuts | Customizable hotkeys |
| Notifications | Toggle success messages |

---

## Installation

### Chrome Web Store

Coming soon...

### Manual Installation

```bash
# Clone the repository
git clone https://github.com/s-kawalab/Pastab.git
```

1. Open `chrome://extensions/`
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select the `Pastab` folder

---

## Usage

### Quick Start

| Action | Method |
|--------|--------|
| Copy all tabs | Click **Copy** or press `Alt+C` |
| Paste URLs | Click **Paste** or press `Alt+V` |
| Change format | Select from dropdown |
| Settings | Click the gear icon |

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Alt+C` | Copy all tab URLs |
| `Alt+V` | Open URLs from clipboard |

Customize at `chrome://extensions/shortcuts`

---

## Privacy

<table>
<tr>
<td>

**Your data stays with you.**

Pastab processes everything locally. No servers, no tracking, no data collection.

</td>
<td>

| | |
|---|---|
| Data collection | None |
| External servers | None |
| Analytics | None |
| Ads | None |

</td>
</tr>
</table>

[View Privacy Policy](https://s-kawalab.github.io/Pastab/privacy-policy.html)

---

## Permissions

| Permission | Why it's needed |
|------------|-----------------|
| `tabs` | Read tab URLs and titles |
| `clipboardRead` | Paste URLs from clipboard |
| `clipboardWrite` | Copy URLs to clipboard |
| `storage` | Save your preferences |
| `notifications` | Show success messages |
| `offscreen` | Clipboard operations |

---

## Development

<details>
<summary><b>Project Structure</b></summary>

```
Pastab/
├── manifest.json
├── popup.html / options.html
├── src/
│   ├── background.js
│   ├── popup.js / options.js
│   ├── styles/
│   └── utils/
├── _locales/
│   ├── en/
│   └── ja/
└── icons/
```

</details>

<details>
<summary><b>Contributing</b></summary>

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

</details>

---

<div align="center">

## License

MIT License © 2026 [Kawalab](https://github.com/s-kawalab)

---

**Made with ❤️ for tab hoarders everywhere**

[Report Bug](https://github.com/s-kawalab/Pastab/issues) • [Request Feature](https://github.com/s-kawalab/Pastab/issues)

</div>
