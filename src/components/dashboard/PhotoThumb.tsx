"use client";

import { useState } from "react";

// A clickable progress-photo thumbnail that opens the full image in an in-UI
// lightbox modal. Used on the client check-in page and the coach review page.
export function PhotoThumb({
  src,
  dateLabel,
  weight,
  imgClassName,
  caption = false,
}: {
  src: string;
  dateLabel: string;
  weight?: number | null;
  imgClassName?: string;
  caption?: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="shrink-0 text-left">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={`Progress photo from ${dateLabel}`}
          className={imgClassName ?? "h-28 w-28 rounded-lg border border-ink-600 object-cover transition hover:border-ember"}
        />
        {caption && (
          <p className="mt-1.5 text-center text-xs text-ash">
            {dateLabel}
            {weight != null && <span className="ml-1 text-bone">· {weight} lbs</span>}
          </p>
        )}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div className="relative flex max-h-[90vh] max-w-3xl flex-col" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={`Progress photo from ${dateLabel}`}
              className="max-h-[85vh] w-auto rounded-lg border border-ink-600 object-contain"
            />
            <div className="mt-3 flex items-center justify-between gap-4">
              <p className="text-sm text-bone">
                {dateLabel}
                {weight != null && <span className="ml-2 text-ash">· {weight} lbs</span>}
              </p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg border border-ink-600 bg-ink-800 px-3 py-1.5 text-sm text-bone hover:border-ember"
              >
                Close ✕
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
