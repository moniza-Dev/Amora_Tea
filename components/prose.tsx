import { Fragment, type ReactNode } from "react";

// Tiny renderer for the seeded blog markdown: ## headings, - bullets, 1. lists, **bold**, paragraphs.
const inline = (t: string): ReactNode[] => t.split(/(\*\*[^*]+\*\*)/g).map((s, i) => (s.startsWith("**") ? <strong key={i}>{s.slice(2, -2)}</strong> : <Fragment key={i}>{s}</Fragment>));

export function Prose({ source }: { source: string }) {
  return (
    <div className="space-y-4 leading-relaxed [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-semibold [&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:mt-1.5">
      {source.split(/\n{2,}/).map((block, i) => {
        const lines = block.trim().split("\n");
        if (lines[0].startsWith("## ")) return <Fragment key={i}><h2>{lines[0].slice(3)}</h2>{lines.length > 1 && <p>{inline(lines.slice(1).join(" "))}</p>}</Fragment>;
        if (lines.every((l) => l.startsWith("- "))) return <ul key={i}>{lines.map((l, j) => <li key={j}>{inline(l.slice(2))}</li>)}</ul>;
        if (lines.every((l) => /^\d+\.\s/.test(l))) return <ol key={i}>{lines.map((l, j) => <li key={j}>{inline(l.replace(/^\d+\.\s/, ""))}</li>)}</ol>;
        return <p key={i}>{inline(lines.join(" "))}</p>;
      })}
    </div>
  );
}
