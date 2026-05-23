# FuelTrack 🚛⛽
Sistema de control de combustible y rutas para flota de transporte refrigerado.

## Características
- 7 tractores + 12 cajas refrigeradas
- 2 bases de resguardo
- Registro de llenados de diesel
- Registro de viajes con odómetro
- Cálculo automático de rendimiento (km/L)
- Rutas en Google Maps
- Dashboard con gráficas

## Instalación local
```bash
npm install
npm start
```

## Despliegue en Vercel

### Opción 1: Desde Vercel (más fácil)
1. Sube esta carpeta a un repositorio de GitHub
2. Ve a [vercel.com](https://vercel.com) e inicia sesión
3. Clic en "Add New Project"
4. Selecciona tu repositorio de GitHub
5. Vercel detecta automáticamente la configuración
6. Clic en "Deploy"
7. ¡Listo! Tu app estará en `https://fueltrack-xxxx.vercel.app`

### Opción 2: Vercel CLI
```bash
npm install -g vercel
vercel login
vercel --prod
```

## Tecnologías
- React 18
- Recharts (gráficas)
- Leaflet (mapas)
- localStorage (datos persistentes en el navegador)

## Próximos pasos sugeridos
- Conectar Supabase para base de datos en la nube compartida
- Agregar autenticación por usuario
- App móvil progresiva (PWA)
