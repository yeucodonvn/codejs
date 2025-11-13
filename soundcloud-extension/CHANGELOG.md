# Changelog

All notable changes to SoundCloud AutoPlay Extension will be documented in this file.

## [1.0.0] - 2025-01-13

### Added
- Initial release
- Auto-play functionality when music stops
- Auto-enable Shuffle mode
- Auto-enable Repeat All mode
- MAIN world execution context (bypass click detection)
- Update mechanism via GitHub
- Update scripts (check-update.bat, update.bat)

### Features
- Native click events (not detected by anti-bot)
- Console logging for debugging
- localStorage support for playlist URL
- Optional Like/Follow functionality (disabled by default)

---

## How to update

When a new version is released:

1. Run `check-update.bat` to check for updates
2. Run `update.bat` to pull latest changes
3. Reload extension in `chrome://extensions/`

---

## Version History Format

**[Version] - Date**
- Added: New features
- Changed: Changes in existing functionality
- Deprecated: Soon-to-be removed features
- Removed: Removed features
- Fixed: Bug fixes
- Security: Security improvements
