// update-enso.mjs: descarga el índice ONI del CPC/NOAA y genera data/oni.json
// Uso desde la raíz del sitio (Node 18 o superior): node update-enso.mjs
import { mkdir, writeFile } from 'node:fs/promises';

const URL_ONI = 'https://www.cpc.ncep.noaa.gov/data/indices/oni.ascii.txt';

const texto = await (await fetch(URL_ONI)).text();
const serie = texto
  .split('\n')
  .map(l => l.trim().split(/\s+/))
  .filter(p => p.length === 4)
  .map(([temporada, anio, , oni]) => ({ temporada, anio: Number(anio), oni: Number(oni) }))
  .filter(x => Number.isFinite(x.anio) && Number.isFinite(x.oni));

if (!serie.length) throw new Error('No se pudo leer el archivo ONI');

await mkdir('data', { recursive: true });
await writeFile('data/oni.json', JSON.stringify({ actualizado: new Date().toISOString(), fuente: URL_ONI, serie }, null, 1));

const u = serie.at(-1);
console.log(`ONI: ${serie.length} temporadas. Última: ${u.temporada} ${u.anio} (${u.oni})`);
