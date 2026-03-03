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
            headStyles: { fillColor: [0, 51, 102], halign: 'center' },
            columnStyles: {
                2: { halign: 'right' } // Alinear el Saldo a la derecha
            }
        });

        doc.save(`${filename}.pdf`);
    }

    /**
     * Renderiza una vista previa del reporte en el DOM
     */
    renderPreview(data) {
        const container = document.getElementById('preview-container');
        const section = document.getElementById('preview-section');
        const title = document.getElementById('preview-title');

        section.style.display = 'block';
        title.innerText = `Vista Previa: ${data.encabezado.reporte}`;

        let html = `
            <div style="text-align: center; margin-bottom: 2rem; border-bottom: 1px solid var(--bg-tertiary); padding-bottom: 1rem;">
                <h2 style="color: var(--accent-gold); margin: 0;">${data.encabezado.entidad}</h2>
                <p style="margin: 5px 0;">RIF: ${data.encabezado.rif || 'J-12345678-9'}</p>
                <h3 style="margin-top: 10px;">${data.encabezado.reporte}</h3>
                <p>Fecha de Corte: ${data.encabezado.fechaCorte || data.encabezado.fecha}</p>
            </div>
            <table class="data-table">
                <thead>
                    <tr><th>Código</th><th>Descripción</th><th style="text-align: right;">Saldo (Bs.)</th></tr>
                </thead>
                <tbody>
        `;

        if (data.cuerpo) {
            data.cuerpo.forEach(g => {
                html += `<tr style="font-weight: bold; background: rgba(255,255,255,0.05);">
                    <td>${g.codigo}</td><td>${g.descripcion}</td><td style="text-align: right;">${g.saldo.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td></tr>`;
                g.detalles.forEach(d => {
                    html += `<tr><td style="padding-left: 20px;">${d.codigo}</td><td style="padding-left: 20px;">${d.descripcion}</td><td style="text-align: right;">${d.saldo.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td></tr>`;
                });
            });
        }

        html += `</tbody></table>`;
        if (data.notas) {
            html += `
                <div style="margin-top: 2rem; padding: 1.5rem; background: rgba(255,255,255,0.03); border-radius: 8px; font-size: 0.85rem;">
                    <h4 style="color: var(--accent-gold); margin-bottom: 0.5rem;">NOTAS EXPLICATIVAS</h4>
                    <p style="color: var(--text-secondary); line-height: 1.4;">${data.notas}</p>
                </div>
            `;
        }
        container.innerHTML = html;
        section.scrollIntoView({ behavior: 'smooth' });
    }

    /**
     * Maneja el click en "Generar Balance Forma A"
     */
    handleGenerateBalance(format = 'PDF') {
        const data = this.reporter.generateBalanceFormaA();
        if (format === 'PREVIEW') {
            this.renderPreview(data);
        } else if (format === 'EXCEL') {
            this.exportToExcel(data, "Forma_A_CBCNV");
        } else {
            this.exportToPDF(data, "Forma_A_CBCNV");
        }

        this.audit.log(this.user, `REPORT_ACTION_${format}_A`, "REPORTES", "Balance Forma A procesado.");
        return data;
    }

    handleGenerateFormaB(format = 'PDF') {
        const data = this.reporter.generateFormaB();
        if (format === 'PREVIEW') {
            this.renderPreview({
                encabezado: data.encabezado,
                cuerpo: data.secciones.map(s => ({
                    codigo: "", descripcion: s.nombre, saldo: s.subtotal,
                    detalles: s.cuentas.map(c => ({ codigo: c.codigo, descripcion: c.d, saldo: c.m }))
                }))
            });
        } else {
            this.exportToPDF(data, "Forma_B_CBCNV");
        }
        return data;
    }

    handleGenerateFormaC(format = 'PDF') {
        const data = this.reporter.generateFormaC();
        if (format === 'PREVIEW') {
            this.renderPreview({
                encabezado: data.encabezado,
                cuerpo: [{
                    codigo: "300", descripcion: "PATRIMONIO", saldo: data.totalPatrimonio,
                    detalles: data.movimientos.map(m => ({ codigo: "", descripcion: m.cuenta, saldo: m.saldoFinal }))
                }]
            });
        } else {
            this.exportToPDF(data, "Forma_C_CBCNV");
        }
        return data;
    }
}
