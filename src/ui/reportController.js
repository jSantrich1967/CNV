/**
 * Report Controller - Integración Acciones UI CBCNV
 */

import { ReportingEngine } from '../logic/reports.js';
import { AuditLogger } from '../security/audit.js';

export class ReportController {
    constructor(currentUser) {
        this.reporter = new ReportingEngine();
        this.audit = new AuditLogger();
        this.user = currentUser;
    }

    /**
     * Exporta datos a Excel usando SheetJS
     */
    exportToExcel(data, filename) {
        const wb = XLSX.utils.book_new();

        // Aplanar datos para Excel
        const rows = [];
        rows.push([data.encabezado.entidad]);
        rows.push([data.encabezado.reporte]);
        rows.push([`Fecha: ${data.encabezado.fechaCorte || data.encabezado.fecha}`]);
        rows.push([]); // Espacio

        if (data.cuerpo) { // Forma A
            rows.push(["Código", "Cuenta", "Saldo (Bs.)"]);
            data.cuerpo.forEach(g => {
                rows.push([g.codigo, g.descripcion, g.saldo]);
                g.detalles.forEach(d => rows.push([d.codigo, d.descripcion, d.saldo]));
            });
        } else if (data.secciones) { // Forma B
            data.secciones.forEach(sec => {
                rows.push([sec.nombre, "", sec.subtotal]);
                sec.cuentas.forEach(c => rows.push([c.codigo, c.d, m]));
            });
        }

        const ws = XLSX.utils.aoa_to_sheet(rows);
        XLSX.utils.book_append_sheet(wb, ws, "Reporte");
        XLSX.writeFile(wb, `${filename}.xlsx`);
    }

    /**
     * Exporta a PDF usando jsPDF
     */
    exportToPDF(data, filename) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.text(data.encabezado.entidad, 14, 22);
        doc.setFontSize(14);
        doc.text(data.encabezado.reporte, 14, 30);
        doc.setFontSize(10);
        doc.text(`Fecha Emisión: ${new Date().toLocaleString()}`, 14, 38);

        const tableData = [];
        if (data.cuerpo) {
            data.cuerpo.forEach(g => {
                tableData.push([g.codigo, g.descripcion, g.saldo.toLocaleString('es-VE')]);
                g.detalles.forEach(d => tableData.push(["  " + d.codigo, "  " + d.descripcion, d.saldo.toLocaleString('es-VE')]));
            });
        }

        doc.autoTable({
            startY: 45,
            head: [['Código', 'Descripción de Cuenta', 'Saldo (Bs.)']],
            body: tableData,
            theme: 'striped',
            headStyles: { fillColor: [0, 51, 102] }
        });

        doc.save(`${filename}.pdf`);
    }

    /**
     * Maneja el click en "Generar Balance Forma A"
     */
    handleGenerateBalance(format = 'PDF') {
        const data = this.reporter.generateBalanceFormaA();
        if (format === 'EXCEL') this.exportToExcel(data, "Forma_A_CBCNV");
        else this.exportToPDF(data, "Forma_A_CBCNV");

        this.audit.log(this.user, `EXPORT_${format}_A`, "REPORTES", "Balance Forma A exportado.");
        return data;
    }

    handleGenerateFormaB(format = 'PDF') {
        const data = this.reporter.generateFormaB();
        this.exportToPDF(data, "Forma_B_CBCNV");
        return data;
    }

    handleGenerateFormaC(format = 'PDF') {
        const data = this.reporter.generateFormaC();
        this.exportToPDF(data, "Forma_C_CBCNV");
        return data;
    }
}
