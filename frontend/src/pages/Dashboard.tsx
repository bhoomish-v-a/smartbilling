import { useEffect, useState } from "react";
import {
  Grid,
  Paper,
  Typography,
  Box,
  Chip,
  Skeleton,
} from "@mui/material";
import InventoryIcon from "@mui/icons-material/Inventory";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ReceiptIcon from "@mui/icons-material/Receipt";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

import api from "../services/api";

const cardConfig = [
  { label: "Products", key: "products", icon: <InventoryIcon />, color: "#1976d2" },
  { label: "Purchases", key: "purchases", icon: <ShoppingCartIcon />, color: "#388e3c" },
  { label: "Invoices", key: "invoices", icon: <ReceiptIcon />, color: "#f57c00" },
  { label: "Total Sales", key: "sales", icon: <TrendingUpIcon />, color: "#7b1fa2", prefix: "₹" },
];

export default function Dashboard() {
  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    api.get("/dashboard/summary").then((res) => setSummary(res.data));
  }, []);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        {cardConfig.map((card) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={card.key}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                border: "1px solid",
                borderColor: "divider",
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Box
                sx={{
                  width: 52,
                  height: 52,
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: `${card.color}15`,
                  color: card.color,
                }}
              >
                {card.icon}
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  {card.label}
                </Typography>
                {summary ? (
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {card.prefix || ""}
                    {summary[card.key]?.toLocaleString?.() ?? summary[card.key] ?? 0}
                  </Typography>
                ) : (
                  <Skeleton width={60} />
                )}
              </Box>
            </Paper>
          </Grid>
        ))}

        <Grid size={{ xs: 12 }}>
          <Paper elevation={0} sx={{ p: 3, border: "1px solid", borderColor: "divider" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <WarningAmberIcon color="warning" />
              <Typography variant="h6">Low Stock Alerts</Typography>
            </Box>

            {!summary ? (
              <Skeleton height={80} />
            ) : summary.lowStockProducts?.length === 0 ? (
              <Typography color="text.secondary">All products are well-stocked</Typography>
            ) : (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {summary.lowStockProducts?.map((item: any) => (
                  <Chip
                    key={item.name}
                    label={`${item.name} - ${item.available} left`}
                    color="warning"
                    variant="outlined"
                  />
                ))}
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
