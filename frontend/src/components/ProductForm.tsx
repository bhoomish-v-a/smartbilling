import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  MenuItem,
  Stack,
  Alert,
  Snackbar,
} from "@mui/material";

import api from "../services/api";
import type { Category } from "../types/Product";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  product?: any;
  categories: Category[];
}

export default function ProductForm({ open, onClose, onSuccess, product, categories }: Props) {
  const [form, setForm] = useState({
    name: "",
    categoryId: "",
    price: "",
    gstPercentage: "",
    purchaseType: "WITH_BILL",
  });
  const [catDialogOpen, setCatDialogOpen] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [snackbar, setSnackbar] = useState<{ msg: string; severity: "success" | "error" } | null>(null);

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || "",
        categoryId: product.categoryId || "",
        price: String(product.price || ""),
        gstPercentage: String(product.gstPercentage || ""),
        purchaseType: product.purchaseType || "WITH_BILL",
      });
    } else {
      setForm({ name: "", categoryId: "", price: "", gstPercentage: "", purchaseType: "WITH_BILL" });
    }
  }, [product, open]);

  const save = async () => {
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        gstPercentage: Number(form.gstPercentage),
        categoryId: form.categoryId || undefined,
      };

      if (product?.id) {
        await api.put(`/products/${product.id}`, payload);
      } else {
        await api.post("/products", payload);
      }

      setSnackbar({ msg: product ? "Product updated" : "Product created", severity: "success" });
      onSuccess();
      onClose();
    } catch (err: any) {
      const msg = err?.response?.data?.message?.[0] || err?.response?.data?.message || "Failed to save product";
      setSnackbar({ msg, severity: "error" });
    }
  };

  const saveCategory = async () => {
    if (!newCatName.trim()) return;
    try {
      const res = await api.post("/categories", { name: newCatName });
      const newCat: Category = res.data;
      setCatDialogOpen(false);
      setNewCatName("");
      setSnackbar({ msg: "Category created", severity: "success" });
      onSuccess();
      setForm((prev) => ({ ...prev, categoryId: newCat.id }));
    } catch (err: any) {
      const msg = err?.response?.data?.message?.[0] || err?.response?.data?.message || "Failed to create category";
      setSnackbar({ msg, severity: "error" });
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>{product ? "Edit Product" : "Add Product"}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1, width: 350 }}>
            <TextField label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <TextField select label="Category" value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
              <MenuItem value="">No Category</MenuItem>
              {categories.map((c) => (
                <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
              ))}
            </TextField>
            <Button variant="outlined" size="small" onClick={() => setCatDialogOpen(true)}>
              + Add New Category
            </Button>
            <TextField label="Price" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            <TextField label="GST %" type="number" value={form.gstPercentage} onChange={(e) => setForm({ ...form, gstPercentage: e.target.value })} />
            <TextField select label="Purchase Type" value={form.purchaseType} onChange={(e) => setForm({ ...form, purchaseType: e.target.value })}>
              <MenuItem value="WITH_BILL">WITH_BILL</MenuItem>
              <MenuItem value="WITHOUT_BILL">WITHOUT_BILL</MenuItem>
            </TextField>
            <Button variant="contained" onClick={save}>Save</Button>
          </Stack>
        </DialogContent>
      </Dialog>

      <Dialog open={catDialogOpen} onClose={() => setCatDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Add New Category</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Category Name" value={newCatName} onChange={(e) => setNewCatName(e.target.value)} autoFocus />
            <Button variant="contained" onClick={saveCategory} disabled={!newCatName.trim()}>Save</Button>
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
    </>
  );
}
