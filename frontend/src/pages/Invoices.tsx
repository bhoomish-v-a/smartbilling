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
} from "@mui/material";

import api from "../services/api";

export default function Invoices() {
  const [invoices, setInvoices] =
    useState<any[]>([]);

  const [search, setSearch] =
    useState("");

  const [
    selectedInvoice,
    setSelectedInvoice,
  ] = useState<any>(null);

  const loadInvoices = async () => {
    const res =
      await api.get("/invoices");

    setInvoices(res.data);
  };

  useEffect(() => {
    loadInvoices();
  }, []);

  const viewInvoice =
    async (id: string) => {
      const res =
        await api.get(
          `/invoices/${id}`,
        );

      setSelectedInvoice(
        res.data,
      );
    };

  return (
    <>
      <Typography
        variant="h4"
        gutterBottom
      >
        Invoices
      </Typography>

      <TextField
        label="Search Invoice"
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        sx={{
          mb: 2,
          width: 300,
        }}
      />

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                Invoice No
              </TableCell>

              <TableCell>
                Customer
              </TableCell>

              <TableCell>
                Amount
              </TableCell>

              <TableCell>
                Date
              </TableCell>

              <TableCell>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {invoices
              .filter(
                (invoice) =>
                  invoice.invoiceNumber
                    ?.toLowerCase()
                    .includes(
                      search.toLowerCase(),
                    ) ||
                  invoice.customerName
                    ?.toLowerCase()
                    .includes(
                      search.toLowerCase(),
                    ),
              )
              .map((invoice) => (
                <TableRow
                  key={invoice.id}
                >
                  <TableCell>
                    {
                      invoice.invoiceNumber
                    }
                  </TableCell>

                  <TableCell>
                    {
                      invoice.customerName
                    }
                  </TableCell>

                  <TableCell>
                    ₹
                    {
                      invoice.totalAmount
                    }
                  </TableCell>

                  <TableCell>
                    {new Date(
                      invoice.createdAt,
                    ).toLocaleDateString()}
                  </TableCell>

                  <TableCell>
                    <Button
                      onClick={() =>
                        viewInvoice(
                          invoice.id,
                        )
                      }
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </Paper>

      <Dialog
        open={!!selectedInvoice}
        onClose={() =>
          setSelectedInvoice(
            null,
          )
        }
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Invoice Details
        </DialogTitle>

        <DialogContent>
          {selectedInvoice && (
            <>
              <Typography>
                Invoice:
                {" "}
                {
                  selectedInvoice.invoiceNumber
                }
              </Typography>

              <Typography>
                Customer:
                {" "}
                {
                  selectedInvoice.customerName
                }
              </Typography>

              <Typography>
                Phone:
                {" "}
                {
                  selectedInvoice.customerPhone
                }
              </Typography>

              <Typography>
                Total:
                ₹
                {
                  selectedInvoice.totalAmount
                }
              </Typography>

              <hr />

              <Typography
                variant="h6"
                sx={{ mt: 2 }}
              >
                Items
              </Typography>

              {selectedInvoice.items?.map(
                (
                  item: any,
                ) => (
                  <Typography
                    key={item.id}
                  >
                    {
                      item.product
                        ?.name
                    }
                    {" - "}
                    Qty:
                    {
                      item.quantity
                    }
                  </Typography>
                ),
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}