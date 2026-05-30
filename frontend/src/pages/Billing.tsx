import { useEffect, useState } from "react";
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
} from "@mui/material";

import api from "../services/api";

interface Product {
  id: string;
  name: string;
  price: number;
  gstPercentage: number;
}

export default function Billing() {
  const [products, setProducts] = useState<Product[]>([]);

  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("");
  const navigate = useNavigate();

  const [customerName, setCustomerName] =
    useState("");

  const [customerPhone, setCustomerPhone] =
    useState("");

  const [discount, setDiscount] =
    useState(0);

  const [items, setItems] = useState<any[]>([]);

  const loadProducts = async () => {
    const res = await api.get("/products");
    setProducts(res.data);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const addItem = () => {
    const product = products.find(
      (p) => p.id === productId,
    );

    if (!product) return;

    setItems([
      ...items,
      {
        productId: product.id,
        name: product.name,
        quantity: Number(quantity),
        price: product.price,
        gst: product.gstPercentage,
      },
    ]);

    setQuantity("");
    setProductId("");
  };

  const removeItem = (index: number) => {
    setItems(
      items.filter((_, i) => i !== index),
    );
  };

  const subtotal = items.reduce(
    (sum, item) =>
      sum +
      item.price * item.quantity +
      (item.price *
        item.quantity *
        item.gst) /
        100,
    0,
  );

  const grandTotal =
    subtotal - Number(discount || 0);

  const createInvoice = async () => {
  if (items.length === 0) {
    alert("Add items first");
    return;
  }

  const res = await api.post(
    "/invoices",
    {
      customerName:
        customerName ||
        "Walk In Customer",

      customerPhone,

      items: items.map((i) => ({
        productId: i.productId,
        quantity: i.quantity,
      })),
    },
  );

  setItems([]);
  setCustomerName("");
  setCustomerPhone("");
  setDiscount(0);

  navigate(
    `/invoices/${res.data.id}`,
  );
};

  return (
    <>
      <Typography
        variant="h4"
        gutterBottom
      >
        Billing
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Stack spacing={2}>
          <TextField
            label="Customer Name"
            value={customerName}
            onChange={(e) =>
              setCustomerName(
                e.target.value,
              )
            }
            fullWidth
          />

          <TextField
            label="Customer Phone"
            value={customerPhone}
            onChange={(e) =>
              setCustomerPhone(
                e.target.value,
              )
            }
            fullWidth
          />

          <TextField
            select
            label="Product"
            value={productId}
            onChange={(e) =>
              setProductId(
                e.target.value,
              )
            }
            fullWidth
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
              setQuantity(
                e.target.value,
              )
            }
            fullWidth
          />

          <Button
            variant="contained"
            onClick={addItem}
          >
            Add Item
          </Button>
        </Stack>
      </Paper>

      <Paper sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                Product
              </TableCell>

              <TableCell>
                Qty
              </TableCell>

              <TableCell>
                Price
              </TableCell>

              <TableCell>
                GST %
              </TableCell>

              <TableCell>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {items.map(
              (item, index) => (
                <TableRow
                  key={index}
                >
                  <TableCell>
                    {item.name}
                  </TableCell>

                  <TableCell>
                    {item.quantity}
                  </TableCell>

                  <TableCell>
                    ₹{item.price}
                  </TableCell>

                  <TableCell>
                    {item.gst}%
                  </TableCell>

                  <TableCell>
                    <Button
                      color="error"
                      onClick={() =>
                        removeItem(
                          index,
                        )
                      }
                    >
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ),
            )}
          </TableBody>
        </Table>
      </Paper>

      <Paper
        sx={{
          mt: 3,
          p: 2,
        }}
      >
        <TextField
          label="Discount"
          type="number"
          value={discount}
          onChange={(e) =>
            setDiscount(
              Number(
                e.target.value,
              ),
            )
          }
        />

        <Typography
          variant="h6"
          sx={{ mt: 2 }}
        >
          Sub Total: ₹
          {subtotal.toFixed(2)}
        </Typography>

        <Typography
          variant="h5"
          sx={{ mt: 1 }}
        >
          Grand Total: ₹
          {grandTotal.toFixed(2)}
        </Typography>

        <Button
          variant="contained"
          color="success"
          sx={{ mt: 2 }}
          onClick={createInvoice}
        >
          Generate Invoice
        </Button>
      </Paper>
    </>
  );
}