import Image from 'next/image';

// Shared chrome for every result view, so user/org/repo pages read as one
// system: a subject band, hatch-separated sections, and bento cell grids.

// Inner half, for callers that are already inside a .frame > .col
// (the loading skeleton in LiveResult) so frames never nest and double up.
export function ResultHeadInner({ avatar, alt, name, meta, bio, aside }) {
  return (
    <div className="flex flex-wrap items-center gap-5 py-8">
      {avatar && (
        <Image src={avatar} alt={alt} width={56} height={56} className="shrink-0 border border-line" />
      )}
      <div className="min-w-0 flex-1">
        <div className="text-[26px] leading-tight font-medium">{name}</div>
        <div className="font-mono text-[13px] text-text-dim">{meta}</div>
        {bio && <p className="mt-1.5 max-w-[70ch] text-sm text-text-dim">{bio}</p>}
      </div>
      {aside && <div className="font-mono text-xs text-text-dim sm:text-right">{aside}</div>}
    </div>
  );
}

export function ResultHead(props) {
  return (
    <div className="frame border-b border-line">
      <div className="col">
        <ResultHeadInner {...props} />
      </div>
    </div>
  );
}

export function ResultSection({ label, title, note, control, children, gutter }) {
  return (
    <>
      <div className="hatch" />
      <section className="py-14">
        <div className={`frame${gutter ? ' gutter-hatch' : ''}`}>
          <div className="col">
            <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
              <div>
                <div className="sec-eyebrow"><span className="lbl">{label}</span></div>
                <h2 className="text-[32px] leading-tight">{title}</h2>
              </div>
              {control}
            </div>
            {note && <p className="mb-6 max-w-[70ch] text-[13px] leading-relaxed text-text-faint">{note}</p>}
            {children}
          </div>
        </div>
      </section>
    </>
  );
}

// Bento grid: cells divided by hairlines, no gaps, no radius, no shadow.
export function Bento({ cols = 3, children }) {
  return <div className={`cell-grid cols-${cols}`}>{children}</div>;
}

export function StatCell({ value, label }) {
  return (
    <div>
      <div className="text-[34px] leading-none font-medium">{value}</div>
      <div className="mt-2 font-mono text-[11px] uppercase tracking-wider text-text-faint">{label}</div>
    </div>
  );
}
