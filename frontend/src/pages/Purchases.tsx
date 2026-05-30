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
} from "@mui/material";

import api from "../services/api";

interface Product {
  id: string;
  name: string;
}

interface Purchase {
  id: string;
  quantity: number;
  product: {
    name: string;
  };
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
    await api.post("/purchases", {
      productId,
      quantity: Number(quantity),
    });

    setQuantity("");
    loadPurchases();
  };

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Purchases
      </Typography>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Stack spacing={2}>
          <TextField
            select
            label="Product"
            value={productId}
            onChange={(e) =>
              setProductId(e.target.value)
            }
          >
            {products.map((product) => (
              <MenuItem
                key={product.id}
                value={product.id}
              >
                {product.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Quantity"
            type="number"
            value={quantity}
            onChange={(e) =>
              setQuantity(e.target.value)
            }
          />

          <Button
            variant="contained"
            onClick={savePurchase}
          >
            Save Purchase
          </Button>
        </Stack>
      </Paper>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell>Quantity</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {purchases.map((purchase) => (
              <TableRow key={purchase.id}>
                <TableCell>
                  {purchase.product.name}
                </TableCell>

                <TableCell>
                  {purchase.quantity}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </>
  );
}