# Pastab

**Bulk Copy & Paste Tab URLs** | **タブURL一括コピー＆ペースト**

A simple Chrome extension to copy all your open tab URLs at once and paste URLs to open multiple tabs.

開いているタブのURLをまとめてコピー・ペーストできるシンプルなChrome拡張機能です。

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Chrome Web Store](https://img.shields.io/badge/Chrome%20Web%20Store-coming%20soon-green.svg)](#installation)

---

## Features / 機能

### Copy / コピー
- Copy all open tab URLs with one click
- Multiple output formats:
  - **Text** - URLs only
  - **Text + Title** - Title and URL
  - **Markdown** - `[Title](URL)` format
  - **HTML** - `<a href>` links
  - **JSON** - Developer-friendly format
  - **Custom** - Your own template with `$url`, `$title`, `$date`

### Paste / ペースト
- Paste URLs from clipboard to open multiple tabs at once
- Automatically extracts URLs from any text

### Options / オプション
- Copy only highlighted (selected) tabs
- Copy tabs from all windows
- Keyboard shortcuts (Alt+C / Alt+V)
- Notification on/off

---

## Installation / インストール

### Chrome Web Store (Recommended)
Coming soon...

<!--
[![Available in the Chrome Web Store](https://storage.googleapis.com/web-dev-uploads/image/WlD8wC6g8khYWPJUsQceQkhXSlv1/UV4C4ybeBTsZt43U4xis.png)](https://chrome.google.com/webstore/detail/pastab/YOUR_EXTENSION_ID)
-->

### Manual Installation / 手動インストール

1. Download or clone this repository
   ```bash
   git clone https://github.com/s-kawalab/Pastab.git
   ```

2. Open Chrome and navigate to `chrome://extensions/`

3. Enable **Developer mode** (toggle in the top right)

4. Click **Load unpacked** and select the `Pastab` folder

---

## Usage / 使い方

### Basic Usage

1. Click the Pastab icon in the toolbar
2. Select your preferred format
3. Click **Copy** to copy all tab URLs
4. Click **Paste** to open URLs from clipboard

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Alt+C` | Copy all tab URLs |
| `Alt+V` | Paste URLs (open in new tabs) |

You can customize shortcuts at `chrome://extensions/shortcuts`

---

## Screenshots / スクリーンショット

<!-- Add screenshots here -->
Coming soon...

---

## Permissions / 権限

| Permission | Purpose / 目的 |
|------------|----------------|
| `tabs` | Access tab URLs and titles / タブのURL・タイトルを取得 |
| `clipboardRead` | Read URLs from clipboard / クリップボードからURL読み取り |
| `clipboardWrite` | Copy URLs to clipboard / クリップボードにコピー |
| `storage` | Save user preferences / 設定を保存 |
| `notifications` | Show copy/paste notifications / 通知を表示 |
| `offscreen` | Clipboard operations in background / バックグラウンドでのクリップボード操作 |

---

## Privacy / プライバシー

Pastab respects your privacy:

- **No data collection** - We don't collect any personal data
- **No external servers** - All data stays in your browser
- **No tracking** - No analytics or tracking tools
- **No ads** - Completely ad-free

See [Privacy Policy](privacy-policy.html) for details.

---

## Development / 開発

### Project Structure

```
Pastab/
├── manifest.json          # Extension manifest
├── popup.html             # Popup UI
├── options.html           # Settings page
├── offscreen.html         # Clipboard operations
├── src/
│   ├── background.js      # Service worker
│   ├── popup.js           # Popup logic
│   ├── options.js         # Settings logic
│   ├── offscreen.js       # Clipboard handler
│   ├── styles/
│   │   ├── popup.css
│   │   └── options.css
│   └── utils/
│       ├── storage.js     # Storage utilities
│       ├── formatter.js   # URL formatting
│       └── i18n.js        # Internationalization
├── _locales/
│   ├── en/messages.json   # English
│   └── ja/messages.json   # Japanese
├── icons/
│   └── icon*.png
├── LICENSE
├── privacy-policy.html
└── README.md
```

### Building

No build step required. The extension can be loaded directly in Chrome.

### Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License / ライセンス

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Author / 作者

**Kawalab**

---

## Changelog / 変更履歴

### v1.0.0 (2026-01)
- Initial release
- Basic copy/paste functionality
- Multiple output formats
- Keyboard shortcuts
- i18n support (English/Japanese)
