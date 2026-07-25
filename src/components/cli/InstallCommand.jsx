'use client';
import { useState } from 'react';

// The install line with a copy button. Client-only because it touches the
// clipboard and holds the "copied" flash state.
export default function InstallCommand({ command }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard can be blocked (insecure context, denied permission).
      // The command is on screen to select by hand, so fail quietly.
    }
  };

  return (
    <div className="install-cmd">
      <code>
        <span className="tok">$</span> {command}
      </code>
      <button type="button" onClick={copy} aria-label="Copy install command">
        {copied ? 'copied' : 'copy'}
      </button>
    </div>
  );
}
