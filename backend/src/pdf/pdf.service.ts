import PDFDocument from 'pdfkit';

export class PdfService {
  static generateInvoice(
    invoice: any,
    res: any,
  ) {
    const doc =
      new PDFDocument();

    res.setHeader(
      'Content-Type',
      'application/pdf',
    );

    doc.pipe(res);

    doc.fontSize(20).text(
      'Smart Billing',
    );

    doc.moveDown();

    doc.text(
      `Invoice No: ${invoice.invoiceNumber}`,
    );

    doc.text(
      `Customer: ${invoice.customerName}`,
    );

    doc.text(
      `Phone: ${invoice.customerPhone}`,
    );

    doc.moveDown();

    invoice.items.forEach(
      (item: any) => {
        doc.text(
          `${item.product.name} | Qty: ${item.quantity}`,
        );
      },
    );

    doc.moveDown();

    doc.text(
      `Total: ₹${invoice.totalAmount}`,
    );

    doc.end();
  }
}