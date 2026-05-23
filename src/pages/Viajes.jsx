/* eslint-disable */
import React, { useState, useMemo } from 'react';
import { T, Card, Badge, Btn, Modal, Input, Select, SectionHeader, EmptyState, fmtNum, fmtDate, fmtMoney } from '../components/UI';

export default function Viajes({ store }) {
  const { data, addViaje, editViaje, deleteViaje } = store;
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [viewRoute, setViewRoute] = useState(null);

  const blank = {
    tractorId: '',
    cajaId: '',
    operador: '',
    fecha: new Date().toISOString().slice(0, 10),
    baseSalidaId: '',
    baseLlegadaId: '',
    clientesIds: [],
    kmInicio: '',
    kmFin: '',
    notas: '',
  };
  const [form, setForm] = useState(blank);

  const kmRecorridos = useMemo(() => {
    if (!form.kmInicio || !form.kmFin) return 0;
    return Math.max(0, parseFloat(form.kmFin) - parseFloat(form.kmInicio));
  }, [form.kmInicio, form.kmFin]);

  const rendEst = useMemo(() => {
    if (!form.tractorId) return null;
    return store.getRendimientoVehiculo(form.tractorId);
  }, [form.tractorId, store]);

  const litrosEst = useMemo(() => {
    if (!kmRecorridos || !rendEst) return null;
    return (kmRecorridos / parseFloat(rendEst)).toFixed(1);
  }, [kmRecorridos, rendEst]);

  const costoEst = useMemo(() => {
    if (!litrosEst) return null;
    const precioProm = data.llenados.length > 0
      ? data.llenados.reduce((s, l) => s + l.precioLitro, 0) / data.llenados.length
      : 23.50;
    return (parseFloat(litrosEst) * precioProm).toFixed(2);
  }, [litrosEst, data.llenados]);

  function toggleCliente(id) {
    setForm(p => ({
      ...p,
      clientesIds: p.clientesIds.includes(id)
        ? p.clientesIds.filter(c => c !== id)
        : [...p.clientesIds, id],
    }));
  }

  function open(item) {
    setEditing(item || null);
    setForm(item ? { ...item, fecha: item.fecha?.slice(0, 10) || blank.fecha } : blank);
    setModal(true);
  }

  function save() {
    if (!form.tractorId || !form.kmInicio || !form.kmFin) return;
    const payload = {
      ...form,
      kmInicio: parseFloat(form.kmInicio),
      kmFin: parseFloat(form.kmFin),
      kmRecorridos,
      litrosEstimados: litrosEst ? parseFloat(litrosEst) : 0,
      costoEstimado: costoEst ? parseFloat(costoEst) : 0,
      fecha: new Date(form.fecha + 'T12:00:00').toISOString(),
    };
    if (editing) editViaje(editing.id, payload);
    else addViaje(payload);
    setModal(false);
  }

  const viajes = useMemo(() =>
    [...data.viajes].sort((a, b) => new Date(b.fecha) - new Date(a.fecha)),
    [data.viajes]
  );

  const tractorOpts = [{ value: '', label: '— Selecciona tractor —' }, ...data.tractores.map(t => ({ value: t.id, label: `${t.placa} — ${t.marca} ${t.modelo}` }))];
  const cajaOpts = [{ value: '', label: '— Sin caja / seleccionar —' }, ...data.cajas.map(c => ({ value: c.id, label: `${c.numero} — ${c.marca} ${c.longitud}ft` }))];
  const baseOpts = [{ value: '', label: '— Selecciona base —' }, ...data.bases.map(b => ({ value: b.id, label: b.nombre }))];

  return (
    <div>
      <SectionHeader
        title="Registro de Viajes"
        subtitle={`${data.viajes.length} viajes · ${fmtNum(data.viajes.reduce((s, v) => s + (v.kmRecorridos || 0), 0))} km totales`}
        action={<Btn onClick={() => open()}>+ Registrar viaje</Btn>}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {viajes.map(v => {
          const tractor = data.tractores.find(t => t.id === v.tractorId);
          const caja = data.cajas.find(c => c.id === v.cajaId);
          const baseSalida = data.bases.find(b => b.id === v.baseSalidaId);
          const baseLlegada = data.bases.find(b => b.id === v.baseLlegadaId);
          const clientes = (v.clientesIds || []).map(id => data.clientes.find(c => c.id === id)).filter(Boolean);

          return (
            <Card key={v.id} style={{ padding: '18px 20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <div style={{ width: '10px', height: '50px', background: tractor?.color || T.textMuted, borderRadius: '3px', flexShrink: 0 }} />
                  <div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontSize: '15px', fontWeight: '700', fontFamily: "'Syne', sans-serif" }}>{tractor?.placa || '?'}</span>
                      {caja && <Badge color={T.blue}>🧊 {caja.numero}</Badge>}
                      <span style={{ fontSize: '11px', color: T.textSub }}>{fmtDate(v.fecha)}</span>
                    </div>
                    {v.operador && <div style={{ fontSize: '11px', color: T.textSub, marginBottom: '4px' }}>👤 {v.operador}</div>}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: T.textMuted, flexWrap: 'wrap' }}>
                      <span style={{ color: T.accent }}>🏭 {baseSalida?.nombre || 'Base?'}</span>
                      {clientes.map((cl, i) => (
                        <React.Fragment key={cl.id}><span>→</span><span style={{ color: T.text }}>📦 {cl.nombre}</span></React.Fragment>
                      ))}
                      <span>→</span>
                      <span style={{ color: T.amber }}>🏁 {baseLlegada?.nombre || 'Base?'}</span>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '9px', color: T.textMuted, letterSpacing: '1px' }}>KM RECORRIDOS</div>
                    <div style={{ fontSize: '18px', fontWeight: '700', color: T.accent }}>{fmtNum(v.kmRecorridos)}</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '9px', color: T.textMuted, letterSpacing: '1px' }}>DIESEL EST.</div>
                    <div style={{ fontSize: '18px', fontWeight: '700', color: T.amber }}>{fmtNum(v.litrosEstimados, 1)} L</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '9px', color: T.textMuted, letterSpacing: '1px' }}>COSTO EST.</div>
                    <div style={{ fontSize: '18px', fontWeight: '700', color: T.red }}>{fmtMoney(v.costoEstimado)}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <Btn variant="ghost" onClick={() => setViewRoute(v)}>🗺️ Mapa</Btn>
                    <Btn variant="ghost" onClick={() => open(v)}>Editar</Btn>
                    <Btn variant="danger" onClick={() => { if (window.confirm('¿Eliminar?')) deleteViaje(v.id) }}>✕</Btn>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {viajes.length === 0 && (
        <EmptyState icon="🚛" text="No hay viajes registrados aún" action={<Btn onClick={() => open()}>+ Registrar primer viaje</Btn>} />
      )}

      {/* Route view modal */}
      <Modal open={!!viewRoute} onClose={() => setViewRoute(null)} title="Ruta del viaje" width="600px">
        {viewRoute && (() => {
          const tractor = data.tractores.find(t => t.id === viewRoute.tractorId);
          const baseSalida = data.bases.find(b => b.id === viewRoute.baseSalidaId);
          const baseLlegada = data.bases.find(b => b.id === viewRoute.baseLlegadaId);
          const clientes = (viewRoute.clientesIds || []).map(id => data.clientes.find(c => c.id === id)).filter(Boolean);
          const stops = [
            baseSalida ? { label: `🏭 ${baseSalida.nombre}`, dir: baseSalida.direccion, lat: baseSalida.lat, lng: baseSalida.lng, color: T.accent } : null,
            ...clientes.map(cl => ({ label: `📦 ${cl.nombre}`, dir: cl.dirCarga, lat: cl.latCarga, lng: cl.lngCarga, color: T.blue })),
            ...clientes.map(cl => ({ label: `🎯 Descarga: ${cl.nombre}`, dir: cl.dirDescarga, lat: cl.latDescarga, lng: cl.lngDescarga, color: T.purple })),
            baseLlegada ? { label: `🏁 ${baseLlegada.nombre}`, dir: baseLlegada.direccion, lat: baseLlegada.lat, lng: baseLlegada.lng, color: T.amber } : null,
          ].filter(Boolean);

          // Build Google Maps URL
          const hasCoords = stops.filter(s => s.lat && s.lng);
          const mapsUrl = hasCoords.length >= 2
            ? `https://www.google.com/maps/dir/${hasCoords.map(s => `${s.lat},${s.lng}`).join('/')}`
            : null;

          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <Badge color={tractor?.color || T.accent}>{tractor?.placa}</Badge>
                <Badge color={T.textSub}>{fmtDate(viewRoute.fecha)}</Badge>
                <Badge color={T.accent}>{fmtNum(viewRoute.kmRecorridos)} km</Badge>
                <Badge color={T.amber}>{fmtNum(viewRoute.litrosEstimados, 1)} L est.</Badge>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                {stops.map((s, i) => (
                  <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ width: '14px', height: '14px', background: s.color, borderRadius: '50%', border: `2px solid ${T.bg}`, marginTop: '4px' }} />
                      {i < stops.length - 1 && <div style={{ width: '2px', height: '36px', background: T.border }} />}
                    </div>
                    <div style={{ paddingBottom: '10px' }}>
                      <div style={{ fontSize: '12px', fontWeight: '600', color: s.color }}>{s.label}</div>
                      <div style={{ fontSize: '11px', color: T.textSub }}>{s.dir}</div>
                    </div>
                  </div>
                ))}
              </div>
              {mapsUrl && (
                <a href={mapsUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                  <Btn style={{ width: '100%', justifyContent: 'center' }}>🗺️ Abrir en Google Maps</Btn>
                </a>
              )}
              {!mapsUrl && (
                <div style={{ background: T.amberDim, border: `1px solid ${T.amber}40`, borderRadius: '8px', padding: '12px', fontSize: '11px', color: T.amber }}>
                  💡 Agrega coordenadas GPS a tus bases y clientes para ver la ruta en el mapa.
                </div>
              )}
            </div>
          );
        })()}
      </Modal>

      {/* Register trip modal */}
      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Editar Viaje' : 'Registrar Viaje'} width="600px">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Select label="Tractor *" value={form.tractorId} onChange={v => setForm(p => ({ ...p, tractorId: v }))} options={tractorOpts} required />
            <Select label="Caja refrigerada" value={form.cajaId} onChange={v => setForm(p => ({ ...p, cajaId: v }))} options={cajaOpts} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Input label="Fecha *" type="date" value={form.fecha} onChange={v => setForm(p => ({ ...p, fecha: v }))} required />
            <Input label="Operador / Chofer" value={form.operador} onChange={v => setForm(p => ({ ...p, operador: v }))} placeholder="Nombre del operador" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Select label="Base de salida" value={form.baseSalidaId} onChange={v => setForm(p => ({ ...p, baseSalidaId: v }))} options={baseOpts} />
            <Select label="Base de llegada" value={form.baseLlegadaId} onChange={v => setForm(p => ({ ...p, baseLlegadaId: v }))} options={baseOpts} />
          </div>

          <div>
            <div style={{ fontSize: '11px', color: T.textSub, letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '8px' }}>
              Clientes visitados (selecciona en orden de visita)
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '160px', overflowY: 'auto' }}>
              {data.clientes.map((c, idx) => {
                const selected = form.clientesIds.includes(c.id);
                const order = form.clientesIds.indexOf(c.id) + 1;
                return (
                  <div
                    key={c.id}
                    onClick={() => toggleCliente(c.id)}
                    style={{
                      padding: '10px 12px',
                      background: selected ? T.accentDim : T.surface,
                      border: `1px solid ${selected ? T.accent : T.border}`,
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: '10px',
                      transition: 'all 0.15s',
                    }}
                  >
                    <div style={{
                      width: '22px', height: '22px',
                      background: selected ? T.accent : T.border,
                      color: selected ? '#000' : T.textMuted,
                      borderRadius: '50%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '11px', fontWeight: '700', flexShrink: 0,
                    }}>{selected ? order : '○'}</div>
                    <div>
                      <div style={{ fontSize: '12px', color: selected ? T.accent : T.text, fontWeight: '600' }}>{c.nombre}</div>
                      <div style={{ fontSize: '10px', color: T.textMuted }}>{c.dirCarga}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Input label="Odómetro inicio (km) *" type="number" value={form.kmInicio} onChange={v => setForm(p => ({ ...p, kmInicio: v }))} placeholder="125000" required />
            <Input label="Odómetro fin (km) *" type="number" value={form.kmFin} onChange={v => setForm(p => ({ ...p, kmFin: v }))} placeholder="125850" required />
          </div>

          {kmRecorridos > 0 && (
            <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: '10px', padding: '14px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', textAlign: 'center' }}>
              <div>
                <div style={{ fontSize: '9px', color: T.textMuted, letterSpacing: '1px' }}>KM RECORRIDOS</div>
                <div style={{ fontSize: '20px', fontWeight: '700', color: T.accent }}>{fmtNum(kmRecorridos)}</div>
              </div>
              <div>
                <div style={{ fontSize: '9px', color: T.textMuted, letterSpacing: '1px' }}>DIESEL EST.</div>
                <div style={{ fontSize: '20px', fontWeight: '700', color: T.amber }}>{litrosEst ? `${litrosEst} L` : '—'}</div>
              </div>
              <div>
                <div style={{ fontSize: '9px', color: T.textMuted, letterSpacing: '1px' }}>COSTO EST.</div>
                <div style={{ fontSize: '20px', fontWeight: '700', color: T.red }}>{costoEst ? fmtMoney(costoEst) : '—'}</div>
              </div>
            </div>
          )}

          <Input label="Notas" value={form.notas} onChange={v => setForm(p => ({ ...p, notas: v }))} placeholder="Observaciones del viaje..." />

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '8px' }}>
            <Btn variant="secondary" onClick={() => setModal(false)}>Cancelar</Btn>
            <Btn onClick={save} disabled={!form.tractorId || !form.kmInicio || !form.kmFin}>🚛 Guardar viaje</Btn>
          </div>
        </div>
      </Modal>
    </div>
  );
}
