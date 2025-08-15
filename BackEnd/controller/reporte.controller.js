const Solicitud = require('../models/Solicitud');
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');

exports.insumosMasSolicitados = async (req, res) => {
  try {
    const { inicio, fin, formato } = req.query;
    if (!inicio || !fin) {
      return res.status(400).json({ message: 'Fechas inicio y fin son obligatorias' });
    }

    const fechaInicio = new Date(inicio);
    const fechaFin = new Date(fin);
    fechaFin.setHours(23, 59, 59, 999);

    // Agrupar solicitudes por insumo
    const data = await Solicitud.aggregate([
      {
        $match: {
          createdAt: { $gte: fechaInicio, $lte: fechaFin }
        }
      },
      {
        $group: {
          _id: '$insumo',
          total: { $sum: '$cantidad' }
        }
      },
      { $sort: { total: -1 } }
    ]);

    // PDF
    if (formato === 'pdf') {
      const doc = new PDFDocument();
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="reporte.pdf"');

      doc.pipe(res);
      doc.fontSize(18).text('Reporte - Insumos más solicitados', { align: 'center' });
      doc.moveDown();

      data.forEach(item => {
        doc.fontSize(12).text(`Insumo ID: ${item._id} - Total: ${item.total}`);
      });

      doc.end();
      return;
    }

    // Excel
    if (formato === 'excel') {
      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet('Reporte');

      sheet.columns = [
        { header: 'ID Insumo', key: 'id', width: 30 },
        { header: 'Total Solicitado', key: 'total', width: 20 }
      ];

      data.forEach(item => {
        sheet.addRow({ id: item._id, total: item.total });
      });

      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
      res.setHeader('Content-Disposition', 'attachment; filename="reporte.xlsx"');

      await workbook.xlsx.write(res);
      res.end();
      return;
    }

    return res.status(400).json({ message: 'Formato no soportado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error generando el reporte' });
  }
};
