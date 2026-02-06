import React from 'react';

function createNode(type) {
  const id = `node-${type.toLowerCase()}-${Math.random().toString(16).slice(2, 8)}`;

  switch (type) {
    case 'Heading':
      return { id, type, props: { text: 'New Heading', level: 2 }, style: { textAlign: 'left' } };
    case 'Text':
      return { id, type, props: { text: 'New text block...', variant: 'normal' }, style: { textAlign: 'left' } };
    case 'Button':
      return { id, type, props: { text: 'Click me', variant: 'primary' }, style: {} };
    case 'Image':
      return { id, type, props: { alt: 'Placeholder image', src: '' }, style: {} };
    case 'Spacer':
      return { id, type, props: { height: 16 }, style: {} };
    default:
      return { id, type, props: {}, style: {} };
  }
}

// PUBLIC_INTERFACE
export default function ComponentPalette({ onAdd }) {
  /** Palette of available components for inserting into the canvas. */
  const items = [
    { type: 'Heading', label: 'Heading' },
    { type: 'Text', label: 'Text' },
    { type: 'Button', label: 'Button' },
    { type: 'Image', label: 'Image' },
    { type: 'Spacer', label: 'Spacer' },
  ];

  return (
    <div className="panel">
      <div className="panelHeader">
        <h2 className="panelTitle">Components</h2>
        <p className="panelHint">Click to add</p>
      </div>

      <div className="paletteGrid" role="list">
        {items.map((item) => (
          <button
            key={item.type}
            type="button"
            className="paletteItem"
            onClick={() => onAdd(createNode(item.type))}
          >
            <span className="paletteItemLabel">{item.label}</span>
            <span className="paletteItemMeta">{item.type}</span>
          </button>
        ))}
      </div>

      <div className="panelFooter">
        <p className="tinyText">
          Drag & drop can be added later—this keeps the state & rendering logic clean first.
        </p>
      </div>
    </div>
  );
}
