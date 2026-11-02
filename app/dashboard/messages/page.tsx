import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { setMessageReadAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function MessagesAdmin() {
  await requireRole("shop", "/dashboard/messages");
  const messages = await db.message.findMany({ orderBy: { createdAt: "desc" }, take: 100 });
  if (!messages.length) return <p className="rounded-card bg-card p-8 text-center text-ink-soft shadow-soft">No messages yet.</p>;
  return (
    <ul className="space-y-3">
      {messages.map((m) => (
        <li key={m.id} className={`rounded-card bg-card p-4 shadow-soft ${m.isRead ? "" : "ring-2 ring-gold/60"}`}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm"><span className="font-medium">{m.name}</span> · <a href={`mailto:${m.email}`} className="link-underline text-forest">{m.email}</a></p>
            <p className="text-xs text-ink-soft">{m.createdAt.toLocaleString("en-GB")}</p>
          </div>
          {m.subject && <p className="mt-1 font-medium">{m.subject}</p>}
          <p className="mt-1 whitespace-pre-wrap text-sm text-ink-soft">{m.body}</p>
          <form action={setMessageReadAction} className="mt-3">
            <input type="hidden" name="id" value={m.id} />
            <input type="hidden" name="read" value={m.isRead ? "0" : "1"} />
            <button className="rounded-full border border-black/10 px-4 py-1.5 text-xs font-medium transition hover:border-forest hover:text-forest">{m.isRead ? "Mark unread" : "Mark as read"}</button>
          </form>
        </li>
      ))}
    </ul>
  );
}
