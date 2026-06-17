export function DemoBadge() {
  return (
    <div className="fixed bottom-4 right-4 z-50 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-pp-ink/85 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-white shadow-lg backdrop-blur">
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-pp-success opacity-75" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-pp-success" />
      </span>
      Demo Mode
    </div>
  );
}
