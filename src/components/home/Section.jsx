import Reveal from '../Reveal';

// Every landing section is the same shell: a hatch band, then a bordered
// frame with an optional centred head. Kept in one place so the frame and
// hatch structure can't drift between sections — that drift is what broke
// the vertical rules before.
//
// Padding lives on the frame rather than the <section>: on the section it
// would sit outside the bordered column and break the rules between
// sections. Class strings are written out in full rather than interpolated,
// since Tailwind's scanner misses a utility glued to `${`.
export default function Section({
  id,
  label,
  icon,
  title,
  lead,
  gray,
  gutter,
  padTop,
  flush,
  hatch = true,
  // Put the head and the body in ONE .col rather than two. Matters in a
  // gutter section, where every .col draws its own side rules — two of
  // them would stack a seam between the head and the body.
  contained,
  children,
}) {
  const sectionCls = ['sec', gray && 'gray', padTop && 'pad-top-lg', flush && 'flush']
    .filter(Boolean).join(' ');
  const frameCls = gutter ? 'frame gutter-hatch' : 'frame';

  const head = title && (
    <Reveal className="sec-head">
      {label && (
        <div className="sec-eyebrow">
          {icon && <span className="ic">{icon}</span>} <span className="lbl">{label}</span>
        </div>
      )}
      <h2>{title}</h2>
      {lead && <p>{lead}</p>}
    </Reveal>
  );

  return (
    <>
      {hatch && <div className="hatch" />}
      <section className={sectionCls} id={id}>
        <div className={frameCls}>
          {contained ? (
            <div className="col">{head}{children}</div>
          ) : (
            <>
              {head && <div className="col">{head}</div>}
              {children}
            </>
          )}
        </div>
      </section>
    </>
  );
}
