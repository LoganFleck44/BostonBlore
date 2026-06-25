export function NaturalBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-ember/40 bg-ember/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-flame ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-ember" />
      100% Natural
    </span>
  );
}
