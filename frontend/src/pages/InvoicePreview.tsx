import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Paper,
  Typography,
  Button,
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Skeleton,
} from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import PrintIcon from "@mui/icons-material/Print";

import api from "../services/api";

export default function InvoicePreview() {
  const { id } = useParams();
  const [invoice, setInvoice] = useState<any>(null);

  useEffect(() => {
    api.get(`/invoices/${id}`).then((res) => setInvoice(res.data));
  }, [id]);

  if (!invoice) {
    return <Skeleton variant="rectangular" height={400} />;
  }

  return (
    <Paper elevation={0} sx={{ p: 4, maxWidth: 700, mx: "auto", border: "1px solid", borderColor: "divider" }}>
      <Box sx={{ textAlign: "center", mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>Smart Billing</Typography>
        <Typography variant="body2" color="text.secondary">Invoice</Typography>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Box>
          <Typography variant="body2" color="text.secondary">Invoice No</Typography>
          <Typography sx={{ fontWeight: 600 }}>{invoice.invoiceNumber}</Typography>
        </Box>
        <Box sx={{ textAlign: "right" }}>
          <Typography variant="body2" color="text.secondary">Date</Typography>
          <Typography>{new Date(invoice.createdAt).toLocaleDateString("en-IN")}</Typography>
        </Box>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" color="text.secondary">Bill To</Typography>
        <Typography sx={{ fontWeight: 500 }}>{invoice.customerName}</Typography>
        {invoice.customerPhone && <Typography variant="body2">{invoice.customerPhone}</Typography>}
      </Box>

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 600 }}>Item</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Qty</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Price</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Total</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {invoice.items?.map((item: any) => (
            <TableRow key={item.id}>
              <TableCell>{item.product?.name}</TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>₹{Number(item.price).toFixed(2)}</TableCell>
              <TableCell sx={{ fontWeight: 500 }}>₹{Number(item.total).toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Box sx={{ textAlign: "right", mt: 3 }}>
        {invoice.discount > 0 && (
          <Typography variant="body2" color="text.secondary">
            Discount: -₹{Number(invoice.discount).toFixed(2)}
          </Typography>
        )}
        <Typography variant="h5" sx={{ fontWeight: 700 }} color="primary">
          Total: ₹{Number(invoice.totalAmount).toFixed(2)}
        </Typography>
      </Box>

      <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
        <Button
          variant="contained"
          startIcon={<PictureAsPdfIcon />}
          onClick={() => window.open(`http://localhost:3000/invoices/${id}/pdf`, "_blank")}
        >
          Download PDF
        </Button>
        <Button
          variant="outlined"
          startIcon={<PrintIcon />}
          onClick={() => window.print()}
        >
          Print
        </Button>
      </Box>
    </Paper>
  );
}
