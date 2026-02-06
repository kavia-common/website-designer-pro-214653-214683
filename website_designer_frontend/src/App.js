import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import ComponentPalette from './components/ComponentPalette';
import Canvas from './components/Canvas';
import SettingsPanel from './components/SettingsPanel';
import ExportModal from './components/ExportModal';
import { apiGet } from './api/client';
import { useDesignerState } from './hooks/useDesignerState';

// PUBLIC_INTERFACE
function App() {
  const [theme, setTheme] = useState('light');
  const [exportOpen, setExportOpen] = useState(false);
  const [backendHealth, setBackendHealth] = useState({ status: 'idle', message: '' });

  const { state, selectedNode, actions } = useDesignerState();

  useEffect(() => {
    // Apply theme without manual DOM querying.
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    // Backend currently only has GET / health; this validates connectivity.
    let cancelled = false;
    setBackendHealth({ status: 'loading', message: '' });

    apiGet('/')
      .then(() => {
        if (cancelled) return;
        setBackendHealth({ status: 'ok', message: 'Backend connected' });
      })
      .catch((e) => {
        if (cancelled) return;
        setBackendHealth({ status: 'error', message: e?.message || 'Backend not reachable' });
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    /** Toggle light/dark theme for the designer UI. */
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const healthPill = useMemo(() => {
    if (backendHealth.status === 'loading') return { cls: 'statusPill', text: 'Checking backend…' };
    if (backendHealth.status === 'ok') return { cls: 'statusPill statusPillOk', text: backendHealth.message };
    if (backendHealth.status === 'error') return { cls: 'statusPill statusPillError', text: 'Backend offline' };
    return { cls: 'statusPill', text: 'Backend unknown' };
  }, [backendHealth]);

  return (
    <div className="App">
      <div className="topBar">
        <div className="brand">
          <div className="brandMark">WD</div>
          <div className="brandText">
            <div className="brandTitle">Website Designer</div>
            <div className="brandSub">Retro builder • Live preview • Export</div>
          </div>
        </div>

        <div className="topBarActions">
          <span className={healthPill.cls} title={backendHealth.message}>
            {healthPill.text}
          </span>

          <button type="button" className="secondaryBtn" onClick={() => setExportOpen(true)}>
            Export
          </button>

          <button
            type="button"
            className="themeBtn"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? 'Dark' : 'Light'}
          </button>
        </div>
      </div>

      <div className="workspace">
        <aside className="leftPane" aria-label="Component palette">
          <ComponentPalette onAdd={actions.addNode} />
        </aside>

        <main className="centerPane">
          <Canvas nodes={state.nodes} selectedId={state.selectedId} onSelect={actions.selectNode} />
        </main>

        <aside className="rightPane" aria-label="Settings panel">
          <SettingsPanel
            selectedNode={selectedNode}
            onUpdateProps={actions.updateNodeProps}
            onUpdateStyle={actions.updateNodeStyle}
            onDelete={actions.deleteNode}
          />
        </aside>
      </div>

      <ExportModal open={exportOpen} nodes={state.nodes} onClose={() => setExportOpen(false)} />
    </div>
  );
}

export default App;
