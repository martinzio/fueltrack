import { v4 as uuidv4 } from 'uuid';

export const initialData = {
  tractores: [
    { id: uuidv4(), placa: 'TRC-001', marca: 'Kenworth', modelo: 'T680', anio: 2020, capacidadTanque: 600, color: '#F59E0B', activo: true },
    { id: uuidv4(), placa: 'TRC-002', marca: 'Peterbilt', modelo: '579', anio: 2019, capacidadTanque: 550, color: '#3B82F6', activo: true },
    { id: uuidv4(), placa: 'TRC-003', marca: 'Freightliner', modelo: 'Cascadia', anio: 2021, capacidadTanque: 600, color: '#10B981', activo: true },
    { id: uuidv4(), placa: 'TRC-004', marca: 'Kenworth', modelo: 'W900', anio: 2018, capacidadTanque: 500, color: '#EF4444', activo: true },
    { id: uuidv4(), placa: 'TRC-005', marca: 'Volvo', modelo: 'VNL 760', anio: 2022, capacidadTanque: 580, color: '#A855F7', activo: true },
    { id: uuidv4(), placa: 'TRC-006', marca: 'International', modelo: 'LT', anio: 2020, capacidadTanque: 560, color: '#EC4899', activo: true },
    { id: uuidv4(), placa: 'TRC-007', marca: 'Mack', modelo: 'Anthem', anio: 2021, capacidadTanque: 570, color: '#06B6D4', activo: true },
  ],
  cajas: [
    { id: uuidv4(), numero: 'CRF-001', marca: 'Wabash', tipo: 'Refrigerada', longitud: 48, capacidadCarga: 22000, tempMin: -18, tempMax: 4, activo: true },
    { id: uuidv4(), numero: 'CRF-002', marca: 'Great Dane', tipo: 'Refrigerada', longitud: 53, capacidadCarga: 24000, tempMin: -18, tempMax: 4, activo: true },
    { id: uuidv4(), numero: 'CRF-003', marca: 'Utility', tipo: 'Refrigerada', longitud: 48, capacidadCarga: 22000, tempMin: -18, tempMax: 4, activo: true },
    { id: uuidv4(), numero: 'CRF-004', marca: 'Wabash', tipo: 'Refrigerada', longitud: 53, capacidadCarga: 24000, tempMin: -20, tempMax: 2, activo: true },
    { id: uuidv4(), numero: 'CRF-005', marca: 'Hyundai', tipo: 'Refrigerada', longitud: 48, capacidadCarga: 21000, tempMin: -18, tempMax: 4, activo: true },
    { id: uuidv4(), numero: 'CRF-006', marca: 'Great Dane', tipo: 'Refrigerada', longitud: 53, capacidadCarga: 24000, tempMin: -18, tempMax: 4, activo: true },
    { id: uuidv4(), numero: 'CRF-007', marca: 'Utility', tipo: 'Refrigerada', longitud: 48, capacidadCarga: 22000, tempMin: -15, tempMax: 5, activo: true },
    { id: uuidv4(), numero: 'CRF-008', marca: 'Wabash', tipo: 'Refrigerada', longitud: 53, capacidadCarga: 24000, tempMin: -18, tempMax: 4, activo: true },
    { id: uuidv4(), numero: 'CRF-009', marca: 'Hyundai', tipo: 'Refrigerada', longitud: 48, capacidadCarga: 21000, tempMin: -18, tempMax: 4, activo: true },
    { id: uuidv4(), numero: 'CRF-010', marca: 'Great Dane', tipo: 'Refrigerada', longitud: 53, capacidadCarga: 24000, tempMin: -18, tempMax: 4, activo: true },
    { id: uuidv4(), numero: 'CRF-011', marca: 'Utility', tipo: 'Refrigerada', longitud: 48, capacidadCarga: 22000, tempMin: -20, tempMax: 2, activo: true },
    { id: uuidv4(), numero: 'CRF-012', marca: 'Wabash', tipo: 'Refrigerada', longitud: 53, capacidadCarga: 24000, tempMin: -18, tempMax: 4, activo: true },
  ],
  bases: [
    { id: uuidv4(), nombre: 'Base Norte', direccion: 'Blvd. Industrial Norte 1500, Monterrey, NL', lat: 25.7069, lng: -100.3161, color: '#00C9A7' },
    { id: uuidv4(), nombre: 'Base Sur', direccion: 'Carretera Nacional Km 45, Guadalupe, NL', lat: 25.6751, lng: -100.2396, color: '#F59E0B' },
  ],
  clientes: [
    { id: uuidv4(), nombre: 'Súper Almacenes del Norte', contacto: 'Carlos Mendoza', tel: '818-100-2000', dirCarga: 'Av. Industrias 234, Monterrey', latCarga: 25.7200, lngCarga: -100.3100, dirDescarga: 'Blvd. Díaz Ordaz 800, Monterrey', latDescarga: 25.6900, lngDescarga: -100.3500, activo: true },
    { id: uuidv4(), nombre: 'Frigorífico Central', contacto: 'Ana López', tel: '818-200-3000', dirCarga: 'Parque Industrial 1, Apodaca', latCarga: 25.7780, lngCarga: -100.1880, dirDescarga: 'Calle Refrigeración 56, Apodaca', latDescarga: 25.7820, lngDescarga: -100.1750, activo: true },
    { id: uuidv4(), nombre: 'Distribuidora La Merced', contacto: 'Roberto Sánchez', tel: '818-300-4000', dirCarga: 'Av. Constitución 400, Monterrey', latCarga: 25.6700, lngCarga: -100.3200, dirDescarga: 'Blvd. Colón 1200, Santa Catarina', latDescarga: 25.6730, lngDescarga: -100.4580, activo: true },
  ],
  llenados: [],
  viajes: [],
};

export const PRECIO_DIESEL_DEFAULT = 23.50; // MXN por litro
