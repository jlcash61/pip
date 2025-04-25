# 📜 PiP Assistant Changelog

All notable changes to this project will be documented here.

---

## [1.0] – 2025-04-24
### Added
- Initial backend function to create and manage a persistent OpenAI Assistant thread.
- Basic frontend with vanilla HTML, modular JavaScript, and style separation.
- Secure OpenAI key + assistant ID storage via Firebase functions config.
- Basic conversation logging to the browser without backend database storage.

### Notes
- Single shared thread across all sessions (not per-user yet).
- No memory, no soul seed, no function calling yet.

---

## [Future Planned Versions]
- **v1.1** — Thread Reset Functionality
- **v1.2** — Multi-Thread Management
- **v1.3** — System Prompt Injection
- **v2.0** — Function Calling and Memory Layers