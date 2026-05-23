/* eslint-disable */
import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { T, Card, Badge, SectionHeader, fmtNum, fmtMoney } from '../components/UI';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: '8px', padding: '10px 14px', fontSize: '12px' }}>
      <div style={{ color: T.textSub, marginBottom: '4px' }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color || T.accent, fontWeight: '600' }}>
          {typeof p.value === 'number' ? fmtNum(p.value, 2) : p.value} {p.name}
        </div>
      ))}
    </div>
  );
};

export default function Rendimiento({ store }) {
  const { data } = store;

  const rendByTractor = useMemo(() =>
    data.tractores.map(t => {
      const viajes = data.viajes.filter(v => v.tractorId === t.id);
      const llenados = data.llenados.filter(l => l.tractorId === t.id);
      const totalKm = viajes.reduce((s, v) => s + (v.kmRecorridos || 0), 0);
      const totalL = llenados.reduce((s, l) => s + (l.litros || 0), 0);
      const totalCosto = llenados.reduce((s, l) => s + (l.costo || 0), 0);
      const rend = totalL > 0 ? totalKm / totalL : 0;
      const costoPorKm = totalKm > 0 ? totalCosto / totalKm : 0;
      return { ...t, totalKm, totalL, totalCosto, rend, costoPorKm, nViajes: viajes.length };
    }).filter(t => t.totalKm > 0 || t.totalL > 0),
    [data]
  );

  const fleetAvg = useMemo(() => {
    if (!rendByTractor.length) return 0;
    const active = rendByTractor.filter(t => t.rend > 0);
    if (!active.length) return 0;
    return active.reduce((s, t) => s + t.rend, 0) / active.length;
  }, [rendByTractor]);

  const rendChart = rendByTractor.filter(t => t.rend > 0).map(t => ({
    placa: t.placa, rend: parseFloat(t.rend.toFixed(2)), fill: t.color,
  }));

  const costoChart = rendByTractor.filter(t => t.costoPorKm > 0).map(t => ({
    placa: t.placa, costo: parseFloat(t.costoPorKm.toFixed(2)), fill: t.color,
  }));

  // Trend line for rendimiento over time (all fleet)
  const rendTrend = useMemo(() => {
    const byMonth = {};
    data.viajes.forEach(v => {
      if (!v.kmRecorridos) return;
      const m = new Date(v.fecha).toLocaleDateString('es-MX', { month: 'short', year: '2-digit' });
      if (!byMonth[m]) byMonth[m] = { km: 0, L: 0, key: new Date(v.fecha) };
      byMonth[m].km += v.kmRecorridos;
    });
    data.llenados.forEach(l => {
      const m = new Date(l.fecha).toLocaleDateString('es-MX', { month: 'short', year: '2-digit' });
      if (!byMonth[m]) byMonth[m] = { km: 0, L: 0, key: new Date(l.fecha) };
      byMonth[m].L += l.litros;
    });
    return Object.entries(byMonth)
      .sort(([, a], [, b]) => a.key - b.key)
      .map(([mes, d]) => ({ mes, rend: d.L > 0 ? parseFloat((d.km / d.L).toFixed(2)) : 0 }))
      .filter(d => d.rend > 0)
      .slice(-12);
  }, [data]);

  if (rendByTractor.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 24px', color: T.textMuted }}>
        <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.4 }}>📊</div>
        <p style={{ fontSize: '14px' }}>Registra viajes y llenados para ver el análisis de rendimiento</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <SectionHeader title="Rendimiento de Combustible" subtitle={`Promedio flota: ${fleetAvg.toFixed(2)} km/L`} />

      {/* Summary cards per tractor */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '10px' }}>
        {rendByTractor.map(t => {
          const vsAvg = fleetAvg > 0 ? ((t.rend - fleetAvg) / fleetAvg * 100) : 0;
          const aboveAvg = vsAvg >= 0;
          return (
            <Card key={t.id} style={{ padding: '16px', borderLeft: `3px solid ${t.color}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: '700', fontFamily: "'Syne', sans-serif" }}>{t.placa}</div>
                  <div style={{ fontSize: '11px', color: T.textSub }}>{t.marca} {t.modelo}</div>
                </div>
                <Badge color={aboveAvg ? T.accent : T.red}>{aboveAvg ? '↑' : '↓'} {Math.abs(vsAvg).toFixed(1)}%</Badge>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div>
                  <div style={{ fontSize: '9px', color: T.textMuted }}>RENDIMIENTO</div>
                  <div style={{ fontSize: '18px', fontWeight: '700', color: aboveAvg ? T.accent : T.red }}>
                    {t.rend > 0 ? t.rend.toFixed(2) : '—'}
                    <span style={{ fontSize: '10px', color: T.textSub }}> km/L</span>
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '9px', color: T.textMuted }}>COSTO/KM</div>
                  <div style={{ fontSize: '18px', fontWeight: '700', color: T.amber }}>
                    ${t.costoPorKm.toFixed(2)}
                    <span style={{ fontSize: '10px', color: T.textSub }}>/km</span>
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '9px', color: T.textMuted }}>KM TOTAL</div>
                  <div style={{ fontSize: '13px', color: T.blue, fontWeight: '600' }}>{fmtNum(t.totalKm)} km</div>
                </div>
                <div>
                  <div style={{ fontSize: '9px', color: T.textMuted }}>DIESEL TOTAL</div>
                  <div style={{ fontSize: '13px', color: T.amber, fontWeight: '600' }}>{fmtNum(t.totalL, 0)} L</div>
                </div>
              </div>
              <div style={{ marginTop: '10px', background: T.surface, borderRadius: '4px', height: '4px' }}>
                <div style={{ height: '100%', width: `${Math.min(100, (t.rend / (fleetAvg * 1.5)) * 100)}%`, background: t.color, borderRadius: '4px' }} />
              </div>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {rendChart.length > 0 && (
          <Card style={{ padding: '20px' }}>
            <div style={{ fontSize: '11px', color: T.textMuted, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '16px' }}>
              Rendimiento por tractor (km/L)
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={rendChart} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <XAxis dataKey="placa" tick={{ fill: T.textMuted, fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: T.textMuted, fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                {rendChart.map((entry, idx) => null)}
                <Bar dataKey="rend" name="km/L" radius={[4, 4, 0, 0]}>
                  {rendChart.map((entry, idx) => (
                    <rect key={idx} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        )}
        {costoChart.length > 0 && (
          <Card style={{ padding: '20px' }}>
            <div style={{ fontSize: '11px', color: T.textMuted, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '16px' }}>
              Costo por km ($MXN)
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={costoChart} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <XAxis dataKey="placa" tick={{ fill: T.textMuted, fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: T.textMuted, fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="costo" name="$/km" fill={T.amber} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        )}
      </div>

      {rendTrend.length > 1 && (
        <Card style={{ padding: '20px' }}>
          <div style={{ fontSize: '11px', color: T.textMuted, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '16px' }}>
            Tendencia de rendimiento — flota completa (km/L)
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={rendTrend} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <XAxis dataKey="mes" tick={{ fill: T.textMuted, fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: T.textMuted, fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="rend" stroke={T.accent} strokeWidth={2} dot={{ fill: T.accent, r: 4 }} name="km/L" />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Tabla comparativa */}
      <Card style={{ padding: '20px', overflowX: 'auto' }}>
        <div style={{ fontSize: '11px', color: T.textMuted, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '14px' }}>
          Tabla comparativa de flota
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
          <thead>
            <tr>
              {['Tractor', 'Viajes', 'Km totales', 'Litros', 'Rendimiento', 'Costo/km', 'Gasto total'].map(h => (
                <th key={h} style={{ padding: '8px 12px', textAlign: 'left', color: T.textMuted, fontSize: '10px', letterSpacing: '0.5px', borderBottom: `1px solid ${T.border}`, textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...rendByTractor].sort((a, b) => b.rend - a.rend).map((t, i) => (
              <tr key={t.id} style={{ borderBottom: `1px solid ${T.border}` }}>
                <td style={{ padding: '10px 12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '8px', height: '20px', background: t.color, borderRadius: '2px' }} />
                    <span style={{ fontWeight: '600', color: T.text }}>{t.placa}</span>
                  </div>
                </td>
                <td style={{ padding: '10px 12px', color: T.textSub }}>{t.nViajes}</td>
                <td style={{ padding: '10px 12px', color: T.blue }}>{fmtNum(t.totalKm)} km</td>
                <td style={{ padding: '10px 12px', color: T.amber }}>{fmtNum(t.totalL, 0)} L</td>
                <td style={{ padding: '10px 12px' }}>
                  <Badge color={t.rend >= fleetAvg ? T.accent : T.red}>{t.rend.toFixed(2)} km/L</Badge>
                </td>
                <td style={{ padding: '10px 12px', color: T.textSub }}>${t.costoPorKm.toFixed(2)}</td>
                <td style={{ padding: '10px 12px', color: T.red, fontWeight: '600' }}>{fmtMoney(t.totalCosto)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
