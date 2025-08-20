# 📖 Minimal Blog with Next.js & shadcn/ui

This repository is a minimalistic blog platform built with:

- [Next.js App Router](https://nextjs.org/docs/app)
- [shadcn/ui](https://ui.shadcn.com) for UI components
- [Contentful](https://www.contentful.com) as a headless CMS
- Dark/light theme support (black dark mode)
- Simple passcode protection middleware

The site renders blog posts from Contentful (Markdown content + images) and displays them in a responsive grid with a clean reading view.

---

## 🚀 Features

- 🔐 **Passcode Gate** — access restricted by middleware (configurable code).
- 🌓 **Dark Mode** — black background dark theme toggle with `next-themes`.
- 🖼 **Image Grid** — Instagram-style responsive grid for blog posts.
- ✍️ **Markdown Rendering** — blog body rendered with `react-markdown` + GFM.
- ⚡ **Optimised** — Next.js `Image`, `Link`, and automatic static generation.

---

## 🛠 Getting Started

Clone the repo and install dependencies:

```bash
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>
pnpm install
```
