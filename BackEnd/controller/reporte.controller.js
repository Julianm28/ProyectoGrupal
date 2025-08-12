const { Parser } = require('json2csv');
const Solicitud = require('../models/Solicitud');
const Insumo = require('../models/Insumo');
const ExcelJS = require('exceljs');
const puppeteer = require('puppeteer');

// Utilidad: enviar CSV
function sendCSV(res, filename, rows) {
  const parser = new Parser();
  const csv = parser.parse(rows);
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.status(200).send(csv);
}

// GET /api/reportes/solicitudes?from=YYYY-MM-DD&to=YYYY-MM-DD&estado=pendiente|aprobada|entregada&hospitalId=...
async function exportSolicitudesCSV(req, res) {
  try {
    const { from, to, estado, hospitalId } = req.query;
    const filter = {};
    if (estado) filter.estado = estado;
    if (hospitalId) filter.$or = [{ hospitalId }, { hospital: hospitalId }];
    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to) filter.createdAt.$lte = new Date(to + 'T23:59:59.999Z');
    }
    const docs = await Solicitud.find(filter).lean();

    const rows = docs.map(d => ({
      id: String(d._id),
      fecha: d.createdAt ? new Date(d.createdAt).toISOString().slice(0, 19).replace('T', ' ') : '',
      solicitanteId: d.solicitanteId || '',
      hospital: d.hospitalId || d.hospital || '',
      prioridad: d.prioridad || '',
      estado: d.estado || '',
      items: Array.isArray(d.items) ? d.items.map(i => `${i.supplyId || i.insumoId || i.id}:${i.qty}`).join('|') : '',
      comentarios: d.comentarios || '',
    }));

    return sendCSV(res, 'solicitudes.csv', rows);
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
}


async function exportSolicitudesPDF(req, res) {
  const solicitudes = await Solicitud.find().populate('insumo').lean();
  const html = `
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Solicitudes Reporte</title>
        <style>
          table { border-collapse: collapse; width: 100%; }
          th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
          th { background: #eee; }
        </style>
      </head>
      <body>
        <h1>Reporte de Solicitudes</h1>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Fecha</th>
              <th>Solicitante</th>
              <th>Hospital</th>
              <th>Prioridad</th>
              <th>Estado</th>
              <th>Comentarios</th>
            </tr>
          </thead>
          <tbody>
            ${solicitudes.map(s => `
              <tr>
                <td>${s._id}</td>
                <td>${s.createdAt ? new Date(s.createdAt).toLocaleString() : ''}</td>
                <td>${s.solicitanteId || ''}</td>
                <td>${s.hospitalId || s.hospital || ''}</td>
                <td>${s.prioridad || ''}</td>
                <td>${s.estado || ''}</td>
                <td>${s.comentarios || ''}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
    </html>
  `;
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  const pdfBuffer = await page.pdf({ format: 'A4' });
  await browser.close();
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=solicitudes.pdf');
  res.send(pdfBuffer);
}


async function exportInsumosXLSX(req, res) {
  const insumos = await Insumo.find().lean();
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Insumos');
  sheet.columns = [
    { header: 'Nombre', key: 'nombre', width: 40 },
    { header: 'Código', key: 'codigo', width: 20 },
    { header: 'Stock', key: 'stock', width: 10 },
    { header: 'Stock Mínimo', key: 'stockMinimo', width: 12 },
  ];
  insumos.forEach(i => sheet.addRow({ nombre: i.nombre, codigo: i.codigo, stock: i.stock, stockMinimo: i.stockMinimo }));
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename=insumos.xlsx');
  await workbook.xlsx.write(res);
  res.end();
}

// GET /api/reportes/insumos?hospitalId=...
// Exporta snapshot de inventario con stock y mínimos (según los campos que tengas).
async function exportInsumosCSV(req, res) {
  try {
    const { hospitalId } = req.query;
    const filter = {};
    if (hospitalId) filter.$or = [{ hospitalId }, { hospital: hospitalId }];

    const items = await Insumo.find(filter).lean();
    const rows = items.map(i => ({
      id: String(i._id),
      nombre: i.nombre || '',
      codigo: i.codigo || i.barcode || i.codigoBarras || '',
      categoria: i.categoriaId || i.categoria || '',
      stock: i.stock ?? i.cantidad ?? 0,
      minStock: i.minStock ?? i.stockMinimo ?? '',
      hospital: i.hospitalId || i.hospital || '',
    }));

    return sendCSV(res, 'inventario.csv', rows);
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
}

module.exports = {
  exportSolicitudesCSV,
  exportInsumosCSV,
};