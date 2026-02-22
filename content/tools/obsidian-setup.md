---
title: "My Obsidian Setup"
date: 2026-02-05T08:00:00+07:00
draft: false
author: "Anawin A."
description: "How I set up Obsidian for a clean, focused note-taking experience — plugins, themes, and folder structure."
tags: ["obsidian", "tools", "productivity"]
image: ""
---

# My Obsidian Setup ⚡

Obsidian is a powerful note-taking app that stores notes as plain Markdown files. Here's how I use it.

## Folder Structure

```
📁 Vault/
├── 📁 00 - Inbox/        ← Capture everything here first
├── 📁 01 - Notes/        ← Processed, permanent notes
│   ├── 📁 Language/
│   ├── 📁 Programming/
│   └── 📁 Ideas/
├── 📁 02 - Projects/     ← Active project notes
├── 📁 03 - Archive/      ← Completed / old
└── 📁 Templates/         ← Note templates
```

## Core Plugins I Enable

| Plugin | Purpose |
|--------|---------|
| **Templates** | Built-in — auto-fill frontmatter |
| **Daily Notes** | Built-in — journal entries |
| **Dataview** | Query notes like a database |
| **Templater** | Advanced templating with JS |
| **Kanban** | Visual project boards |

## My Note Template

```markdown
---
title: "{{title}}"
date: {{date:YYYY-MM-DD}}
tags: []
---

# {{title}}

## Summary

## Notes

## References
```

## Themes

I use **Minimal** theme with:

```
Settings → Appearance → Minimal Theme Settings:
✓ Color scheme: Dark
✓ Body font: Inter
✓ Monospace font: JetBrains Mono
```

## Key Shortcuts I Use Daily

| Shortcut | Action |
|----------|--------|
| `Ctrl+P` | Command palette |
| `Ctrl+O` | Quick open |
| `Ctrl+Shift+F` | Global search |
| `Ctrl+E` | Toggle edit/preview |
| `[[` | Create a link |

> A note-taking system is only useful if you actually use it. Keep it simple!

---

What's your setup? Let me know in the comments below. 👇
