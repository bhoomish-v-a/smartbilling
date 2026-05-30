import type { Product } from "../types/Product";
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
} from "@mui/material";

import api from "../services/api";
import ProductForm from "../components/ProductForm";

export default function Products() {
  const [products, setProducts] =
    useState<Product[]>([]);

  const [open, setOpen] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [
    selectedProduct,
    setSelectedProduct,
  ] = useState<Product | null>(
    null,
  );

  const loadProducts = async () => {
    const res =
      await api.get("/products");

    setProducts(res.data);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const deleteProduct = async (
    id: string,
  ) => {
    if (
      !window.confirm(
        "Delete this product?",
      )
    ) {
      return;
    }

    await api.delete(
      `/products/${id}`,
    );

    loadProducts();
  };

  return (
    <>
      <Typography
        variant="h4"
        gutterBottom
      >
        Products
      </Typography>

      <Button
        variant="contained"
        onClick={() => {
          setSelectedProduct(null);
          setOpen(true);
        }}
      >
        Add Product
      </Button>

      <TextField
        label="Search Product"
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        sx={{
          ml: 2,
          mb: 2,
        }}
      />

      <Paper sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                Name
              </TableCell>

              <TableCell>
                Category
              </TableCell>

              <TableCell>
                Price
              </TableCell>

              <TableCell>
                GST %
              </TableCell>

              <TableCell>
                Purchase Type
              </TableCell>

              <TableCell>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {products
              .filter((product) =>
                product.name
                  .toLowerCase()
                  .includes(
                    search.toLowerCase(),
                  ),
              )
              .map((product) => (
                <TableRow
                  key={product.id}
                >
                  <TableCell>
                    {product.name}
                  </TableCell>

                  <TableCell>
                    {product.category}
                  </TableCell>

                  <TableCell>
                    {product.price}
                  </TableCell>

                  <TableCell>
                    {
                      product.gstPercentage
                    }
                  </TableCell>

                  <TableCell>
                    {
                      product.purchaseType
                    }
                  </TableCell>

                  <TableCell>
                    <Button
                      onClick={() => {
                        setSelectedProduct(
                          product,
                        );
                        setOpen(true);
                      }}
                    >
                      Edit
                    </Button>

                    <Button
                      color="error"
                      onClick={() =>
                        deleteProduct(
                          product.id,
                        )
                      }
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </Paper>

      <ProductForm
        open={open}
        product={
          selectedProduct
        }
        onClose={() => {
          setOpen(false);
          setSelectedProduct(
            null,
          );
        }}
        onSuccess={
          loadProducts
        }
      />
    </>
  );
}