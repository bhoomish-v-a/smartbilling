import { useEffect, useState } from "react";
import {
  Grid,
  Paper,
  Typography,
} from "@mui/material";

import api from "../services/api";

export default function Dashboard() {
  const [summary, setSummary] =
    useState<any>(null);

  useEffect(() => {
    api
      .get("/dashboard/summary")
      .then((res) =>
        setSummary(res.data)
      );
  }, []);

  if (!summary) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Typography
        variant="h4"
        gutterBottom
      >
        Dashboard
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={3}>
          <Paper sx={{ p: 2 }}>
            <Typography>
              Products
            </Typography>

            <Typography variant="h4">
              {summary.products}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={3}>
          <Paper sx={{ p: 2 }}>
            <Typography>
              Purchases
            </Typography>

            <Typography variant="h4">
              {summary.purchases}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={3}>
          <Paper sx={{ p: 2 }}>
            <Typography>
              Invoices
            </Typography>

            <Typography variant="h4">
              {summary.invoices}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={3}>
          <Paper sx={{ p: 2 }}>
            <Typography>
              Sales
            </Typography>

            <Typography variant="h4">
              ₹{summary.sales}
            </Typography>
          </Paper>
        </Grid>
        <Paper sx={{ p: 2, mt: 3 }}>
  <Typography variant="h6">
    Low Stock Products
  </Typography>

  {summary.lowStockProducts
    ?.length === 0 && (
    <Typography>
      No low stock items
    </Typography>
  )}

  {summary.lowStockProducts?.map(
    (item: any) => (
      <Typography
        key={item.name}
      >
        ⚠ {item.name}
        {" - "}
        {item.available}
      </Typography>
    ),
  )}
</Paper>
      </Grid>
    </>
  );
}