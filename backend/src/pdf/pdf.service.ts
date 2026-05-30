import PDFDocument from 'pdfkit';
import type { Response } from 'express';

interface InvoicePrintData {
  invoiceNumber: string;
  createdAt: Date;
  customerName: string;
  customerPhone?: string | null;
  totalAmount: number;
  discount?: number;
  items: Array<{
    product?: { name: string } | null;
    quantity: number;
    price: number;
    gstPercentage: number;
    total: number;
  }>;
}

export class PdfService {
  static generateInvoice(invoice: InvoicePrintData, res: Response) {
    const doc = new PDFDocument({ margin: 50 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `inline; filename="invoice-${invoice.invoiceNumber}.pdf"`,
    );

    doc.pipe(res);

    const pageWidth = doc.page.width - 100;
    const leftMargin = 50;

    const rightAlign = (text: string, y: number) => {
      const width = doc.widthOfString(text);
      doc.text(text, pageWidth + leftMargin - width, y, { align: 'right' });
    };

    doc.fontSize(22).font('Helvetica-Bold').text('INVOICE', leftMargin, 50);
    doc.fontSize(10).font('Helvetica');

    doc.text(`Invoice #: ${invoice.invoiceNumber}`, leftMargin, 80);
    doc.text(
      `Date: ${new Date(invoice.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}`,
      leftMargin,
      95,
    );

    doc.moveDown(2);

    doc.fontSize(12).font('Helvetica-Bold').text('Bill To:', leftMargin);
    doc.fontSize(10).font('Helvetica');
    doc.text(invoice.customerName, leftMargin);
    if (invoice.customerPhone) {
      doc.text(`Phone: ${invoice.customerPhone}`);
    }

    doc.moveDown(2);

    const tableTop = doc.y;
    const col1 = leftMargin;
    const col2 = leftMargin + 200;
    const col3 = leftMargin + 310;
    const col4 = leftMargin + 370;
    const col5 = leftMargin + 430;

    doc.fontSize(10).font('Helvetica-Bold');
    doc
      .rect(leftMargin, tableTop - 5, pageWidth, 20)
      .fill('#f0f0f0')
      .stroke('#ccc');
    doc.fill('#000');
    doc.text('Item', col1 + 5, tableTop);
    doc.text('Qty', col2, tableTop);
    doc.text('Price', col3, tableTop);
    doc.text('GST', col4, tableTop);
    doc.text('Total', col5, tableTop);

    doc.font('Helvetica').fontSize(9);
    let y = tableTop + 22;

    invoice.items.forEach((item, i) => {
      if (i % 2 === 0) {
        doc.rect(leftMargin, y - 3, pageWidth, 18).fill('#fafafa');
      }
      doc.fill('#000');
      doc.text(item.product?.name || 'Item', col1 + 5, y);
      doc.text(String(item.quantity), col2, y);
      doc.text(`₹${Number(item.price).toFixed(2)}`, col3, y);
      doc.text(`${Number(item.gstPercentage).toFixed(1)}%`, col4, y);
      doc.text(`₹${Number(item.total).toFixed(2)}`, col5, y);
      y += 20;
    });

    doc.moveDown(2);

    doc.fontSize(11).font('Helvetica-Bold');

    const summaryX = leftMargin + 300;
    doc.text('Subtotal:', summaryX, y + 10);
    let summaryY = y + 10;

    if (invoice.discount) {
      summaryY += 18;
      doc.fontSize(10).font('Helvetica');
      doc.text('Discount:', summaryX, summaryY);
      rightAlign(`-₹${Number(invoice.discount).toFixed(2)}`, summaryY);
    }

    summaryY += 18;
    doc.fontSize(11).font('Helvetica');
    doc.text('GST (included in items)', summaryX, summaryY);

    doc.moveDown(1);
    doc
      .strokeColor('#ccc')
      .lineWidth(1)
      .moveTo(leftMargin, doc.y)
      .lineTo(pageWidth + leftMargin, doc.y)
      .stroke();

    doc.fontSize(14).font('Helvetica-Bold');
    doc.text('Total:', summaryX, doc.y + 5);
    rightAlign(`₹${Number(invoice.totalAmount).toFixed(2)}`, doc.y - 14);

    doc.fontSize(9).font('Helvetica');
    doc.text('Thank you for your business!', leftMargin, doc.y + 30, {
      align: 'center',
    });

    doc.end();
  }
}
