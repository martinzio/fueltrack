import React, { useState } from 'react';

export const T = {
  bg: '#0B0F1A',
  surface: '#111827',
  card: '#141E2E',
  cardHover: '#1A2840',
  border: '#1E2D45',
  borderLight: '#243650',
  accent: '#00D9A3',
  accentDim: '#00D9A315',
  accentBorder: '#00D9A340',
  amber: '#F59E0B',
  amberDim: '#F59E0B15',
  blue: '#4F9CF9',
  blueDim: '#4F9CF915',
  red: '#F05252',
  redDim: '#F0525215',
  purple: '#B57BEE',
  purpleDim: '#B57BEE15',
  orange: '#FB923C',
  orangeDim: '#FB923C15',
  text: '#E8EFF8',
  textSub: '#94A3B8',
  textMuted: '#4B5E77',
};

export function Card({ children, style, onClick, hover = false }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => hover && setHovered(true)}
      onMouseLeave={() => hover && setHovered(false)}
      style={{
        background: hovered ? T.cardHover : T.card,
        border: `1px solid ${hovered ? T.borderLight : T.border}`,
        borderRadius: '12px',
        transition: 'all 0.2s',
        cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function Badge({ children, color = T.accent, style }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      background: `${color}20`,
      border: `1px solid ${color}40`,
      color,
      borderRadius: '5px',
      padding: '2px 8px',
      fontSize: '10px',
      fontWeight: '600',
      letterSpacing: '0.5px',
      textTransform: 'uppercase',
      ...style,
    }}>
      {children}
    </span>
  );
}

export function Input({ label, value, onChange, type = 'text', placeholder, required, style, step }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', ...style }}>
      {label && (
        <label style={{ fontSize: '11px', color: T.textSub, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
          {label}{required && <span style={{ color: T.accent }}> *</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        step={step}
        style={{
          background: T.surface,
          border: `1px solid ${T.border}`,
          borderRadius: '8px',
          padding: '10px 12px',
          color: T.text,
          fontSize: '13px',
          fontFamily: "'DM Mono', monospace",
          outline: 'none',
          width: '100%',
          boxSizing: 'border-box',
          transition: 'border-color 0.2s',
        }}
        onFocus={e => e.target.style.borderColor = T.accent}
        onBlur={e => e.target.style.borderColor = T.border}
      />
    </div>
  );
}

export function Select({ label, value, onChange, options, required, style }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', ...style }}>
      {label && (
        <label style={{ fontSize: '11px', color: T.textSub, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
          {label}{required && <span style={{ color: T.accent }}> *</span>}
        </label>
      )}
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          background: T.surface,
          border: `1px solid ${T.border}`,
          borderRadius: '8px',
          padding: '10px 12px',
          color: value ? T.text : T.textMuted,
          fontSize: '13px',
          fontFamily: "'DM Mono', monospace",
          outline: 'none',
          width: '100%',
          cursor: 'pointer',
          boxSizing: 'border-box',
        }}
        onFocus={e => e.target.style.borderColor = T.accent}
        onBlur={e => e.target.style.borderColor = T.border}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value} style={{ background: T.surface }}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function Btn({ children, onClick, variant = 'primary', style, disabled, type }) {
  const styles = {
    primary: { bg: T.accent, color: '#000', border: T.accent },
    secondary: { bg: 'transparent', color: T.textSub, border: T.border },
    danger: { bg: T.redDim, color: T.red, border: `${T.red}40` },
    ghost: { bg: T.accentDim, color: T.accent, border: T.accentBorder },
  };
  const s = styles[variant];
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        background: s.bg,
        color: s.color,
        border: `1px solid ${s.border}`,
        borderRadius: '8px',
        padding: '9px 18px',
        fontSize: '12px',
        fontFamily: "'DM Mono', monospace",
        fontWeight: '600',
        letterSpacing: '0.5px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'all 0.15s',
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        ...style,
      }}
    >
      {children}
    </button>
  );
}

export function Modal({ open, onClose, title, children, width = '500px' }) {
  if (!open) return null;
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(4px)',
        zIndex: 1000,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: T.card,
          border: `1px solid ${T.borderLight}`,
          borderRadius: '16px',
          width: '100%',
          maxWidth: width,
          maxHeight: '90vh',
          overflow: 'auto',
        }}
      >
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 24px',
          borderBottom: `1px solid ${T.border}`,
        }}>
          <h3 style={{ margin: 0, fontSize: '15px', fontFamily: "'Syne', sans-serif", fontWeight: '700' }}>{title}</h3>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: T.textSub, cursor: 'pointer', fontSize: '18px', padding: '4px 8px' }}
          >✕</button>
        </div>
        <div style={{ padding: '24px' }}>{children}</div>
      </div>
    </div>
  );
}

export function StatCard({ icon, label, value, unit, color = T.accent, sub }) {
  return (
    <Card style={{ padding: '18px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        <div style={{
          width: '40px', height: '40px', flexShrink: 0,
          background: `${color}18`,
          border: `1px solid ${color}30`,
          borderRadius: '10px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '18px',
        }}>{icon}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '10px', color: T.textMuted, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '4px' }}>{label}</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
            <span style={{ fontSize: '22px', fontWeight: '700', fontFamily: "'Syne', sans-serif", color }}>{value}</span>
            {unit && <span style={{ fontSize: '11px', color: T.textSub }}>{unit}</span>}
          </div>
          {sub && <div style={{ fontSize: '11px', color: T.textMuted, marginTop: '2px' }}>{sub}</div>}
        </div>
      </div>
    </Card>
  );
}

export function SectionHeader({ title, subtitle, action }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '16px' }}>
      <div>
        <h2 style={{ margin: 0, fontSize: '18px', fontFamily: "'Syne', sans-serif", fontWeight: '800', letterSpacing: '-0.3px' }}>{title}</h2>
        {subtitle && <p style={{ margin: '4px 0 0', fontSize: '12px', color: T.textSub }}>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function EmptyState({ icon, text, action }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '48px 24px', color: T.textMuted, textAlign: 'center',
    }}>
      <div style={{ fontSize: '40px', marginBottom: '12px', opacity: 0.5 }}>{icon}</div>
      <p style={{ margin: '0 0 16px', fontSize: '13px' }}>{text}</p>
      {action}
    </div>
  );
}

export function fmtNum(n, dec = 0) {
  if (n == null || isNaN(n)) return '—';
  return Number(n).toLocaleString('es-MX', { minimumFractionDigits: dec, maximumFractionDigits: dec });
}

export function fmtDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function fmtMoney(n) {
  if (n == null || isNaN(n)) return '—';
  return `$${Number(n).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
