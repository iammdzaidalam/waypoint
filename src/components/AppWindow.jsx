// A browser-style app window for homepage previews. Same traffic-light
// chrome as the terminal, but a light body and a URL pill instead of a
// title - because the homepage sells the web app, not the terminal.
export function AppWindow({ url, children }) {
  return (
    <div className="app-window">
      <div className="app-bar">
        <span className="demo-dot close" />
        <span className="demo-dot min" />
        <span className="demo-dot max" />
        {url && <span className="app-url">{url}</span>}
      </div>
      <div className="app-body">{children}</div>
    </div>
  );
}

// Web-result building blocks, so each preview reads like the real result
// pages rather than ad-hoc markup.

export function AppId({ initial, name, sub }) {
  return (
    <div className="wp-id">
      <span className="wp-avatar" aria-hidden="true">{initial}</span>
      <div>
        <div className="wp-name">{name}</div>
        <div className="wp-sub">{sub}</div>
      </div>
    </div>
  );
}

export function AppStats({ items }) {
  return (
    <div className="wp-stats">
      {items.map(([value, label, tone]) => (
        <div className="wp-stat" key={label}>
          <div className={`wp-val${tone ? ` ${tone}` : ''}`}>{value}</div>
          <div className="wp-lbl">{label}</div>
        </div>
      ))}
    </div>
  );
}

export function AppRows({ children }) {
  return <div className="wp-rows">{children}</div>;
}

export function AppRow({ lead, main, trail, tone }) {
  return (
    <div className="wp-row">
      {lead && <span className={`wp-tag${tone ? ` ${tone}` : ''}`}>{lead}</span>}
      <span className="wp-main">{main}</span>
      {trail && <span className="wp-trail">{trail}</span>}
    </div>
  );
}
