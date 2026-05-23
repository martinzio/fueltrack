import React, { useState, useMemo } from 'react';
import { T, Card, Badge, Btn, Modal, Input, Select, SectionHeader, EmptyState, fmtNum, fmtDate, fmtMoney } from '../components/UI';

export default function Llenados({ store }) {
  const { data, addLlenado, editLlenado, deleteLlenado } = store;
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [filterTractor, setFilterTractor] = useState('');

  const blank = {
    tractorId: '',
    fecha: new Date().toISOString().slice(0, 10),
    litros: '',
    precioLitro: '23.50',
    odometro: '',
    tipo: 'completo',
    gasolinera: '',
    notas: '',
  };
  const [form, setForm] = useState(blank);

  function open(item) {
    setEditing(item || null);
    setForm(item ? { ...item, fecha: item.fecha?.slice(0, 10) || blank.fecha } : blank);
    setModal(true);
  }

  function save() {
    if (!form.tractorId || !form.litros || !form.odometro) return;
    const costo = parseFloat(form.litros) * parseFloat(form.precioLitro);
    const payload = {
      ...form,
      litros: parseFloat(form.litros),
      precioLitro: parseFloat(form.precioLitro),
      odometro: parseFloat(form.odometro),
      costo,
      fecha: new Date(form.fecha + 'T12:00:00').toISOString(),
    };
    if (editing) editLlenado(editing.id, payload);
    else addLlenado(payload);
    setModal(false);
  }

  const llenados = useMemo(() => {
    let list = [...data.llenados].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    if (filterTractor) list = list.filter(l => l.tractorId === filterTractor);
    return list;
  }, [data.llenados, filterTractor]);

  const totalMes = useMemo(() => {
    const now = new Date();
    return data.llenados.filter(l => {
      const d = new Date(l.fecha);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).reduce((s, l) => ({ litros: s.litros + l.litros, costo: s.costo + l.costo }), { litros: 0, costo: 0 });
  }, [data.llenados]);

  const tractorFormOpts = [
    { value: '', label: '— Selecciona un tractor —' },
    ...data.tractores.map(t => ({ value: t.id, label: `${t.placa} — ${t.marca} ${t.modelo}` })),
  ];

  return (
    <div>
      <SectionHeader
        title="Registro de Diesel"
        subtitle={`Este mes: ${fmtNum(totalMes.litros, 0)} L · ${fmtMoney(totalMes.costo)}`}
        action={<Btn onClick={() => open()}>+ Registrar llenado</Btn>}
      />

      {/* Resumen tarjetas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px', marginBottom: '20px' }}>
        {data.tractores.slice(0, 7).map(t => {
          const lls = data.llenados.filter(l => l.tractorId === t.id);
          const totalL = lls.reduce((s, l) => s + l.litros, 0);
          const ultimo = lls.sort((a, b) => new Date(b.fecha) - new Date(a.fecha))[0];
          return (
            <Card key={t.id} style={{ padding: '12px 14px', borderLeft: `3px solid ${t.color}`, cursor: 'pointer' }} onClick={() => setFilterTractor(filterTractor === t.id ? '' : t.id)}>
              <div style={{ fontSize: '12px', fontWeight: '700', color: T.text }}>{t.placa}</div>
              <div style={{ fontSize: '11px', color: T.amber, marginTop: '2px' }}>{fmtNum(totalL, 0)} L total</div>
              <div style={{ fontSize: '10px', color: T.textMuted, marginTop: '2px' }}>{ultimo ? `Últ: ${fmtDate(ultimo.fecha)}` : 'Sin llenados'}</div>
            </Card>
          );
        })}
      </div>

      {filterTractor && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
          <Badge color={T.blue}>Filtro: {data.tractores.find(t => t.id === filterTractor)?.placa}</Badge>
          <Btn variant="secondary" style={{ padding: '4px 10px', fontSize: '11px' }} onClick={() => setFilterTractor('')}>✕ Quitar filtro</Btn>
        </div>
      )}

      {/* Lista de llenados */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {llenados.map(l => {
          const tractor = data.tractores.find(t => t.id === l.tractorId);
          const rendEst = store.getRendimientoVehiculo(l.tractorId);
          const kmEst = rendEst ? (l.litros * parseFloat(rendEst)).toFixed(0) : null;
          return (
            <Card key={l.id} style={{ padding: '16px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '10px', height: '40px', background: tractor?.color || T.textMuted, borderRadius: '3px' }} />
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '700', fontFamily: "'Syne', sans-serif" }}>{tractor?.placa || '?'}</div>
                    <div style={{ fontSize: '11px', color: T.textSub }}>{fmtDate(l.fecha)} · {l.gasolinera || 'Gasolinera no especificada'}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '9px', color: T.textMuted, letterSpacing: '1px' }}>LITROS</div>
                    <div style={{ fontSize: '16px', fontWeight: '700', color: T.amber }}>{fmtNum(l.litros, 0)} L</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '9px', color: T.textMuted, letterSpacing: '1px' }}>COSTO</div>
                    <div style={{ fontSize: '16px', fontWeight: '700', color: T.red }}>{fmtMoney(l.costo)}</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '9px', color: T.textMuted, letterSpacing: '1px' }}>ODÓMETRO</div>
                    <div style={{ fontSize: '16px', fontWeight: '700', color: T.blue }}>{fmtNum(l.odometro)} km</div>
                  </div>
                  {kmEst && (
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '9px', color: T.textMuted, letterSpacing: '1px' }}>KM EST.</div>
                      <div style={{ fontSize: '16px', fontWeight: '700', color: T.accent }}>{fmtNum(kmEst)} km</div>
                    </div>
                  )}
                  <Badge color={l.tipo === 'completo' ? T.accent : T.amber}>{l.tipo}</Badge>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <Btn variant="ghost" onClick={() => open(l)}>Editar</Btn>
                    <Btn variant="danger" onClick={() => { if (window.confirm('¿Eliminar?')) deleteLlenado(l.id) }}>✕</Btn>
                  </div>
                </div>
              </div>
              {l.notas && (
                <div style={{ marginTop: '10px', fontSize: '11px', color: T.textSub, background: T.surface, padding: '8px 12px', borderRadius: '6px', borderLeft: `3px solid ${T.border}` }}>
                  📝 {l.notas}
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {llenados.length === 0 && (
        <EmptyState icon="⛽" text="No hay llenados registrados aún" action={<Btn onClick={() => open()}>+ Registrar primer llenado</Btn>} />
      )}

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Editar Llenado' : 'Registrar Llenado de Diesel'} width="520px">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <Select label="Tractor *" value={form.tractorId} onChange={v => setForm(p => ({ ...p, tractorId: v }))} options={tractorFormOpts} required />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Input label="Fecha *" type="date" value={form.fecha} onChange={v => setForm(p => ({ ...p, fecha: v }))} required />
            <Select
              label="Tipo de llenado"
              value={form.tipo}
              onChange={v => setForm(p => ({ ...p, tipo: v }))}
              options={[{ value: 'completo', label: 'Llenado completo' }, { value: 'parcial', label: 'Llenado parcial' }]}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Input label="Litros cargados *" type="number" value={form.litros} onChange={v => setForm(p => ({ ...p, litros: v }))} placeholder="450" step="0.01" required />
            <Input label="Precio por litro ($) *" type="number" value={form.precioLitro} onChange={v => setForm(p => ({ ...p, precioLitro: v }))} placeholder="23.50" step="0.01" required />
          </div>

          {form.litros && form.precioLitro && (
            <div style={{ background: T.accentDim, border: `1px solid ${T.accentBorder}`, borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
              <span style={{ fontSize: '12px', color: T.textSub }}>Costo total estimado: </span>
              <span style={{ fontSize: '16px', fontWeight: '700', color: T.accent }}>{fmtMoney(parseFloat(form.litros) * parseFloat(form.precioLitro))}</span>
            </div>
          )}

          <Input label="Odómetro al llenar (km) *" type="number" value={form.odometro} onChange={v => setForm(p => ({ ...p, odometro: v }))} placeholder="125000" required />
          <Input label="Gasolinera" value={form.gasolinera} onChange={v => setForm(p => ({ ...p, gasolinera: v }))} placeholder="PEMEX Blvd. Norte" />
          <Input label="Notas" value={form.notas} onChange={v => setForm(p => ({ ...p, notas: v }))} placeholder="Observaciones opcionales..." />

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '8px' }}>
            <Btn variant="secondary" onClick={() => setModal(false)}>Cancelar</Btn>
            <Btn onClick={save} disabled={!form.tractorId || !form.litros || !form.odometro}>⛽ Guardar llenado</Btn>
          </div>
        </div>
      </Modal>
    </div>
  );
}
