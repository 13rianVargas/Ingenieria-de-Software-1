package co.edu.konrad.pqrs.infrastructure.reporte;

import co.edu.konrad.pqrs.domain.model.Pqrs;
import com.lowagie.text.Document;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.stereotype.Component;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;
import java.util.List;

/** Renderiza un PDF con la bandeja de PQRS. Columnas: Radicado, Fecha, Tipo, Estado, Asunto. */
@Component
public class GeneradorReportePdf {

    private static final DateTimeFormatter FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

    public byte[] generar(List<Pqrs> pqrsList) {
        Document doc = new Document(PageSize.A4.rotate(), 36, 36, 54, 36);
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        PdfWriter.getInstance(doc, out);
        doc.open();

        Font titulo = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16);
        Paragraph p = new Paragraph("Reporte de PQRS — SuperMarket Konrad", titulo);
        p.setSpacingAfter(12f);
        doc.add(p);

        Font meta = FontFactory.getFont(FontFactory.HELVETICA, 9, Color.DARK_GRAY);
        doc.add(new Paragraph("Total registros: " + pqrsList.size(), meta));
        doc.add(new Paragraph(" "));

        PdfPTable table = new PdfPTable(new float[]{2.2f, 2.2f, 1.6f, 1.8f, 4f});
        table.setWidthPercentage(100);
        encabezado(table, "Radicado", "Fecha", "Tipo", "Estado", "Asunto");

        Font celda = FontFactory.getFont(FontFactory.HELVETICA, 9);
        for (Pqrs q : pqrsList) {
            table.addCell(new PdfPCell(new com.lowagie.text.Phrase(q.getRadicado(), celda)));
            table.addCell(new PdfPCell(new com.lowagie.text.Phrase(
                    q.getFechaRadicado() != null ? q.getFechaRadicado().format(FMT) : "", celda)));
            table.addCell(new PdfPCell(new com.lowagie.text.Phrase(q.getTipo().name(), celda)));
            table.addCell(new PdfPCell(new com.lowagie.text.Phrase(q.getEstado().name(), celda)));
            table.addCell(new PdfPCell(new com.lowagie.text.Phrase(q.getAsunto(), celda)));
        }

        doc.add(table);
        doc.close();
        return out.toByteArray();
    }

    private void encabezado(PdfPTable table, String... titulos) {
        Font th = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, Color.WHITE);
        for (String t : titulos) {
            PdfPCell c = new PdfPCell(new com.lowagie.text.Phrase(t, th));
            c.setBackgroundColor(new Color(45, 62, 80));
            c.setHorizontalAlignment(Element.ALIGN_LEFT);
            c.setPadding(5f);
            table.addCell(c);
        }
    }
}
