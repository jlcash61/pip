
---

## 📜 Updated CHANGELOG.md

You definitely want to add a new **[1.1]** block to document your changes.

---

**UPDATED CHANGELOG.md draft:**

```markdown
# 📜 PiP Assistant Changelog

All notable changes to this project will be documented here.

---

## [1.2] – 2025-04-26
### Added
- Google authentication (login/logout) via Firebase.
- Per-user thread lists tied to authenticated user ID.
- Highlighting of currently active thread in thread list.
- Fix race condition by deferring thread load until after auth detection.

### Notes
- "New Thread" button still pending.
- Firestore security rules pending (future 1.2.x or 1.3).


---

## [1.1] – 2025-04-26
### Added
- Firestore integration for saving thread IDs under user profiles.
- Frontend thread listing with live clickable threads.
- Frontend auto-load of previous conversation history.
- Secure backend fetching of conversation messages (no API key exposure).

### Changed
- Backend expanded to include `getThreadMessages` function.
- Frontend updated to use Firestore reads and Cloud Function fetching.

### Notes
- Threads now persist independently in Firestore.
- Still no long-term memory or PXE soul yet.

---

## [1.0] – 2025-04-24
### Added
- Initial backend function to create and manage a persistent OpenAI Assistant thread.
- Basic frontend with vanilla HTML, modular JavaScript, and style separation.
- Secure OpenAI key + assistant ID storage via Firebase functions config.
- Basic conversation logging to the browser without backend database storage.

---

## [Future Planned Versions]
- **v1.2** — Google Auth integration and per-user thread management
- **v1.3** — System Prompt Injection
- **v2.0** — Function Calling and Memory Layers
