import { useEffect, useState } from "react";
import {
  Button,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Box,
  Chip,
} from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";

import api from "../services/api";

interface Product {
  id: string;
  name: string;
}

interface Purchase {
  id: string;
  quantity: number;
  createdAt: string;
  product: { name: string };
}

export default function Purchases() {
  const [products, setProducts] = useState<Product[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("");

  const loadProducts = async () => {
    const res = await api.get("/products");
    setProducts(res.data);
  };

  const loadPurchases = async () => {
    const res = await api.get("/purchases");
    setPurchases(res.data);
  };

  useEffect(() => {
    loadProducts();
    loadPurchases();
  }, []);

  const savePurchase = async () => {
    if (!productId || !quantity) return;
    await api.post("/purchases", {
      productId,
      quantity: Number(quantity),
    });
    setQuantity("");
    loadPurchases();
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Purchases
      </Typography>

      <Paper elevation={0} sx={{ p: 3, mb: 3, maxWidth: 500, border: "1px solid", borderColor: "divider" }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }} gutterBottom>
          Record Purchase
        </Typography>
        <Stack spacing={2}>
          <TextField
            select
            label="Product"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            fullWidth
          >
            {products.map((product) => (
              <MenuItem key={product.id} value={product.id}>
                {product.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Quantity"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            fullWidth
          />
          <Button
            variant="contained"
            startIcon={<AddShoppingCartIcon />}
            onClick={savePurchase}
            disabled={!productId || !quantity}
          >
            Save Purchase
          </Button>
        </Stack>
      </Paper>

      <Paper elevation={0} sx={{ border: "1px solid", borderColor: "divider" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Product</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Quantity</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {purchases.map((purchase) => (
              <TableRow key={purchase.id} hover>
                <TableCell>
                  <Chip label={purchase.product.name} size="small" variant="outlined" />
                </TableCell>
                <TableCell sx={{ fontWeight: 500 }}>{purchase.quantity}</TableCell>
                <TableCell>
                  {new Date(purchase.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </TableCell>
              </TableRow>
            ))}
            {purchases.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  <Typography color="text.secondary" sx={{ py: 2 }}>
                    No purchases recorded yet
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}
