---
title: "CSS Tricks I Use Every Day"
date: 2026-02-01T14:30:00+07:00
draft: false
author: "Anawin A."
description: "Modern CSS techniques that make styling cleaner and more powerful — nesting, variables, container queries, and more."
tags: ["css", "web", "design", "tips"]
image: ""
---

# CSS Tricks Worth Knowing 🎨

Modern CSS is incredibly powerful. Here are the tricks I reach for daily.

## 1. CSS Nesting (No Sass Needed!)

```css
.card {
  background: white;
  border-radius: 12px;

  /* Nested selector — now native CSS! */
  & .card-title {
    font-weight: 700;
    color: #1a1a1a;
  }

  &:hover {
    box-shadow: 0 4px 16px rgba(0,0,0,0.1);
    transform: translateY(-2px);
  }
}
```

## 2. CSS Custom Properties

```css
:root {
  --color-accent: #f59e0b;
  --radius: 12px;
  --transition: 0.2s ease;
}

.button {
  background: var(--color-accent);
  border-radius: var(--radius);
  transition: all var(--transition);
}
```

## 3. `clamp()` for Fluid Typography

```css
h1 {
  /* min 1.5rem → preferred 5vw → max 3rem */
  font-size: clamp(1.5rem, 5vw, 3rem);
}
```

No media queries needed! 🎉

## 4. Logical Properties

```css
/* Instead of margin-left */
.element {
  margin-inline-start: 1rem;
  padding-block: 0.5rem;
}
```

## 5. `:has()` Pseudo-class

```css
/* Style a card if it contains an image */
.card:has(img) {
  padding-top: 0;
}

/* Style form when its input is focused */
.form:has(input:focus) {
  box-shadow: 0 0 0 3px var(--color-accent);
}
```

## 6. Container Queries

```css
.card-container {
  container-type: inline-size;
}

@container (min-width: 400px) {
  .card {
    flex-direction: row;
  }
}
```

---

> CSS in 2026 is genuinely fun to write. Embrace the new stuff!

Which of these do you already use? 🤔
