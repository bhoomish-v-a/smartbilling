import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Stack,
  Box,
  IconButton,
  Autocomplete,
  Dialog,
  DialogTitle,
  DialogContent,
  Alert,
  Snackbar,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import ReceiptIcon from "@mui/icons-material/Receipt";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

import api from "../services/api";
import type { Customer, Category } from "../types/Product";

interface ProductItem {
  id: string;
  name: string;
  price: number;
  gstPercentage: number;
  categoryId: string;
}

export default function Billing() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [categoryFilter, setCategoryFilter] = useState("");
  const navigate = useNavigate();
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [discount, setDiscount] = useState(0);
  const [items, setItems] = useState<any[]>([]);
  const [newCustOpen, setNewCustOpen] = useState(false);
  const [newCustForm, setNewCustForm] = useState({ name: "", phone: "" });
  const [snackbar, setSnackbar] = useState<{ msg: string; severity: "success" | "error" } | null>(null);
  const productSelectRef = useRef<HTMLInputElement>(null);

  const loadData = async () => {
    try {
      const [prodRes, catRes, custRes] = await Promise.all([
        api.get("/products"),
        api.get("/categories"),
        api.get("/customers"),
      ]);
      setProducts(prodRes.data);
      setCategories(catRes.data);
      setCustomers(custRes.data);
    } catch {
      setSnackbar({ msg: "Failed to load data", severity: "error" });
    }
  };

  useEffect(() => { loadData(); }, []);

  const filteredProducts = products.filter(
    (p) => !categoryFilter || p.categoryId === categoryFilter
  );

  const addItem = () => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;
    setItems([...items, {
      productId: product.id,
      name: product.name,
      quantity: Number(quantity),
      price: product.price,
      gst: product.gstPercentage,
    }]);
    setQuantity("1");
    setProductId("");
    productSelectRef.current?.focus();
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity, 0
  );
  const totalGst = items.reduce(
    (sum, item) => sum + (item.price * item.quantity * item.gst) / 100, 0
  );
  const grandTotal = subtotal + totalGst - discount;

  const createNewCustomer = async () => {
    if (!newCustForm.name.trim()) return;
    try {
      const res = await api.post("/customers", newCustForm);
      const newCust: Customer = res.data;
      setCustomers([...customers, newCust]);
      setSelectedCustomer(newCust);
      setCustomerName(newCust.name);
      setCustomerPhone(newCust.phone || "");
      setNewCustOpen(false);
      setNewCustForm({ name: "", phone: "" });
    } catch {
      setSnackbar({ msg: "Failed to create customer", severity: "error" });
    }
  };

  const handleCustomerChange = (_: any, value: Customer | string | null) => {
    if (typeof value === "string") {
      setCustomerName(value);
      setSelectedCustomer(null);
    } else if (value) {
      setSelectedCustomer(value);
      setCustomerName(value.name);
      setCustomerPhone(value.phone || "");
    } else {
      setSelectedCustomer(null);
      setCustomerName("");
      setCustomerPhone("");
    }
  };

  const createInvoice = async () => {
    if (items.length === 0) { alert("Add items first"); return; }
    if (discount > subtotal + totalGst) {
      setSnackbar({ msg: "Discount cannot exceed total amount", severity: "error" });
      return;
    }
    try {
      const res = await api.post("/invoices", {
        customerId: selectedCustomer?.id || undefined,
        customerName: customerName || "Walk In Customer",
        customerPhone,
        discount: Number(discount) || 0,
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
      });
      setItems([]);
      setCustomerName("");
      setCustomerPhone("");
      setDiscount(0);
      setSelectedCustomer(null);
      navigate(`/invoices/${res.data.id}`);
    } catch (err: any) {
      const msg = err?.response?.data?.message?.[0] || err?.response?.data?.message || "Failed to create invoice";
      setSnackbar({ msg, severity: "error" });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && productId && quantity) {
      addItem();
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>Billing</Typography>

      <Paper elevation={0} sx={{ p: 2, mb: 2, border: "1px solid", borderColor: "divider" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
          <Autocomplete
            options={customers}
            getOptionLabel={(o) => (typeof o === "string" ? o : `${o.name}${o.phone ? ` (${o.phone})` : ""}`)}
            value={selectedCustomer}
            onChange={handleCustomerChange}
            freeSolo
            sx={{ minWidth: 250, flex: 1 }}
            renderInput={(params) => (
              <TextField {...params} label="Search or type name" size="small" />
            )}
          />
          <TextField label="Name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} size="small" sx={{ minWidth: 160, flex: 1 }} />
          <TextField label="Phone" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} size="small" sx={{ minWidth: 140, flex: 1 }} />
          <Button size="small" startIcon={<PersonAddIcon />} onClick={() => setNewCustOpen(true)}>
            New
          </Button>
        </Box>
      </Paper>

      <Paper elevation={0} sx={{ p: 2, mb: 2, border: "1px solid", borderColor: "divider" }}>
        <Box sx={{ display: "flex", gap: 1.5, alignItems: "center", flexWrap: "wrap" }}>
          <TextField
            select
            label="Category"
            value={categoryFilter}
            onChange={(e) => { setCategoryFilter(e.target.value); setProductId(""); }}
            size="small"
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="">All</MenuItem>
            {categories.map((c) => (
              <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Product"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            size="small"
            sx={{ minWidth: 220, flex: 1 }}
            inputRef={productSelectRef}
          >
            {filteredProducts.map((p) => (
              <MenuItem key={p.id} value={p.id}>{p.name} - ₹{p.price}</MenuItem>
            ))}
            {filteredProducts.length === 0 && (
              <MenuItem disabled>No products</MenuItem>
            )}
          </TextField>
          <TextField
            label="Qty"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            size="small"
            sx={{ width: 80 }}
            onKeyDown={handleKeyDown}
          />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={addItem}
            disabled={!productId || !quantity}
            sx={{ whiteSpace: "nowrap" }}
          >
            Add Item
          </Button>
        </Box>
      </Paper>

      <Paper elevation={0} sx={{ mb: 2, border: "1px solid", borderColor: "divider", overflow: "auto", maxHeight: 300 }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Product</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Qty</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Price</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>GST</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Total</TableCell>
              <TableCell sx={{ fontWeight: 600 }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item, index) => {
              const lineTotal = item.price * item.quantity + (item.price * item.quantity * item.gst) / 100;
              return (
                <TableRow key={index} hover>
                  <TableCell sx={{ fontWeight: 500 }}>{item.name}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>₹{Number(item.price).toFixed(2)}</TableCell>
                  <TableCell>{item.gst}%</TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>₹{lineTotal.toFixed(2)}</TableCell>
                  <TableCell>
                    <IconButton size="small" color="error" onClick={() => removeItem(index)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
            {items.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography color="text.secondary" sx={{ py: 2 }}>No items added yet</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>

      <Paper elevation={0} sx={{ p: 2, border: "1px solid", borderColor: "divider" }}>
        <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 3, flexWrap: "wrap" }}>
          <Box sx={{ textAlign: "right" }}>
            <Typography variant="body2" color="text.secondary">Subtotal</Typography>
            <Typography sx={{ fontWeight: 600 }}>₹{subtotal.toFixed(2)}</Typography>
          </Box>
          <Box sx={{ textAlign: "right" }}>
            <Typography variant="body2" color="text.secondary">GST</Typography>
            <Typography sx={{ fontWeight: 600 }}>₹{totalGst.toFixed(2)}</Typography>
          </Box>
          <TextField
            label="Discount (₹)"
            type="number"
            value={discount}
            onChange={(e) => setDiscount(Number(e.target.value))}
            size="small"
            sx={{ width: 130 }}
          />
          <Box sx={{ textAlign: "right" }}>
            <Typography variant="body2" color="text.secondary">Grand Total</Typography>
            <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
              ₹{grandTotal.toFixed(2)}
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="success"
            size="large"
            startIcon={<ReceiptIcon />}
            onClick={createInvoice}
            disabled={items.length === 0}
          >
            Generate Invoice
          </Button>
        </Box>
      </Paper>

      <Dialog open={newCustOpen} onClose={() => setNewCustOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>Quick Add Customer</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Name" value={newCustForm.name} onChange={(e) => setNewCustForm({ ...newCustForm, name: e.target.value })} autoFocus />
            <TextField label="Phone" value={newCustForm.phone} onChange={(e) => setNewCustForm({ ...newCustForm, phone: e.target.value })} />
            <Button variant="contained" onClick={createNewCustomer} disabled={!newCustForm.name.trim()}>Add & Select</Button>
          </Stack>
        </DialogContent>
      </Dialog>

      {snackbar && (
        <Snackbar open autoHideDuration={4000} onClose={() => setSnackbar(null)} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
          <Alert severity={snackbar.severity} onClose={() => setSnackbar(null)} sx={{ width: "100%" }}>
            {snackbar.msg}
          </Alert>
        </Snackbar>
      )}
    </Box>
  );
}
