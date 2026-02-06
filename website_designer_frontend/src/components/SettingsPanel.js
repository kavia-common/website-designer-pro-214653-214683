import React from 'react';

function LabeledInput({ label, children }) {
  return (
    <label className="field">
      <div className="fieldLabel">{label}</div>
      <div className="fieldControl">{children}</div>
    </label>
  );
}

// PUBLIC_INTERFACE
export default function SettingsPanel({ selectedNode, onUpdateProps, onUpdateStyle, onDelete }) {
  /** Right-side settings panel for editing node properties and basic styles. */
  if (!selectedNode) {
    return (
      <div className="panel">
        <div className="panelHeader">
          <h2 className="panelTitle">Settings</h2>
          <p className="panelHint">Select an element</p>
        </div>

        <div className="emptyPanel">
          <div className="emptyPanelTitle">Nothing selected</div>
          <div className="emptyPanelHint">Click an element in the preview to edit its properties.</div>
        </div>
      </div>
    );
  }

  const node = selectedNode;

  return (
    <div className="panel">
      <div className="panelHeader">
        <h2 className="panelTitle">Settings</h2>
        <p className="panelHint">
          <span className="pill">{node.type}</span>
        </p>
      </div>

      <div className="panelBody">
        {node.type === 'Heading' ? (
          <>
            <LabeledInput label="Text">
              <input
                className="input"
                value={node.props.text || ''}
                onChange={(e) => onUpdateProps(node.id, { text: e.target.value })}
              />
            </LabeledInput>

            <LabeledInput label="Level">
              <select
                className="select"
                value={String(node.props.level || 2)}
                onChange={(e) => onUpdateProps(node.id, { level: Number(e.target.value) })}
              >
                <option value="1">H1</option>
                <option value="2">H2</option>
                <option value="3">H3</option>
                <option value="4">H4</option>
              </select>
            </LabeledInput>
          </>
        ) : null}

        {node.type === 'Text' ? (
          <>
            <LabeledInput label="Text">
              <textarea
                className="textarea"
                rows={4}
                value={node.props.text || ''}
                onChange={(e) => onUpdateProps(node.id, { text: e.target.value })}
              />
            </LabeledInput>

            <LabeledInput label="Variant">
              <select
                className="select"
                value={node.props.variant || 'normal'}
                onChange={(e) => onUpdateProps(node.id, { variant: e.target.value })}
              >
                <option value="normal">Normal</option>
                <option value="muted">Muted</option>
              </select>
            </LabeledInput>
          </>
        ) : null}

        {node.type === 'Button' ? (
          <>
            <LabeledInput label="Text">
              <input
                className="input"
                value={node.props.text || ''}
                onChange={(e) => onUpdateProps(node.id, { text: e.target.value })}
              />
            </LabeledInput>

            <LabeledInput label="Variant">
              <select
                className="select"
                value={node.props.variant || 'primary'}
                onChange={(e) => onUpdateProps(node.id, { variant: e.target.value })}
              >
                <option value="primary">Primary</option>
                <option value="secondary">Secondary</option>
              </select>
            </LabeledInput>
          </>
        ) : null}

        {node.type === 'Image' ? (
          <>
            <LabeledInput label="Image URL">
              <input
                className="input"
                value={node.props.src || ''}
                onChange={(e) => onUpdateProps(node.id, { src: e.target.value })}
                placeholder="https://example.com/image.png"
              />
            </LabeledInput>

            <LabeledInput label="Alt text">
              <input
                className="input"
                value={node.props.alt || ''}
                onChange={(e) => onUpdateProps(node.id, { alt: e.target.value })}
                placeholder="Describe the image"
              />
            </LabeledInput>
          </>
        ) : null}

        {node.type === 'Spacer' ? (
          <LabeledInput label="Height (px)">
            <input
              className="input"
              inputMode="numeric"
              value={String(node.props.height ?? 16)}
              onChange={(e) => onUpdateProps(node.id, { height: Number(e.target.value || 0) })}
            />
          </LabeledInput>
        ) : null}

        <div className="divider" />

        <LabeledInput label="Text align">
          <select
            className="select"
            value={node.style?.textAlign || 'left'}
            onChange={(e) => onUpdateStyle(node.id, { textAlign: e.target.value })}
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>
        </LabeledInput>
      </div>

      <div className="panelFooter">
        <button type="button" className="dangerBtn" onClick={() => onDelete(node.id)}>
          Delete element
        </button>
      </div>
    </div>
  );
}
