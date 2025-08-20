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
git clone https://github.com/joshua-grimmett/photos-blog.git
cd photos-blog
pnpm install
```

Run the development server:

```bash
pnpm dev
```

Then open [http://localhost:3000](http://localhost:3000).

---

## 🔧 Environment Variables

Create a `.env.local` file with your Contentful credentials:

```env
NEXT_PUBLIC_CONTENTFUL_SPACE_ID=xxxxxxx
NEXT_PUBLIC_CONTENTFUL_DELIVERY_TOKEN=xxxxxxx
SITE_PASSCODE=xxxx
```

---

## 📂 Project Structure

```
app/
  layout.tsx          # Layout with navigation + theme toggle
  page.tsx            # Home page with blog grid
  blog/[slug]/page.tsx # Individual blog post
  unlock/             # Passcode unlock page
components/ui/        # shadcn/ui components
app/utils/contentful.ts # Contentful data fetching
middleware.ts         # Passcode protection
```

---

## 📦 Deployment

This project is optimised for [Vercel](https://vercel.com).
Push to GitHub and import the repo in Vercel for instant CI/CD.

---

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a PR if you’d like to improve functionality or design.

---

## 📜 License

MIT © [Josh Grimmett](https://github.com/joshua-grimmett)
