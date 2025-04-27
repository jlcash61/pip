---

# 📜 Final **CHANGELOG.md**

```markdown
# Changelog

All notable changes to this project are documented here.

---

# 📜 CHANGELOG.md

All notable changes to this project are documented here.

---

## [v1.3.0] – In Progress
### Added
- System prompt injection when creating a new thread
- Firestore-based dynamic system prompts
- Backend hardened to safely inject prompts even if missing
- Future-ready structure for Settings menu (Gear)


## v1.3.0 (In Progress)
- [Planned] Add system prompt injection when creating a new thread
- [Planned] Refine Assistant Dashboard instructions
- [Planned] Explore STT (Speech-to-Text) or TTS (Text-to-Speech) options
- [Planned] Begin basic Settings Gear menu
- [Planned] Minor visual polish if needed
- [Planned] Continuous improvements and code optimizations


## [1.2.10] – 2025-04-27
### Added
- Dynamic profile display (user picture and name after login)
- Hide/show Login and Logout buttons dynamically based on auth state
- Centered header title with responsive flex layout
- Full screen height layout with pinned footer
- Conversation bubbles staggered left/right with proper margins on speaker change

### Changed
- Smoothed out conversation loading and auto-scroll
- Tightened frontend CSS for bubble spacing consistency
- Cleaned DOM event attachment for login, logout, new thread, and send

### Notes
- Login is optional; "Demo Mode" fully functional.
- Backend architecture (Cloud Functions) complete for Assistant ID handling.
- This marks the final stable version of the 1.2 series — ready for future 1.3 features like settings menu, dark mode, or TTS integrations.

---

## [1.2.0] – 2025-04-25
### Added
- Core Firestore-based thread management
- OpenAI Assistant ID v2 conversation integration
- Create/Select/Delete threads functionality
- Basic frontend layout with conversation panel
- Backend Cloud Functions for `sendMessage` and `getThreadMessages`
- Demo mode fallback when no login

---

## [1.1.0] – 2025-04-20
- Initial stable base version: Firestore and OpenAI API wired together
- Basic conversation working via Assistant ID API