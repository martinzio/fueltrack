import { useState, useEffect, useCallback } from 'react';
import { initialData } from '../data/initialData';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'fueltrack_data';

function loadData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return initialData;
}

function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {}
}

export function useStore() {
  const [data, setData] = useState(loadData);

  useEffect(() => {
    saveData(data);
  }, [data]);

  const update = useCallback((key, updater) => {
    setData(prev => {
      const next = { ...prev, [key]: updater(prev[key]) };
      return next;
    });
  }, []);

  // ── TRACTORES ──
  const addTractor = useCallback((tractor) => {
    update('tractores', list => [...list, { ...tractor, id: uuidv4(), activo: true }]);
  }, [update]);

  const editTractor = useCallback((id, changes) => {
    update('tractores', list => list.map(t => t.id === id ? { ...t, ...changes } : t));
  }, [update]);

  const deleteTractor = useCallback((id) => {
    update('tractores', list => list.filter(t => t.id !== id));
  }, [update]);

  // ── CAJAS ──
  const addCaja = useCallback((caja) => {
    update('cajas', list => [...list, { ...caja, id: uuidv4(), activo: true }]);
  }, [update]);

  const editCaja = useCallback((id, changes) => {
    update('cajas', list => list.map(c => c.id === id ? { ...c, ...changes } : c));
  }, [update]);

  const deleteCaja = useCallback((id) => {
    update('cajas', list => list.filter(c => c.id !== id));
  }, [update]);

  // ── BASES ──
  const addBase = useCallback((base) => {
    update('bases', list => [...list, { ...base, id: uuidv4() }]);
  }, [update]);

  const editBase = useCallback((id, changes) => {
    update('bases', list => list.map(b => b.id === id ? { ...b, ...changes } : b));
  }, [update]);

  const deleteBase = useCallback((id) => {
    update('bases', list => list.filter(b => b.id !== id));
  }, [update]);

  // ── CLIENTES ──
  const addCliente = useCallback((cliente) => {
    update('clientes', list => [...list, { ...cliente, id: uuidv4(), activo: true }]);
  }, [update]);

  const editCliente = useCallback((id, changes) => {
    update('clientes', list => list.map(c => c.id === id ? { ...c, ...changes } : c));
  }, [update]);

  const deleteCliente = useCallback((id) => {
    update('clientes', list => list.filter(c => c.id !== id));
  }, [update]);

  // ── LLENADOS ──
  const addLlenado = useCallback((llenado) => {
    update('llenados', list => [...list, { ...llenado, id: uuidv4(), fecha: llenado.fecha || new Date().toISOString() }]);
  }, [update]);

  const editLlenado = useCallback((id, changes) => {
    update('llenados', list => list.map(l => l.id === id ? { ...l, ...changes } : l));
  }, [update]);

  const deleteLlenado = useCallback((id) => {
    update('llenados', list => list.filter(l => l.id !== id));
  }, [update]);

  // ── VIAJES ──
  const addViaje = useCallback((viaje) => {
    update('viajes', list => [...list, { ...viaje, id: uuidv4(), fecha: viaje.fecha || new Date().toISOString() }]);
  }, [update]);

  const editViaje = useCallback((id, changes) => {
    update('viajes', list => list.map(v => v.id === id ? { ...v, ...changes } : v));
  }, [update]);

  const deleteViaje = useCallback((id) => {
    update('viajes', list => list.filter(v => v.id !== id));
  }, [update]);

  // ── ANALYTICS ──
  const getRendimientoVehiculo = useCallback((tractorId) => {
    const viajes = data.viajes.filter(v => v.tractorId === tractorId && v.kmRecorridos > 0);
    const llenados = data.llenados.filter(l => l.tractorId === tractorId && l.litros > 0);
    if (!viajes.length || !llenados.length) return null;
    const totalKm = viajes.reduce((s, v) => s + v.kmRecorridos, 0);
    const totalLitros = llenados.reduce((s, l) => s + l.litros, 0);
    return totalLitros > 0 ? (totalKm / totalLitros).toFixed(2) : null;
  }, [data]);

  const getResumenFlota = useCallback(() => {
    const totalViajes = data.viajes.length;
    const totalKm = data.viajes.reduce((s, v) => s + (v.kmRecorridos || 0), 0);
    const totalLitros = data.llenados.reduce((s, l) => s + (l.litros || 0), 0);
    const totalCosto = data.llenados.reduce((s, l) => s + (l.costo || 0), 0);
    const rendimiento = totalLitros > 0 ? (totalKm / totalLitros).toFixed(2) : 0;
    return { totalViajes, totalKm, totalLitros, totalCosto, rendimiento };
  }, [data]);

  const resetData = useCallback(() => {
    setData(initialData);
  }, []);

  return {
    data,
    addTractor, editTractor, deleteTractor,
    addCaja, editCaja, deleteCaja,
    addBase, editBase, deleteBase,
    addCliente, editCliente, deleteCliente,
    addLlenado, editLlenado, deleteLlenado,
    addViaje, editViaje, deleteViaje,
    getRendimientoVehiculo,
    getResumenFlota,
    resetData,
  };
}
