import Image from 'next/image';

// Shared chrome for every result view, so user/org/repo pages read as one
// system: a subject band, hatch-separated sections, and bento cell grids.

// Inner half, for callers that are already inside a .frame > .col
// (the loading skeleton in LiveResult) so frames never nest and double up.
export function ResultHeadInner({ avatar, alt, name, meta, bio, aside }) {
  return (
    <div className="flex flex-wrap items-center gap-5 py-8">
      {avatar && (
        <Image src={avatar} alt={alt} width={56} height={56} draggable={false} className="shrink-0 border border-line" />
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
      {/* Padding on the frame, not the section, so the vertical rules run
          unbroken into the hatch above and below. Both class strings are
          written out in full: interpolating (`frame py-14${...}`) glues
          the last class to `${` and Tailwind's scanner never emits it. */}
      <section>
        <div className={gutter ? 'frame py-14 gutter-hatch' : 'frame py-14'}>
          <div className="col result-col">
            {/* head is inset; the body runs flush to the column edge so
                its border lands on the column rule and meets the hatched
                gutter, instead of floating 24px inside it */}
            <div className="sec-inset">
              <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <div className="sec-eyebrow"><span className="lbl">{label}</span></div>
                  <h2 className="text-[32px] leading-tight">{title}</h2>
                </div>
                {control}
              </div>
              {note && <p className="mb-6 max-w-[70ch] text-[13px] leading-relaxed text-text-faint">{note}</p>}
            </div>
            <div className="sec-body">{children}</div>
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

// Bordered list block. Rows carry the same inset as a bento cell so the
// two read as one system, rather than bare hairlines floating in the column.
export function RowList({ children }) {
  return <ul className="row-list">{children}</ul>;
}

export function Row({ lead, when, title }) {
  return (
    <li>
      <div className="row-top">
        <span className="row-lead">{lead}</span>
        <span className="row-when">{when}</span>
      </div>
      <div className="row-title">{title}</div>
    </li>
  );
}

// Person cell shared by the org and repo views.
export function PersonCell({ avatar, login, meta, tag, onTrace }) {
  return (
    <div className="flex h-full flex-col items-start gap-4">
      <div className="flex items-center gap-4">
        <Image src={avatar} alt={`${login} avatar`} width={56} height={56} draggable={false} className="shrink-0 border border-line" />
        <div className="min-w-0">
          <div className="truncate font-mono text-[15px]">{login}</div>
          {meta && <div className="mt-1 font-mono text-[13px] leading-relaxed text-text-faint">{meta}</div>}
        </div>
      </div>
      {tag && (
        <span className="border border-line px-2 py-0.5 font-mono text-[11px] uppercase tracking-wide text-accent">
          {tag}
        </span>
      )}
      <button className="mt-auto font-mono text-[13px] text-accent hover:opacity-70" onClick={() => onTrace(login)}>
        Trace →
      </button>
    </div>
  );
}
