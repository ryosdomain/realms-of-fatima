# Project map

This is a Next.js App Router project for a reading site and a private author
studio. The map below covers the current source files; generated dependencies,
build output, and local environment files are intentionally excluded.

## Routes and app shell

```text
app/
├── page.tsx                 Public home/story page (route: /)
├── layout.tsx               Root layout, fonts, metadata, shared header/footer
├── globals.css              Tailwind import and global styles
├── favicon.ico              Browser icon
├── login/
│   ├── page.tsx              Author sign-in screen (route: /login)
│   └── actions.ts            Supabase password sign-in action
└── admin/
    ├── layout.tsx            Protects admin routes with the auth check
    ├── page.tsx              Author studio dashboard (route: /admin)
    ├── actions.ts            Sign-out server action
    └── editor/
        └── page.tsx          Book/story editor UI (route: /admin/editor)
```

## Shared UI

```text
components/
├── Header.tsx                Public-site header and mobile navigation
├── Footer.tsx                Public-site footer
├── Logo.tsx                  Shared Tale & Ink logo
├── HeroSection.tsx           Featured story reader and page controls
├── MordernBookCard.tsx       Book listing card
├── BookCover.tsx             Reusable book-cover presentation
├── SideBar.tsx               Author-studio navigation and sign-out
└── StatCard.tsx              Dashboard statistic card
```

## Server helpers

```text
lib/
├── auth.ts                   Requires a signed-in Supabase user
└── supabase/
    └── server.ts             Creates a cookie-aware Supabase server client
```

## Root configuration and assets

```text
.
├── package.json              Scripts and dependencies
├── package-lock.json         Locked npm dependency versions
├── next.config.ts            Next.js configuration
├── tsconfig.json             TypeScript settings and @/* path alias
├── eslint.config.mjs         ESLint configuration
├── next-env.d.ts             Generated Next.js TypeScript declarations
├── .gitignore                Git ignore rules
├── AGENTS.md                 Repository-specific agent guidance
├── README.md                 Setup and project information
└── public/                   Static assets served from the site root
    ├── file.svg
    ├── globe.svg
    ├── next.svg
    ├── vercel.svg
    └── window.svg
```

## Useful commands

- `npm run dev` — start the development server
- `npm run lint` — run ESLint
- `npm run build` — create a production build
- `npm run start` — serve a production build
