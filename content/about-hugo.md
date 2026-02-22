---
title: "Why I Use Hugo for Static Sites"
date: 2026-01-15T09:00:00+07:00
draft: false
author: "Anawin A."
description: "Hugo is blazing fast and perfect for note-taking websites. Here's why it's my go-to static site generator."
tags: ["hugo", "web", "tools"]
image: ""
---

# Why Hugo? 🚀

After trying many static site generators, I keep coming back to **Hugo**. Here's why.

## Speed

Hugo builds sites in milliseconds. No matter how many notes you have, it stays fast.

```bash
# Build the entire site
hugo

# Start dev server with drafts
hugo server -D

# Expected output:
#  Built in 45 ms
```

## Content Organization

Hugo's section system maps perfectly to folder-based note organization:

```
content/
├── welcome.md        → /welcome/
├── language/
│   └── japanese.md  → /language/japanese/
└── tools/
    └── obsidian.md  → /tools/obsidian/
```

## Frontmatter

```yaml
---
title: "My Note Title"
date: 2026-01-15
draft: false
author: "Anawin A."
description: "Short summary shown in note cards."
tags: ["tag1", "tag2"]
image: "/images/my-note.jpg"
---
```

## Why Not Alternatives?

| Tool | Pros | Cons |
|------|------|------|
| Hugo | Fast, simple, powerful | Go templates learning curve |
| Jekyll | Mature ecosystem | Slow for large sites |
| Gatsby | React-based, flexible | Heavy, complex |
| Eleventy | Very flexible | No built-in theme system |

Hugo wins on **speed + simplicity** every time.

> Fast by default, powerful when you need it.

Give it a try! 🎉
