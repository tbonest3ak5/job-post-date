# Job Post Date Finder - Chrome Extension

A simple Chrome extension that extracts and displays the posting date for job listings by reading JSON-LD structured data from job sites.

## Features

- 📅 Automatically finds the `datePosted` field from job posting structured data
- 🎨 Clean, modern popup interface
- ⚡ Works across multiple job sites (Lever, Greenhouse, Indeed, etc.)
- 🔍 Shows "Can't find date" message when date information is unavailable
- 📊 Displays both the full date and "days ago" for easy reference

## Installation

### Step 1: Generate Icons

Before loading the extension, you need to create the icon files:

1. Open `generate-icons.html` in your web browser (double-click the file)
2. The icons will be automatically generated and displayed
3. Right-click on each icon and select "Save image as..."
4. Save them as:
   - `icon16.png` (16x16 icon)
   - `icon48.png` (48x48 icon)
   - `icon128.png` (128x128 icon)
5. Place all three PNG files in the extension directory (same folder as manifest.json)

**Alternative:** If you have Python with Pillow installed, you can run:
```bash
pip install Pillow
python3 create_icons.py
```

### Step 2: Load Extension in Chrome

1. Open Google Chrome
2. Navigate to `chrome://extensions/`
3. Enable **Developer mode** (toggle switch in the top right corner)
4. Click **"Load unpacked"**
5. Select the `job-post-date` directory
6. The extension icon should now appear in your Chrome toolbar!

## How to Use

1. Visit any job posting page (e.g., on Lever, Greenhouse, Indeed, LinkedIn, etc.)
2. Click the **Job Post Date Finder** extension icon in your Chrome toolbar
3. The extension will:
   - Search for JSON-LD structured data on the page
   - Extract the `datePosted` field
   - Display the posting date in a beautiful popup
   - Show how many days ago the job was posted
4. If no date is found, you'll see a "Can't find date" message

## Technical Details

### How It Works

The extension searches for `<script type="application/ld+json">` tags in the page HTML, which contain structured data following the schema.org JobPosting format. For example:

```json
{
  "@context": "http://schema.org",
  "@type": "JobPosting",
  "title": "Software Engineer",
  "datePosted": "2025-11-04",
  ...
}
```

The extension extracts the `datePosted` value and presents it in a user-friendly format.

### Supported Formats

- Direct JobPosting objects
- JobPosting in arrays
- JobPosting within @graph structures (used by some sites)

### Files

- `manifest.json` - Extension configuration (Manifest V3)
- `content.js` - Content script that searches for and extracts the date
- `popup.html` - Popup interface HTML
- `popup.js` - Popup logic and messaging
- `styles.css` - Clean, modern styling
- `generate-icons.html` - Icon generator tool
- `create_icons.py` - Python script for icon generation (optional)

## Compatibility

- **Chrome Version:** Manifest V3 (Chrome 88+)
- **Job Sites:** Works with any site using schema.org JobPosting structured data
  - Lever
  - Greenhouse
  - Indeed
  - LinkedIn
  - Many others

## Privacy

This extension:
- ✅ Only reads page content when you click the extension icon
- ✅ Does not collect or transmit any data
- ✅ Does not require any special permissions beyond reading the active tab
- ✅ Runs entirely locally in your browser

## Troubleshooting

**Extension icon doesn't appear:**
- Make sure all three icon files (icon16.png, icon48.png, icon128.png) are in the extension directory
- Try reloading the extension from chrome://extensions/

**"Can't find date" message:**
- The page may not use schema.org JobPosting structured data
- Try using Chrome DevTools (Ctrl+Shift+F or Cmd+Shift+F) and search for "datePosted" to verify it exists
- Some sites may use different date formats or structures not currently supported

**Extension not loading:**
- Make sure Developer mode is enabled in chrome://extensions/
- Check for any error messages in the extension details
- Verify all files are present in the directory

## Development

Want to modify or extend the extension? Here's what you need to know:

1. Make changes to the source files
2. Go to `chrome://extensions/`
3. Click the refresh icon on the extension card to reload it
4. Test your changes

## License

Free to use and modify for personal or commercial purposes.

## Support

If you encounter any issues or have suggestions, feel free to open an issue or contribute improvements!

