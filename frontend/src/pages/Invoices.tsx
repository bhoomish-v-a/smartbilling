import { useEffect, useState } from "react";
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Chip,
  IconButton,
  TablePagination,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

import api from "../services/api";

export default function Invoices() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const rowsPerPage = 20;

  const loadInvoices = async (p = 0) => {
    const res = await api.get(`/invoices?page=${p + 1}&limit=${rowsPerPage}`);
    setInvoices(res.data.data);
    setTotal(res.data.meta.total);
  };

  useEffect(() => {
    loadInvoices(page);
  }, [page]);

  const viewInvoice = async (id: string) => {
    const res = await api.get(`/invoices/${id}`);
    setSelectedInvoice(res.data);
  };

  const filtered = invoices.filter(
    (inv) =>
      inv.invoiceNumber?.toLowerCase().includes(search.toLowerCase()) ||
      inv.customerName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Invoices
      </Typography>

      <TextField
        placeholder="Search by invoice no or customer..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        slotProps={{ input: { startAdornment: <SearchIcon sx={{ mr: 1, color: "text.secondary" }} /> } }}
        sx={{ mb: 2, width: 360 }}
      />

      <Paper elevation={0} sx={{ border: "1px solid", borderColor: "divider" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Invoice No</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Customer</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Amount</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((invoice) => (
              <TableRow key={invoice.id} hover>
                <TableCell sx={{ fontWeight: 500 }}>{invoice.invoiceNumber}</TableCell>
                <TableCell>{invoice.customerName}</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>₹{Number(invoice.totalAmount).toLocaleString()}</TableCell>
                <TableCell>
                  <Chip
                    label={invoice.billType}
                    size="small"
                    color={invoice.billType === "GST" ? "primary" : "default"}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  {new Date(invoice.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </TableCell>
                <TableCell>
                  <IconButton size="small" onClick={() => viewInvoice(invoice.id)}>
                    <VisibilityIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => window.open(`http://localhost:3000/invoices/${invoice.id}/pdf`, "_blank")}
                  >
                    <PictureAsPdfIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography color="text.secondary" sx={{ py: 2 }}>
                    {search ? "No invoices match your search" : "No invoices yet"}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={total}
          page={page}
          onPageChange={(_, p) => setPage(p)}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[rowsPerPage]}
        />
      </Paper>

      <Dialog open={!!selectedInvoice} onClose={() => setSelectedInvoice(null)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>
          Invoice {selectedInvoice?.invoiceNumber}
        </DialogTitle>
        <DialogContent>
          {selectedInvoice && (
            <Box>
              <Box sx={{ display: "flex", gap: 4, mb: 3, flexWrap: "wrap" }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">Customer</Typography>
                  <Typography sx={{ fontWeight: 500 }}>{selectedInvoice.customerName}</Typography>
                </Box>
                {selectedInvoice.customerPhone && (
                  <Box>
                    <Typography variant="body2" color="text.secondary">Phone</Typography>
                    <Typography>{selectedInvoice.customerPhone}</Typography>
                  </Box>
                )}
                <Box>
                  <Typography variant="body2" color="text.secondary">Bill Type</Typography>
                  <Chip label={selectedInvoice.billType} size="small" variant="outlined" />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">Total</Typography>
                  <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
                    ₹{Number(selectedInvoice.totalAmount).toLocaleString()}
                  </Typography>
                </Box>
              </Box>

              <Typography variant="subtitle2" sx={{ mb: 1 }}>Items</Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Product</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Qty</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Price</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>GST</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>CGST</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>SGST</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedInvoice.items?.map((item: any) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.product?.name}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>₹{Number(item.price).toFixed(2)}</TableCell>
                      <TableCell>{item.gstPercentage}%</TableCell>
                      <TableCell>₹{Number(item.cgstAmount).toFixed(2)}</TableCell>
                      <TableCell>₹{Number(item.sgstAmount).toFixed(2)}</TableCell>
                      <TableCell sx={{ fontWeight: 500 }}>₹{Number(item.total).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => window.open(`http://localhost:3000/invoices/${selectedInvoice.id}/pdf`, "_blank")}
                  startIcon={<PictureAsPdfIcon />}
                >
                  Download PDF
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => window.print()}
                >
                  Print
                </Button>
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
