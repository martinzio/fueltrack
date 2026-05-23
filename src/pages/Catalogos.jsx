/* eslint-disable */
import React, { useState } from 'react';
import { T, Card, Badge, Btn, Modal, Input, SectionHeader, EmptyState } from '../components/UI';

const COLORES = ['#F59E0B','#3B82F6','#10B981','#EF4444','#A855F7','#EC4899','#06B6D4','#F97316','#84CC16','#14B8A6'];

function TractoresTab({ store }) {
  const { data, addTractor, editTractor, deleteTractor } = store;
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const blank = { placa: '', marca: '', modelo: '', anio: new Date().getFullYear(), capacidadTanque: 600, color: COLORES[0] };
  const [form, setForm] = useState(blank);

  function open(item) {
    setEditing(item || null);
    setForm(item ? { ...item } : blank);
    setModal(true);
  }

  function save() {
    if (!form.placa || !form.marca) return;
    if (editing) editTractor(editing.id, form);
    else addTractor(form);
    setModal(false);
  }

  return (
    <div>
      <SectionHeader title={`Tractores (${data.tractores.length}/7)`} subtitle="Unidades de arrastre" action={<Btn onClick={() => open()}>+ Agregar</Btn>} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '12px' }}>
        {data.tractores.map(t => (
          <Card key={t.id} style={{ padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '12px', height: '32px', background: t.color, borderRadius: '3px' }} />
                <div>
                  <div style={{ fontSize: '15px', fontWeight: '700', fontFamily: "'Syne', sans-serif" }}>{t.placa}</div>
                  <div style={{ fontSize: '11px', color: T.textSub }}>{t.marca} {t.modelo}</div>
                </div>
              </div>
              <Badge color={t.activo ? T.accent : T.textMuted}>{t.activo ? 'Activo' : 'Inactivo'}</Badge>
            </div>
            <div style={{ display: 'flex', gap: '16px', marginBottom: '12px' }}>
              <div>
                <div style={{ fontSize: '10px', color: T.textMuted }}>AÑO</div>
                <div style={{ fontSize: '13px', color: T.text }}>{t.anio}</div>
              </div>
              <div>
                <div style={{ fontSize: '10px', color: T.textMuted }}>TANQUE</div>
                <div style={{ fontSize: '13px', color: T.amber }}>{t.capacidadTanque} L</div>
              </div>
              <div>
                <div style={{ fontSize: '10px', color: T.textMuted }}>REND.</div>
                <div style={{ fontSize: '13px', color: T.accent }}>{store.getRendimientoVehiculo(t.id) || '—'} km/L</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Btn variant="ghost" style={{ flex: 1, justifyContent: 'center' }} onClick={() => open(t)}>Editar</Btn>
              <Btn variant="danger" onClick={() => { if (window.confirm('¿Eliminar?')) deleteTractor(t.id) }}>✕</Btn>
            </div>
          </Card>
        ))}
      </div>
      {data.tractores.length === 0 && <EmptyState icon="🚛" text="No hay tractores registrados" action={<Btn onClick={() => open()}>+ Agregar tractor</Btn>} />}

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Editar Tractor' : 'Nuevo Tractor'}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <Input label="Placa *" value={form.placa} onChange={v => setForm(p => ({ ...p, placa: v.toUpperCase() }))} placeholder="TRC-001" required />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Input label="Marca *" value={form.marca} onChange={v => setForm(p => ({ ...p, marca: v }))} placeholder="Kenworth" required />
            <Input label="Modelo" value={form.modelo} onChange={v => setForm(p => ({ ...p, modelo: v }))} placeholder="T680" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Input label="Año" type="number" value={form.anio} onChange={v => setForm(p => ({ ...p, anio: parseInt(v) }))} />
            <Input label="Capacidad tanque (L)" type="number" value={form.capacidadTanque} onChange={v => setForm(p => ({ ...p, capacidadTanque: parseInt(v) }))} />
          </div>
          <div>
            <div style={{ fontSize: '11px', color: T.textSub, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Color identificador</div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {COLORES.map(c => (
                <div key={c} onClick={() => setForm(p => ({ ...p, color: c }))} style={{ width: '28px', height: '28px', background: c, borderRadius: '6px', cursor: 'pointer', border: form.color === c ? '3px solid white' : '3px solid transparent', transition: 'transform 0.1s', transform: form.color === c ? 'scale(1.2)' : 'scale(1)' }} />
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '8px' }}>
            <Btn variant="secondary" onClick={() => setModal(false)}>Cancelar</Btn>
            <Btn onClick={save}>Guardar</Btn>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function CajasTab({ store }) {
  const { data, addCaja, editCaja, deleteCaja } = store;
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const blank = { numero: '', marca: '', tipo: 'Refrigerada', longitud: 53, capacidadCarga: 22000, tempMin: -18, tempMax: 4 };
  const [form, setForm] = useState(blank);

  function open(item) { setEditing(item || null); setForm(item ? { ...item } : blank); setModal(true); }
  function save() {
    if (!form.numero) return;
    if (editing) editCaja(editing.id, form);
    else addCaja(form);
    setModal(false);
  }

  return (
    <div>
      <SectionHeader title={`Cajas Refrigeradas (${data.cajas.length}/12)`} subtitle="Semirremolques de temperatura controlada" action={<Btn onClick={() => open()}>+ Agregar</Btn>} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
        {data.cajas.map(c => (
          <Card key={c.id} style={{ padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '20px' }}>🧊</span>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '700', fontFamily: "'Syne', sans-serif" }}>{c.numero}</div>
                  <div style={{ fontSize: '11px', color: T.textSub }}>{c.marca}</div>
                </div>
              </div>
              <Badge color={T.blue}>{c.longitud} ft</Badge>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
              <div style={{ background: T.surface, borderRadius: '6px', padding: '8px', border: `1px solid ${T.border}` }}>
                <div style={{ fontSize: '9px', color: T.textMuted }}>TEMP RANGO</div>
                <div style={{ fontSize: '12px', color: T.blue }}>{c.tempMin}° / {c.tempMax}°C</div>
              </div>
              <div style={{ background: T.surface, borderRadius: '6px', padding: '8px', border: `1px solid ${T.border}` }}>
                <div style={{ fontSize: '9px', color: T.textMuted }}>CARGA MÁX</div>
                <div style={{ fontSize: '12px', color: T.accent }}>{(c.capacidadCarga / 1000).toFixed(0)}t</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Btn variant="ghost" style={{ flex: 1, justifyContent: 'center' }} onClick={() => open(c)}>Editar</Btn>
              <Btn variant="danger" onClick={() => { if (window.confirm('¿Eliminar?')) deleteCaja(c.id) }}>✕</Btn>
            </div>
          </Card>
        ))}
      </div>
      {data.cajas.length === 0 && <EmptyState icon="🧊" text="No hay cajas registradas" action={<Btn onClick={() => open()}>+ Agregar caja</Btn>} />}

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Editar Caja' : 'Nueva Caja Refrigerada'}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Input label="Número *" value={form.numero} onChange={v => setForm(p => ({ ...p, numero: v.toUpperCase() }))} placeholder="CRF-001" required />
            <Input label="Marca" value={form.marca} onChange={v => setForm(p => ({ ...p, marca: v }))} placeholder="Wabash" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Input label="Longitud (ft)" type="number" value={form.longitud} onChange={v => setForm(p => ({ ...p, longitud: parseInt(v) }))} />
            <Input label="Carga máx (kg)" type="number" value={form.capacidadCarga} onChange={v => setForm(p => ({ ...p, capacidadCarga: parseInt(v) }))} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Input label="Temp mín (°C)" type="number" value={form.tempMin} onChange={v => setForm(p => ({ ...p, tempMin: parseInt(v) }))} />
            <Input label="Temp máx (°C)" type="number" value={form.tempMax} onChange={v => setForm(p => ({ ...p, tempMax: parseInt(v) }))} />
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '8px' }}>
            <Btn variant="secondary" onClick={() => setModal(false)}>Cancelar</Btn>
            <Btn onClick={save}>Guardar</Btn>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function BasesTab({ store }) {
  const { data, addBase, editBase, deleteBase } = store;
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const blank = { nombre: '', direccion: '', lat: '', lng: '', color: T.accent };
  const [form, setForm] = useState(blank);

  function open(item) { setEditing(item || null); setForm(item ? { ...item } : blank); setModal(true); }
  function save() {
    if (!form.nombre || !form.direccion) return;
    if (editing) editBase(editing.id, form);
    else addBase({ ...form, lat: parseFloat(form.lat) || 0, lng: parseFloat(form.lng) || 0 });
    setModal(false);
  }

  return (
    <div>
      <SectionHeader title={`Bases de Resguardo (${data.bases.length}/2)`} subtitle="Puntos de salida y llegada de unidades" action={<Btn onClick={() => open()}>+ Agregar</Btn>} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
        {data.bases.map(b => (
          <Card key={b.id} style={{ padding: '20px', borderLeft: `4px solid ${b.color}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <span style={{ fontSize: '24px' }}>🏭</span>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: '700', fontFamily: "'Syne', sans-serif" }}>{b.nombre}</div>
                  <div style={{ fontSize: '11px', color: T.textSub }}>{b.direccion}</div>
                </div>
              </div>
            </div>
            {b.lat && b.lng ? (
              <div style={{ fontSize: '11px', color: T.textMuted, marginBottom: '12px' }}>
                📍 {Number(b.lat).toFixed(4)}, {Number(b.lng).toFixed(4)}
              </div>
            ) : null}
            <div style={{ display: 'flex', gap: '8px' }}>
              <Btn variant="ghost" style={{ flex: 1, justifyContent: 'center' }} onClick={() => open(b)}>Editar</Btn>
              <Btn variant="danger" onClick={() => { if (window.confirm('¿Eliminar base?')) deleteBase(b.id) }}>✕</Btn>
            </div>
          </Card>
        ))}
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Editar Base' : 'Nueva Base de Resguardo'}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <Input label="Nombre *" value={form.nombre} onChange={v => setForm(p => ({ ...p, nombre: v }))} placeholder="Base Norte" required />
          <Input label="Dirección *" value={form.direccion} onChange={v => setForm(p => ({ ...p, direccion: v }))} placeholder="Blvd. Industrial 1500, Ciudad" required />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Input label="Latitud (GPS)" type="number" value={form.lat} onChange={v => setForm(p => ({ ...p, lat: v }))} placeholder="25.7069" step="0.0001" />
            <Input label="Longitud (GPS)" type="number" value={form.lng} onChange={v => setForm(p => ({ ...p, lng: v }))} placeholder="-100.3161" step="0.0001" />
          </div>
          <div style={{ fontSize: '11px', color: T.textMuted, padding: '10px', background: T.surface, borderRadius: '8px', border: `1px solid ${T.border}` }}>
            💡 Para obtener coordenadas: abre Google Maps, haz clic derecho sobre la ubicación y copia las coordenadas que aparecen.
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '8px' }}>
            <Btn variant="secondary" onClick={() => setModal(false)}>Cancelar</Btn>
            <Btn onClick={save}>Guardar</Btn>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function ClientesTab({ store }) {
  const { data, addCliente, editCliente, deleteCliente } = store;
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const blank = { nombre: '', contacto: '', tel: '', dirCarga: '', latCarga: '', lngCarga: '', dirDescarga: '', latDescarga: '', lngDescarga: '' };
  const [form, setForm] = useState(blank);

  function open(item) { setEditing(item || null); setForm(item ? { ...item } : blank); setModal(true); }
  function save() {
    if (!form.nombre) return;
    const toSave = { ...form, latCarga: parseFloat(form.latCarga) || 0, lngCarga: parseFloat(form.lngCarga) || 0, latDescarga: parseFloat(form.latDescarga) || 0, lngDescarga: parseFloat(form.lngDescarga) || 0 };
    if (editing) editCliente(editing.id, toSave);
    else addCliente(toSave);
    setModal(false);
  }

  return (
    <div>
      <SectionHeader title={`Clientes (${data.clientes.length})`} subtitle="Puntos de carga y descarga" action={<Btn onClick={() => open()}>+ Agregar</Btn>} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {data.clientes.map(c => (
          <Card key={c.id} style={{ padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', flex: 1 }}>
                <span style={{ fontSize: '24px', marginTop: '2px' }}>🏢</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: '700', fontFamily: "'Syne', sans-serif", marginBottom: '4px' }}>{c.nombre}</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '8px' }}>
                    <div>
                      <div style={{ fontSize: '10px', color: T.accent, marginBottom: '2px', letterSpacing: '0.5px' }}>📦 CARGA</div>
                      <div style={{ fontSize: '11px', color: T.textSub }}>{c.dirCarga}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '10px', color: T.amber, marginBottom: '2px', letterSpacing: '0.5px' }}>🎯 DESCARGA</div>
                      <div style={{ fontSize: '11px', color: T.textSub }}>{c.dirDescarga}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', marginLeft: '12px' }}>
                <Btn variant="ghost" onClick={() => open(c)}>Editar</Btn>
                <Btn variant="danger" onClick={() => { if (window.confirm('¿Eliminar?')) deleteCliente(c.id) }}>✕</Btn>
              </div>
            </div>
          </Card>
        ))}
      </div>
      {data.clientes.length === 0 && <EmptyState icon="🏢" text="No hay clientes registrados" action={<Btn onClick={() => open()}>+ Agregar cliente</Btn>} />}

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Editar Cliente' : 'Nuevo Cliente'} width="600px">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Input label="Nombre *" value={form.nombre} onChange={v => setForm(p => ({ ...p, nombre: v }))} required />
            <Input label="Contacto" value={form.contacto} onChange={v => setForm(p => ({ ...p, contacto: v }))} />
          </div>
          <Input label="Teléfono" value={form.tel} onChange={v => setForm(p => ({ ...p, tel: v }))} />
          <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: '10px', padding: '14px' }}>
            <div style={{ fontSize: '11px', color: T.accent, letterSpacing: '1px', marginBottom: '10px' }}>📦 PUNTO DE CARGA</div>
            <Input label="Dirección de carga" value={form.dirCarga} onChange={v => setForm(p => ({ ...p, dirCarga: v }))} style={{ marginBottom: '10px' }} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <Input label="Latitud" type="number" value={form.latCarga} onChange={v => setForm(p => ({ ...p, latCarga: v }))} step="0.0001" placeholder="25.7069" />
              <Input label="Longitud" type="number" value={form.lngCarga} onChange={v => setForm(p => ({ ...p, lngCarga: v }))} step="0.0001" placeholder="-100.3161" />
            </div>
          </div>
          <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: '10px', padding: '14px' }}>
            <div style={{ fontSize: '11px', color: T.amber, letterSpacing: '1px', marginBottom: '10px' }}>🎯 PUNTO DE DESCARGA</div>
            <Input label="Dirección de descarga" value={form.dirDescarga} onChange={v => setForm(p => ({ ...p, dirDescarga: v }))} style={{ marginBottom: '10px' }} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <Input label="Latitud" type="number" value={form.latDescarga} onChange={v => setForm(p => ({ ...p, latDescarga: v }))} step="0.0001" placeholder="25.6900" />
              <Input label="Longitud" type="number" value={form.lngDescarga} onChange={v => setForm(p => ({ ...p, lngDescarga: v }))} step="0.0001" placeholder="-100.3500" />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '8px' }}>
            <Btn variant="secondary" onClick={() => setModal(false)}>Cancelar</Btn>
            <Btn onClick={save}>Guardar</Btn>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default function Catalogos({ store }) {
  const [tab, setTab] = useState('tractores');
  const tabs = [
    { id: 'tractores', label: '🚛 Tractores', count: store.data.tractores.length },
    { id: 'cajas', label: '🧊 Cajas', count: store.data.cajas.length },
    { id: 'bases', label: '🏭 Bases', count: store.data.bases.length },
    { id: 'clientes', label: '🏢 Clientes', count: store.data.clientes.length },
  ];

  return (
    <div>
      <div style={{ display: 'flex', gap: '6px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            background: tab === t.id ? T.accentDim : T.surface,
            border: `1px solid ${tab === t.id ? T.accent : T.border}`,
            color: tab === t.id ? T.accent : T.textSub,
            borderRadius: '8px', padding: '8px 16px', fontSize: '12px',
            fontFamily: "'DM Mono', monospace", cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
          }}>
            {t.label}
            <span style={{ background: tab === t.id ? T.accent : T.border, color: tab === t.id ? '#000' : T.textMuted, borderRadius: '10px', padding: '1px 7px', fontSize: '10px', fontWeight: '700' }}>{t.count}</span>
          </button>
        ))}
      </div>
      {tab === 'tractores' && <TractoresTab store={store} />}
      {tab === 'cajas' && <CajasTab store={store} />}
      {tab === 'bases' && <BasesTab store={store} />}
      {tab === 'clientes' && <ClientesTab store={store} />}
    </div>
  );
}
