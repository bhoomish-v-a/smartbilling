import type { Product, Category } from "../types/Product";
import { useEffect, useState } from "react";
import {
  Button,
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  IconButton,
  Box,
  Chip,
  MenuItem,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";

import api from "../services/api";
import ProductForm from "../components/ProductForm";

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const loadProducts = async () => {
    const [prodRes, catRes] = await Promise.all([
      api.get("/products"),
      api.get("/categories"),
    ]);
    setProducts(prodRes.data);
    setCategories(catRes.data);
  };

  useEffect(() => { loadProducts(); }, []);

  const deleteProduct = async (id: string) => {
    if (!window.confirm("Delete this product?")) return;
    await api.delete(`/products/${id}`);
    loadProducts();
  };

  const filtered = products.filter((p) => {
    const matchName = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = !categoryFilter || p.category?.id === categoryFilter;
    return matchName && matchCat;
  });

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4">Products</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => { setSelectedProduct(null); setOpen(true); }}>
          Add Product
        </Button>
      </Box>

      <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
        <TextField
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          slotProps={{ input: { startAdornment: <SearchIcon sx={{ mr: 1, color: "text.secondary" }} /> } }}
          sx={{ width: 320 }}
        />
        <TextField
          select
          label="Category"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          sx={{ width: 200 }}
        >
          <MenuItem value="">All Categories</MenuItem>
          {categories.map((c) => (
            <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
          ))}
        </TextField>
      </Box>

      <Paper elevation={0} sx={{ border: "1px solid", borderColor: "divider", overflow: "auto" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Price</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>GST %</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((product) => (
              <TableRow key={product.id} hover>
                <TableCell sx={{ fontWeight: 500 }}>{product.name}</TableCell>
                <TableCell>
                  {product.category ? (
                    <Chip label={product.category.name} size="small" variant="outlined" />
                  ) : (
                    <Typography variant="body2" color="text.secondary">-</Typography>
                  )}
                </TableCell>
                <TableCell>₹{Number(product.price).toFixed(2)}</TableCell>
                <TableCell>{product.gstPercentage}%</TableCell>
                <TableCell>
                  <Chip label={product.purchaseType.replace("_", " ")} size="small" color={product.purchaseType === "WITH_BILL" ? "primary" : "default"} variant="outlined" />
                </TableCell>
                <TableCell>
                  <Chip label={product.isActive ? "Active" : "Inactive"} size="small" color={product.isActive ? "success" : "error"} />
                </TableCell>
                <TableCell>
                  <IconButton size="small" onClick={() => { setSelectedProduct(product); setOpen(true); }}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" color="error" onClick={() => deleteProduct(product.id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography color="text.secondary" sx={{ py: 2 }}>
                    {search || categoryFilter ? "No products match your filters" : "No products yet"}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>

      <ProductForm
        open={open}
        product={selectedProduct}
        categories={categories}
        onClose={() => { setOpen(false); setSelectedProduct(null); }}
        onSuccess={loadProducts}
      />
    </Box>
  );
}
