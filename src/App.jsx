/* eslint-disable */
import React, { useState } from 'react';
import { useStore } from './hooks/useStore';
import Dashboard from './pages/Dashboard';
import Catalogos from './pages/Catalogos';
import Llenados from './pages/Llenados';
import Viajes from './pages/Viajes';
import Rendimiento from './pages/Rendimiento';

const T = {
  bg: '#0B0F1A',
  surface: '#111827',
  card: '#141E2E',
  border: '#1E2D45',
  accent: '#00D9A3',
  accentDim: '#00D9A315',
  text: '#E8EFF8',
  textSub: '#94A3B8',
  textMuted: '#4B5E77',
};

const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊', short: 'Inicio' },
  { id: 'catalogos', label: 'Catálogos', icon: '🗄️', short: 'Catálogos' },
  { id: 'llenados', label: 'Diesel', icon: '⛽', short: 'Diesel' },
  { id: 'viajes', label: 'Viajes', icon: '🚛', short: 'Viajes' },
  { id: 'rendimiento', label: 'Rendimiento', icon: '📈', short: 'Rendimiento' },
];

export default function App() {
  const [page, setPage] = useState('dashboard');
  const store = useStore();

  const current = NAV.find(n => n.id === page);

  return (
    <div style={{ minHeight: '100vh', background: T.bg, color: T.text, fontFamily: "'DM Mono', 'Courier New', monospace", display: 'flex', flexDirection: 'column' }}>

      {/* Top header */}
      <header style={{
        background: T.surface,
        borderBottom: `1px solid ${T.border}`,
        padding: '0 24px',
        height: '56px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            background: T.accentDim,
            border: `1px solid ${T.accent}40`,
            borderRadius: '8px',
            width: '32px', height: '32px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '16px',
          }}>🚛</div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: '700', fontFamily: "'Syne', sans-serif", color: T.text, lineHeight: 1 }}>FuelTrack</div>
            <div style={{ fontSize: '9px', color: T.textMuted, letterSpacing: '1px', textTransform: 'uppercase' }}>Control de Flota</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '8px', height: '8px', background: T.accent, borderRadius: '50%', animation: 'pulse 2s infinite' }} />
          <span style={{ fontSize: '11px', color: T.textMuted }}>
            {store.data.tractores.length} tractores · {store.data.cajas.length} cajas
          </span>
        </div>
      </header>

      <div style={{ display: 'flex', flex: 1 }}>
        {/* Sidebar nav */}
        <nav style={{
          width: '220px',
          background: T.surface,
          borderRight: `1px solid ${T.border}`,
          padding: '16px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          position: 'sticky',
          top: '56px',
          height: 'calc(100vh - 56px)',
          overflowY: 'auto',
          flexShrink: 0,
        }}>
          {NAV.map(n => {
            const active = page === n.id;
            return (
              <button
                key={n.id}
                onClick={() => setPage(n.id)}
                style={{
                  background: active ? T.accentDim : 'transparent',
                  border: `1px solid ${active ? T.accent + '50' : 'transparent'}`,
                  borderRadius: '8px',
                  padding: '10px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s',
                  width: '100%',
                }}
                onMouseEnter={e => !active && (e.currentTarget.style.background = '#ffffff08')}
                onMouseLeave={e => !active && (e.currentTarget.style.background = 'transparent')}
              >
                <span style={{ fontSize: '18px', flexShrink: 0 }}>{n.icon}</span>
                <span style={{
                  fontSize: '13px',
                  color: active ? T.accent : T.textSub,
                  fontWeight: active ? '600' : '400',
                  fontFamily: "'DM Mono', monospace",
                }}>{n.label}</span>
                {active && <div style={{ marginLeft: 'auto', width: '4px', height: '4px', background: T.accent, borderRadius: '50%' }} />}
              </button>
            );
          })}

          {/* Bottom stats */}
          <div style={{ marginTop: 'auto', padding: '12px', background: T.card, borderRadius: '10px', border: `1px solid ${T.border}` }}>
            <div style={{ fontSize: '9px', color: T.textMuted, letterSpacing: '1px', marginBottom: '8px', textTransform: 'uppercase' }}>Resumen rápido</div>
            {[
              { label: 'Viajes', val: store.data.viajes.length, color: T.accent },
              { label: 'Llenados', val: store.data.llenados.length, color: T.amber },
              { label: 'Clientes', val: store.data.clientes.length, color: T.textSub },
            ].map(s => (
              <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '11px', color: T.textMuted }}>{s.label}</span>
                <span style={{ fontSize: '11px', color: s.color, fontWeight: '600' }}>{s.val}</span>
              </div>
            ))}
          </div>
        </nav>

        {/* Main content */}
        <main style={{ flex: 1, padding: '28px 28px', overflowY: 'auto', minWidth: 0 }}>
          <div style={{ marginBottom: '24px' }}>
            <h1 style={{ margin: 0, fontSize: '22px', fontFamily: "'Syne', sans-serif", fontWeight: '800', letterSpacing: '-0.5px' }}>
              {current?.icon} {current?.label}
            </h1>
          </div>
          {page === 'dashboard' && <Dashboard store={store} />}
          {page === 'catalogos' && <Catalogos store={store} />}
          {page === 'llenados' && <Llenados store={store} />}
          {page === 'viajes' && <Viajes store={store} />}
          {page === 'rendimiento' && <Rendimiento store={store} />}
        </main>
      </div>

      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #1E2D45; border-radius: 3px; }
        input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
      `}</style>
    </div>
  );
}
