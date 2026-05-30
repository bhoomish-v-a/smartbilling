import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Paper,
  Typography,
  Button,
} from "@mui/material";

import api from "../services/api";

export default function InvoicePreview() {
  const { id } = useParams();

  const [invoice, setInvoice] =
    useState<any>(null);

  useEffect(() => {
    loadInvoice();
  }, []);

  const loadInvoice = async () => {
    const res =
      await api.get(
        `/invoices/${id}`,
      );

    setInvoice(res.data);
  };

  if (!invoice) {
    return <div>Loading...</div>;
  }

  return (
    <Paper sx={{ p: 4 }}>
      <Typography variant="h4">
        Smart Billing
      </Typography>

      <Typography>
        Invoice:
        {" "}
        {invoice.invoiceNumber}
      </Typography>

      <Typography>
        Customer:
        {" "}
        {invoice.customerName}
      </Typography>

      <Typography>
        Phone:
        {" "}
        {invoice.customerPhone}
      </Typography>

      <hr />

      {invoice.items?.map(
        (item: any) => (
          <Typography
            key={item.id}
          >
            {
              item.product?.name
            }
            {" | Qty: "}
            {item.quantity}
            {" | ₹"}
            {item.price}
          </Typography>
        ),
      )}

      <hr />

      <Typography variant="h5">
        Total: ₹
        {invoice.totalAmount}
      </Typography>

      <Button
        variant="contained"
        sx={{ mt: 2 }}
        onClick={() =>
          window.print()
        }
      >
        Print Invoice
      </Button>
    </Paper>
  );
}