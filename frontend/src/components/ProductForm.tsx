import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  MenuItem,
  Stack,
} from "@mui/material";

import api from "../services/api";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  product?: any;
}

export default function ProductForm({
  open,
  onClose,
  onSuccess,
  product,
}: Props) {
  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    gstPercentage: "",
    purchaseType: "WITH_BILL",
  });

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || "",
        category: product.category || "",
        price: String(product.price || ""),
        gstPercentage: String(
          product.gstPercentage || "",
        ),
        purchaseType:
          product.purchaseType ||
          "WITH_BILL",
      });
    } else {
      setForm({
        name: "",
        category: "",
        price: "",
        gstPercentage: "",
        purchaseType: "WITH_BILL",
      });
    }
  }, [product, open]);

  const save = async () => {
    const payload = {
      ...form,
      price: Number(form.price),
      gstPercentage: Number(
        form.gstPercentage,
      ),
    };

    if (product?.id) {
      await api.put(
        `/products/${product.id}`,
        payload,
      );
    } else {
      await api.post(
        "/products",
        payload,
      );
    }

    onSuccess();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
    >
      <DialogTitle>
        {product
          ? "Edit Product"
          : "Add Product"}
      </DialogTitle>

      <DialogContent>
        <Stack
          spacing={2}
          sx={{
            mt: 1,
            width: 350,
          }}
        >
          <TextField
            label="Name"
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
          />

          <TextField
            label="Category"
            value={form.category}
            onChange={(e) =>
              setForm({
                ...form,
                category:
                  e.target.value,
              })
            }
          />

          <TextField
            label="Price"
            type="number"
            value={form.price}
            onChange={(e) =>
              setForm({
                ...form,
                price: e.target.value,
              })
            }
          />

          <TextField
            label="GST %"
            type="number"
            value={form.gstPercentage}
            onChange={(e) =>
              setForm({
                ...form,
                gstPercentage:
                  e.target.value,
              })
            }
          />

          <TextField
            select
            label="Purchase Type"
            value={form.purchaseType}
            onChange={(e) =>
              setForm({
                ...form,
                purchaseType:
                  e.target.value,
              })
            }
          >
            <MenuItem value="WITH_BILL">
              WITH_BILL
            </MenuItem>

            <MenuItem value="WITHOUT_BILL">
              WITHOUT_BILL
            </MenuItem>
          </TextField>

          <Button
            variant="contained"
            onClick={save}
          >
            Save
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}