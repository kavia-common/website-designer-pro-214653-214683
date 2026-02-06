import React, { useMemo } from 'react';

function escapeHtml(text) {
  return String(text)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function generateExport(nodes) {
  const css = `
/* Retro-ish default styling */
:root{
  --bg:#f9fafb;
  --paper:#ffffff;
  --ink:#111827;
  --muted:#6b7280;
  --primary:#3b82f6;
  --accent:#06b6d4;
  --border:#e5e7eb;
  --shadow: 0 10px 30px rgba(0,0,0,.08);
  --radius: 14px;
  --mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  --sans: Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji","Segoe UI Emoji";
}
body{ margin:0; background:var(--bg); color:var(--ink); font-family:var(--sans); }
.wrapper{ max-width: 960px; margin: 40px auto; padding: 0 16px; }
.paper{ background:var(--paper); border:1px solid var(--border); border-radius:var(--radius); box-shadow:var(--shadow); padding: 28px; }
.btn{ appearance:none; border:1px solid var(--border); background:var(--primary); color:white; padding: 12px 16px; border-radius: 12px; font-weight:700; cursor:pointer; }
.btn.secondary{ background:white; color:var(--ink); }
.muted{ color:var(--muted); }
img{ max-width:100%; border-radius: 12px; border:1px solid var(--border); }
`;

  const htmlNodes = nodes
    .map((n) => {
      const style = n.style && Object.keys(n.style).length ? ` style="${escapeHtml(Object.entries(n.style).map(([k, v]) => `${k}:${v}`).join(';'))}"` : '';
      if (n.type === 'Heading') {
        const level = Math.min(6, Math.max(1, Number(n.props.level || 2)));
        return `<h${level}${style}>${escapeHtml(n.props.text || 'Heading')}</h${level}>`;
      }
      if (n.type === 'Text') {
        const cls = n.props.variant === 'muted' ? 'muted' : '';
        return `<p class="${cls}"${style}>${escapeHtml(n.props.text || 'Text')}</p>`;
      }
      if (n.type === 'Button') {
        const cls = n.props.variant === 'secondary' ? 'btn secondary' : 'btn';
        return `<button class="${cls}" type="button"${style}>${escapeHtml(n.props.text || 'Button')}</button>`;
      }
      if (n.type === 'Image') {
        const src = n.props.src || 'https://via.placeholder.com/640x240?text=Image';
        const alt = n.props.alt || 'Image';
        return `<img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}"${style} />`;
      }
      if (n.type === 'Spacer') {
        const h = Number(n.props.height || 16);
        return `<div style="height:${h}px"></div>`;
      }
      return `<!-- Unknown node: ${escapeHtml(n.type)} -->`;
    })
    .join('\n      ');

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Exported Site</title>
  <style>${css}</style>
</head>
<body>
  <div class="wrapper">
    <div class="paper">
      ${htmlNodes}
    </div>
  </div>
</body>
</html>`;

  return { html, css };
}

// PUBLIC_INTERFACE
export default function ExportModal({ open, nodes, onClose }) {
  /** Modal to preview and copy exported HTML/CSS. */
  const exportData = useMemo(() => generateExport(nodes), [nodes]);

  if (!open) return null;

  return (
    <div className="modalOverlay" role="dialog" aria-modal="true" aria-label="Export HTML and CSS">
      <div className="modal">
        <div className="modalHeader">
          <div>
            <div className="modalTitle">Export</div>
            <div className="modalSub">Copy the generated HTML/CSS below.</div>
          </div>
          <button type="button" className="iconBtn" onClick={onClose} aria-label="Close export modal">
            ✕
          </button>
        </div>

        <div className="modalBody">
          <div className="codeBlock">
            <div className="codeHeader">
              <span>HTML</span>
              <button
                type="button"
                className="smallBtn"
                onClick={() => navigator.clipboard.writeText(exportData.html)}
              >
                Copy
              </button>
            </div>
            <pre className="pre"><code>{exportData.html}</code></pre>
          </div>

          <div className="codeBlock">
            <div className="codeHeader">
              <span>CSS (inline in export too)</span>
              <button
                type="button"
                className="smallBtn"
                onClick={() => navigator.clipboard.writeText(exportData.css)}
              >
                Copy
              </button>
            </div>
            <pre className="pre"><code>{exportData.css}</code></pre>
          </div>
        </div>

        <div className="modalFooter">
          <button type="button" className="secondaryBtn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
