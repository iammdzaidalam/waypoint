// A macOS terminal window. Chrome only — callers supply the output lines.
export default function TerminalWindow({ title, children }) {
  return (
    <div className="demo-window">
      <div className="demo-bar">
        <span className="demo-dot close" />
        <span className="demo-dot min" />
        <span className="demo-dot max" />
        <span className="demo-title">{title}</span>
      </div>
      <div className="demo-body">{children}</div>
    </div>
  );
}
