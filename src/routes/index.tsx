import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Hello World — A little beginning" },
      { name: "description", content: "A simple Hello World page. Every great thing starts somewhere." },
      { property: "og:title", content: "Hello World — A little beginning" },
      { property: "og:description", content: "A simple Hello World page. Every great thing starts somewhere." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="hello-page flex min-h-svh flex-col px-7 sm:px-14">
      <header className="flex items-center justify-between border-b border-border py-7">
        <span className="font-mono text-sm font-semibold">hello<span className="text-primary">.</span></span>
        <span className="font-mono text-xs text-muted-foreground">A LITTLE BEGINNING</span>
      </header>
      <main className="flex flex-1 flex-col items-center justify-center py-20 text-center">
        <div className="mb-9 flex h-24 w-24 items-center justify-center rounded-full bg-accent text-primary">
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none" stroke="currentColor" strokeWidth="1.5" aria-label="Globe" role="img">
            <circle cx="28" cy="28" r="22" />
            <ellipse cx="28" cy="28" rx="10" ry="22" />
            <path d="M6 28h44M10 16h36M10 40h36" />
          </svg>
        </div>
        <p className="mb-5 font-mono text-xs text-primary">01 / THE FIRST CHAPTER</p>
        <h1 className="text-6xl font-semibold leading-tight sm:text-8xl">Hello, world<span className="text-primary">.</span></h1>
        <p className="mt-6 text-base text-muted-foreground sm:text-lg">Every great thing starts somewhere.</p>
        <div className="mt-12 flex items-center gap-3 font-mono text-xs text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          <span>Small page. Endless possibilities.</span>
        </div>
      </main>
      <footer className="flex items-center justify-between gap-4 border-t border-border py-6 font-mono text-xs text-muted-foreground">
        <span>Made with a little curiosity.</span>
        <span>&lt;/&gt;</span>
      </footer>
    </div>
  );
}
