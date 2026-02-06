import React from 'react';

function NodeView({ node }) {
  if (node.type === 'Heading') {
    const level = Math.min(6, Math.max(1, Number(node.props.level || 2)));
    const Tag = `h${level}`;
    return <Tag className="nodeHeading">{node.props.text || 'Heading'}</Tag>;
  }

  if (node.type === 'Text') {
    const cls = node.props.variant === 'muted' ? 'nodeText nodeTextMuted' : 'nodeText';
    return <p className={cls}>{node.props.text || 'Text'}</p>;
  }

  if (node.type === 'Button') {
    const cls = node.props.variant === 'secondary' ? 'nodeButton nodeButtonSecondary' : 'nodeButton';
    return <button type="button" className={cls}>{node.props.text || 'Button'}</button>;
  }

  if (node.type === 'Image') {
    // No inline styles except dynamic values => apply fixed class; src is dynamic.
    const src = node.props.src || 'https://via.placeholder.com/640x240?text=Image';
    const alt = node.props.alt || 'Image';
    return <img className="nodeImage" src={src} alt={alt} />;
  }

  if (node.type === 'Spacer') {
    const height = Number(node.props.height || 16);
    return <div className="nodeSpacer" style={{ height }} aria-hidden="true" />;
  }

  return <div className="nodeUnknown">Unknown: {node.type}</div>;
}

// PUBLIC_INTERFACE
export default function Canvas({ nodes, selectedId, onSelect }) {
  /** Central canvas that renders nodes and supports selection. */
  return (
    <div className="canvasOuter">
      <div className="canvasTopBar">
        <div className="canvasTitle">Live Preview</div>
        <div className="canvasMeta">{nodes.length} element{nodes.length === 1 ? '' : 's'}</div>
      </div>

      <div className="canvas" role="region" aria-label="Website preview canvas">
        <div className="canvasPaper">
          {nodes.map((node) => {
            const isSelected = node.id === selectedId;
            return (
              <div
                key={node.id}
                className={isSelected ? 'canvasNode canvasNodeSelected' : 'canvasNode'}
                role="button"
                tabIndex={0}
                onClick={() => onSelect(node.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') onSelect(node.id);
                }}
              >
                <div className="canvasNodeInner" style={node.style || undefined}>
                  <NodeView node={node} />
                </div>
                <div className="canvasNodeBadge">
                  <span className="badgeType">{node.type}</span>
                  <span className="badgeId">{node.id}</span>
                </div>
              </div>
            );
          })}
          {nodes.length === 0 ? (
            <div className="canvasEmpty">
              <div className="canvasEmptyTitle">Empty canvas</div>
              <div className="canvasEmptyHint">Add components from the left panel.</div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
