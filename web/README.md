# Web - Next.js Application

A modern Next.js application built with TypeScript and Shadcn UI.

## Features

- **Next.js App Router**: Uses the latest Next.js 14 with App Directory structure
- **TypeScript**: Type-safe development experience
- **Shadcn UI**: Beautiful, accessible, and customizable components
- **Tailwind CSS**: Utility-first CSS framework
- **ESLint**: Code quality and consistency

## Getting Started

### Prerequisites

- Node.js (version 18.17 or later)
- npm (included with Node.js)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd web
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
web/
├── public/              # Static assets
├── src/
│   ├── app/             # App router pages
│   │   ├── about/       # About page
│   │   ├── dashboard/   # Dashboard page
│   │   ├── layout.tsx   # Root layout
│   │   └── page.tsx     # Home page
│   ├── components/      # React components
│   │   ├── layout/      # Layout components
│   │   └── ui/          # UI components (Shadcn UI)
│   └── lib/             # Utility functions and libraries
├── .eslintrc.json       # ESLint configuration
├── next.config.js       # Next.js configuration
├── package.json         # Project dependencies
├── tailwind.config.ts   # Tailwind CSS configuration
└── tsconfig.json        # TypeScript configuration
```

## Adding New Components

This project uses Shadcn UI for components. To add a new component:

```bash
npx shadcn@latest add <component-name>
```

Example:

```bash
npx shadcn@latest add dropdown-menu
```

## Building for Production

```bash
npm run build
```

Then start the production server:

```bash
npm start
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Shadcn UI Documentation](https://ui.shadcn.com)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
