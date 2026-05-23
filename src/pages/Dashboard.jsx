import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { T, Card, StatCard, fmtNum, fmtDate, fmtMoney } from '../components/UI';

export default function Dashboard({ store }) {
  const { data, getResumenFlota, getRendimientoVehiculo } = store;
  const resumen = getResumenFlota();

  const rendimientoData = useMemo(() =>
    data.tractores.map(t => ({
      placa: t.placa,
      rendimiento: parseFloat(getRendimientoVehiculo(t.id) || 0),
      color: t.color,
    })).filter(d => d.rendimiento > 0),
    [data.tractores, getRendimientoVehiculo]
  );

  const viajesRecientes = useMemo(() =>
    [...data.viajes]
      .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
      .slice(0, 8),
    [data.viajes]
  );

  const llenadosRecientes = useMemo(() =>
    [...data.llenados]
      .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
      .slice(0, 5),
    [data.llenados]
  );

  const kmPorMes = useMemo(() => {
    const byMonth = {};
    data.viajes.forEach(v => {
      const m = new Date(v.fecha).toLocaleDateString('es-MX', { month: 'short', year: '2-digit' });
      byMonth[m] = (byMonth[m] || 0) + (v.kmRecorridos || 0);
    });
    return Object.entries(byMonth).slice(-6).map(([mes, km]) => ({ mes, km }));
  }, [data.viajes]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: '8px', padding: '10px 14px', fontSize: '12px' }}>
        <div style={{ color: T.textSub, marginBottom: '4px' }}>{label}</div>
        {payload.map((p, i) => (
          <div key={i} style={{ color: p.color || T.accent }}>{fmtNum(p.value)} {p.name}</div>
        ))}
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
        <StatCard icon="🚛" label="Viajes totales" value={fmtNum(resumen.totalViajes)} color={T.accent} />
        <StatCard icon="📍" label="Km recorridos" value={fmtNum(resumen.totalKm)} unit="km" color={T.blue} />
        <StatCard icon="⛽" label="Diesel total" value={fmtNum(resumen.totalLitros, 0)} unit="L" color={T.amber} />
        <StatCard icon="⚡" label="Rendimiento" value={resumen.rendimiento || '—'} unit="km/L" color={T.purple} sub="promedio flota" />
        <StatCard icon="💰" label="Gasto diesel" value={fmtMoney(resumen.totalCosto)} color={T.red} />
      </div>

      {/* Flota status */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <Card style={{ padding: '20px' }}>
          <div style={{ fontSize: '11px', color: T.textMuted, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '16px' }}>
            Estado de la flota
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { label: 'Tractores', count: data.tractores.filter(t => t.activo).length, total: data.tractores.length, color: T.blue, icon: '🚛' },
              { label: 'Cajas Refrigeradas', count: data.cajas.filter(c => c.activo).length, total: data.cajas.length, color: T.accent, icon: '🧊' },
              { label: 'Bases de Resguardo', count: data.bases.length, total: data.bases.length, color: T.amber, icon: '🏭' },
              { label: 'Clientes Activos', count: data.clientes.filter(c => c.activo).length, total: data.clientes.length, color: T.purple, icon: '📦' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '16px' }}>{item.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '12px', color: T.text }}>{item.label}</span>
                    <span style={{ fontSize: '12px', color: item.color, fontWeight: '600' }}>{item.count}/{item.total}</span>
                  </div>
                  <div style={{ height: '4px', background: T.border, borderRadius: '2px' }}>
                    <div style={{ height: '100%', width: `${(item.count / item.total) * 100}%`, background: item.color, borderRadius: '2px', transition: 'width 0.4s' }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card style={{ padding: '20px' }}>
          <div style={{ fontSize: '11px', color: T.textMuted, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '16px' }}>
            Km por mes
          </div>
          {kmPorMes.length > 0 ? (
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={kmPorMes} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <XAxis dataKey="mes" tick={{ fill: T.textMuted, fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: T.textMuted, fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="km" fill={T.accent} radius={[4, 4, 0, 0]} name="km" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '140px', color: T.textMuted, fontSize: '12px' }}>
              Sin datos de viajes aún
            </div>
          )}
        </Card>
      </div>

      {/* Rendimiento por tractor */}
      {rendimientoData.length > 0 && (
        <Card style={{ padding: '20px' }}>
          <div style={{ fontSize: '11px', color: T.textMuted, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '16px' }}>
            Rendimiento por tractor (km/L)
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={rendimientoData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <XAxis dataKey="placa" tick={{ fill: T.textMuted, fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: T.textMuted, fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="rendimiento" radius={[4, 4, 0, 0]} name="km/L" fill={T.amber} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Recent activity */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <Card style={{ padding: '20px' }}>
          <div style={{ fontSize: '11px', color: T.textMuted, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '14px' }}>
            Viajes recientes
          </div>
          {viajesRecientes.length === 0 ? (
            <div style={{ color: T.textMuted, fontSize: '12px', textAlign: 'center', padding: '20px' }}>Sin viajes registrados</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {viajesRecientes.map(v => {
                const tractor = data.tractores.find(t => t.id === v.tractorId);
                return (
                  <div key={v.id} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '10px 12px',
                    background: T.surface,
                    borderRadius: '8px',
                    border: `1px solid ${T.border}`,
                  }}>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: '600', color: T.text }}>{tractor?.placa || '—'}</div>
                      <div style={{ fontSize: '10px', color: T.textMuted }}>{fmtDate(v.fecha)}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '13px', color: T.accent, fontWeight: '600' }}>{fmtNum(v.kmRecorridos)} km</div>
                      <div style={{ fontSize: '10px', color: T.textMuted }}>{fmtNum(v.litrosEstimados, 1)} L est.</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        <Card style={{ padding: '20px' }}>
          <div style={{ fontSize: '11px', color: T.textMuted, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '14px' }}>
            Últimos llenados
          </div>
          {llenadosRecientes.length === 0 ? (
            <div style={{ color: T.textMuted, fontSize: '12px', textAlign: 'center', padding: '20px' }}>Sin llenados registrados</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {llenadosRecientes.map(l => {
                const tractor = data.tractores.find(t => t.id === l.tractorId);
                return (
                  <div key={l.id} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '10px 12px',
                    background: T.surface,
                    borderRadius: '8px',
                    border: `1px solid ${T.border}`,
                  }}>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: '600', color: T.text }}>{tractor?.placa || '—'}</div>
                      <div style={{ fontSize: '10px', color: T.textMuted }}>{fmtDate(l.fecha)}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '13px', color: T.amber, fontWeight: '600' }}>{fmtNum(l.litros, 0)} L</div>
                      <div style={{ fontSize: '10px', color: T.textMuted }}>{fmtMoney(l.costo)}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
